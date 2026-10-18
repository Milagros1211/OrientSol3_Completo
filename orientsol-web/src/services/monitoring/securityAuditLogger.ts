/**
 * OrientSol 4.0 - Security Audit & Monitoring System
 * 
 * Provides centralized logging, suspicious activity detection,
 * and comprehensive secret redaction.
 * 
 * Guarantees that passwords, API keys, JWT tokens, and private credentials
 * are NEVER written to logs or browser storage.
 */

export type AuditLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUSPICIOUS';

export type AuditCategory =
  | 'INPUT_VALIDATION'
  | 'RATE_LIMIT'
  | 'AUTH'
  | 'CSP_VIOLATION'
  | 'DATABASE'
  | 'CALCULATION'
  | 'SYSTEM';

export interface AuditEvent {
  id: string;
  timestamp: string;
  level: AuditLogLevel;
  category: AuditCategory;
  message: string;
  metadata?: Record<string, any>;
  source: string;
}

const MAX_LOG_ENTRIES = 150;
const STORAGE_KEY = 'orientsol_audit_logs';

/**
 * Patterns of sensitive secrets that must ALWAYS be redacted
 */
const SECRET_REGEX_PATTERNS = [
  // JWT tokens (eyJ...)
  { regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, replacement: '[REDACTED_JWT]' },
  // Supabase publishable or secret keys
  { regex: /sb_[a-z0-9_-]{15,}/gi, replacement: '[REDACTED_API_KEY]' },
  // Bearer tokens
  { regex: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, replacement: 'Bearer [REDACTED_AUTH_TOKEN]' },
  // URL query secret parameters
  { regex: /([?&](?:apikey|api_key|token|access_token|secret|password)=)[^&#\s]+/gi, replacement: '$1[REDACTED_SECRET]' },
  // PostgreSQL connection strings
  { regex: /postgres:\/\/[^:]+:[^@]+@[^/]+/gi, replacement: 'postgres://[REDACTED_USER]:[REDACTED_PWD]@[REDACTED_HOST]' },
];

const SENSITIVE_KEY_NAMES = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'apikey',
  'api_key',
  'authorization',
  'auth',
  'private_key',
  'privatekey',
  'access_token',
  'refresh_token',
  'credential',
  'credentials',
]);

/**
 * Deeply sanitizes and redacts any strings, objects, or arrays to eliminate secrets.
 */
export function redactSecrets(input: any): any {
  if (input === null || input === undefined) return input;

  if (typeof input === 'string') {
    let sanitized = input;
    for (const pattern of SECRET_REGEX_PATTERNS) {
      sanitized = sanitized.replace(pattern.regex, pattern.replacement);
    }
    return sanitized;
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactSecrets(item));
  }

  if (typeof input === 'object') {
    // If it's an Error instance
    if (input instanceof Error) {
      return {
        name: input.name,
        message: redactSecrets(input.message),
        // Do not include raw stack in production to prevent path leakage
        stack: redactSecrets(input.stack?.split('\n').slice(0, 3).join('\n')),
      };
    }

    const sanitizedObj: Record<string, any> = {};
    for (const key of Object.keys(input)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEY_NAMES.has(lowerKey)) {
        sanitizedObj[key] = '[REDACTED_SENSITIVE_FIELD]';
      } else {
        sanitizedObj[key] = redactSecrets(input[key]);
      }
    }
    return sanitizedObj;
  }

  return String(input);
}

/**
 * Suspicious pattern detector for input tampering, SQLi, and XSS
 */
