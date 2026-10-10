/**
 * Pyodide execution and lifecycle types for OrientSol Web
 */

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PyodideState {
  status: PyodideStatus;
  version: string | null;
  pythonVersion: string | null;
  error: string | null;
  loadProgress: number; // 0 to 100
  lastExecutionTimeMs: number | null;
  environment?: 'electron-offline' | 'web-online';
  indexURL?: string | null;
}

export interface PyodideRunOptions {
  /** Variables to inject into the Python global scope */
  globals?: Record<string, unknown>;
  /** Python packages to install via micropip before execution */
  packages?: string[];
  /** Execution timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

export interface PyodideRunResult<T = unknown> {
  success: boolean;
  result: T;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  error?: string;
}

export type PyodideStatusListener = (state: PyodideState) => void;