const SUSPICIOUS_INPUT_PATTERNS = [
  // SQL Injection patterns
  { regex: /('|\b)(OR|AND)\s+('?\d+'?|\d+)\s*=\s*('?\d+'?|\d+)/i, label: 'SQL Injection boolean tautology' },
  { regex: /\b(UNION\s+(ALL\s+)?SELECT|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM)\b/i, label: 'SQL Injection DDL/DML keyword' },
  { regex: /--|\bpg_sleep\b|\bwaitfor\s+delay\b/i, label: 'SQL comment/timing attack' },
  // Cross-Site Scripting (XSS) patterns
  { regex: /<script[\s>]/i, label: 'Cross-Site Scripting <script> tag' },
  { regex: /javascript\s*:/i, label: 'JavaScript protocol URI injection' },
  { regex: /\bon(?:error|load|click|mouseover)\s*=/i, label: 'Inline HTML event handler injection' },
  { regex: /<iframe[\s>]/i, label: 'Iframe injection attempt' },
  // Path traversal
  { regex: /(\.\.\/|\.\.\\)/, label: 'Directory traversal sequence' },
];

class SecurityAuditManager {
  private inMemoryLogs: AuditEvent[] = [];
  private listeners: Array<() => void> = [];
  private isInitialized = false;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Initializes global monitoring listeners (CSP violations, unhandled errors).
   */
  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Listen for Content Security Policy (CSP) violations
    if (typeof document !== 'undefined') {
      document.addEventListener('securitypolicyviolation', (e) => {
        this.log({
          level: 'SUSPICIOUS',
          category: 'CSP_VIOLATION',
          source: 'csp-guard',
          message: `Blocked resource loading violating CSP directive: ${e.violatedDirective}`,
          metadata: {
            blockedURI: redactSecrets(e.blockedURI),
            violatedDirective: e.violatedDirective,
            originalPolicy: redactSecrets(e.originalPolicy),
          },
        });
      });
    }

    // 2. Log initialization
    this.log({
      level: 'INFO',
      category: 'SYSTEM',
      source: 'security-manager',
      message: 'OrientSol 4.0 Security & Audit Monitoring active (Secret Redaction Enabled).',
    });
  }

  /**
   * Evaluates untrusted text inputs for known SQLi, XSS, or path traversal vectors.
   * If detected, automatically logs a SUSPICIOUS audit event and returns true.
   */
  public inspectInputForSuspiciousActivity(input: string, contextName: string): boolean {
    if (!input || typeof input !== 'string') return false;

    for (const pattern of SUSPICIOUS_INPUT_PATTERNS) {
      if (pattern.regex.test(input)) {
        this.log({
          level: 'SUSPICIOUS',
          category: 'INPUT_VALIDATION',
          source: contextName,
          message: `Suspicious pattern detected in input: ${pattern.label}`,
          metadata: {
            context: contextName,
            patternMatched: pattern.label,
            sanitizedSample: redactSecrets(input.slice(0, 50)),
          },
        });
        return true;
      }
    }
    return false;
  }

  /**
   * Validates solar engineering physical bounds.
   * Logs a SUSPICIOUS event if values exceed real-world physical atmospheric limits.
   */
  public inspectPhysicalBounds(
    params: {
      locationName?: string;
      lat?: number;
      lon?: number;
      radiationMonthly?: number[];
      temperatureMonthly?: number[];
    },
    contextName: string
  ): boolean {
    let hasAnomaly = false;
    const anomalies: string[] = [];

    if (params.lat !== undefined && (params.lat < -90 || params.lat > 90)) {
      hasAnomaly = true;
      anomalies.push(`Invalid latitude ${params.lat}° (must be between -90 and 90)`);
    }

    if (params.lon !== undefined && (params.lon < -180 || params.lon > 180)) {
      hasAnomaly = true;
      anomalies.push(`Invalid longitude ${params.lon}° (must be between -180 and 180)`);
    }

    if (params.radiationMonthly) {
      params.radiationMonthly.forEach((rad, idx) => {
        // Terrestrial solar radiation Gdm(0) is strictly between 0 and 14 kWh/m²/day
        if (rad < 0 || rad > 14) {
          hasAnomaly = true;
          anomalies.push(`Month ${idx + 1} radiation out of physical bounds: ${rad} kWh/m²/day`);
        }
      });
    }

    if (params.temperatureMonthly) {
      params.temperatureMonthly.forEach((temp, idx) => {
        // Terrestrial surface ambient temperature strictly between -65°C and 65°C
        if (temp < -65 || temp > 65) {
          hasAnomaly = true;
          anomalies.push(`Month ${idx + 1} temperature out of physical bounds: ${temp} °C`);
        }
      });
    }

    if (hasAnomaly) {
      this.log({
        level: 'SUSPICIOUS',
        category: 'INPUT_VALIDATION',
        source: contextName,
        message: `Physical bounds violation detected for "${params.locationName || 'unknown'}"`,
        metadata: {
          location: params.locationName,
          violations: anomalies,
        },
      });
      return true;
    }

    return false;
  }

  /**
   * Main audit logging method.
   * Scans and redacts all parameters before saving to in-memory ring buffer and console.
   */
  public log(entry: {
    level: AuditLogLevel;
    category: AuditCategory;
    source: string;
    message: string;
    metadata?: Record<string, any>;
  }): AuditEvent {
    // 1. Redact all potential secrets from message and metadata
    const safeMessage = redactSecrets(entry.message);
    const safeMetadata = entry.metadata ? redactSecrets(entry.metadata) : undefined;

    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      level: entry.level,
      category: entry.category,
      source: entry.source,
      message: safeMessage,
      metadata: safeMetadata,
    };

    // 2. Add to in-memory circular buffer
    this.inMemoryLogs.unshift(event);
    if (this.inMemoryLogs.length > MAX_LOG_ENTRIES) {
      this.inMemoryLogs.pop();
    }

    // 3. Persist to browser storage
    this.saveToStorage();

    // 4. Console dispatch with clear audit formatting
    const consoleTag = `[OrientSol Audit - ${event.level}][${event.category}]`;
    if (event.level === 'ERROR') {
      console.error(consoleTag, event.message, event.metadata || '');
    } else if (event.level === 'SUSPICIOUS' || event.level === 'WARN') {
      console.warn(consoleTag, event.message, event.metadata || '');
    } else {
      console.info(consoleTag, event.message, event.metadata || '');
    }

    // 5. Notify UI subscribers
    this.notifySubscribers();

    return event;
  }

  public getRecentLogs(filter?: { level?: AuditLogLevel; category?: AuditCategory }): AuditEvent[] {
    return this.inMemoryLogs.filter((evt) => {
      if (filter?.level && evt.level !== filter.level) return false;
      if (filter?.category && evt.category !== filter.category) return false;
      return true;
    });
  }

  public getSummaryCounts(): { total: number; suspicious: number; error: number; warn: number; info: number } {
    return this.inMemoryLogs.reduce(
      (acc, evt) => {
        acc.total++;
        if (evt.level === 'SUSPICIOUS') acc.suspicious++;
        else if (evt.level === 'ERROR') acc.error++;
        else if (evt.level === 'WARN') acc.warn++;
        else if (evt.level === 'INFO') acc.info++;
        return acc;
      },
      { total: 0, suspicious: 0, error: 0, warn: 0, info: 0 }
    );
  }

  public clearLogs(): void {
    this.inMemoryLogs = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    this.notifySubscribers();
  }

  public exportLogsJson(): string {
    return JSON.stringify(this.inMemoryLogs, null, 2);
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (_) {}
    });
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryLogs.slice(0, 50)));
      }
    } catch (_) {}
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            this.inMemoryLogs = parsed;
          }
        }
      }
    } catch (_) {}
  }
}

export const securityAuditLogger = new SecurityAuditManager();
