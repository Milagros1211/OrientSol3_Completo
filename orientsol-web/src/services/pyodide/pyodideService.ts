import { loadPyodide, type PyodideInterface, version as PYODIDE_VERSION } from 'pyodide';
import type {
  PyodideRunOptions,
  PyodideRunResult,
  PyodideState,
  PyodideStatusListener,
} from '@/types/pyodide';
import { EMBEDDED_PYTHON_MODULES } from './pythonModules';

/**
 * Official jsdelivr CDN base URL corresponding to the Pyodide WebAssembly runtime.
 */
export const OFFICIAL_PYODIDE_CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION || '314.0.7'}/full/`;

/**
 * Dynamically detects whether the current environment is Electron (offline native app)
 * or a standard web browser (online).
 *
 * Checks:
 * 1. Global window.isElectron injected by Electron preload.js
 * 2. window.electronAPI?.isElectron exposed via contextBridge
 * 3. window.location.protocol === 'file:' (packaged local Electron app)
 * 4. navigator.userAgent containing 'Electron'
 * 5. process.versions.electron (Node runtime)
 */
export function isElectronEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Injected global variable from preload.js
  if ((window as any).isElectron === true) return true;

  // 2. Electron API bridge
  if ((window as any).electronAPI?.isElectron === true) return true;

  // 3. Local file protocol in packaged Electron
  if (window.location && window.location.protocol === 'file:') return true;

  // 4. User-agent sniffing
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    if (navigator.userAgent.toLowerCase().includes('electron')) return true;
  }

  // 5. Node/Electron process check
  if (typeof process !== 'undefined' && (process.versions as any)?.electron) {
    return true;
  }

  return false;
}

/**
 * Resolves the appropriate indexURL based on the detected runtime environment:
 * - Electron (offline): Local path (/pyodide/ or relative path ./pyodide/ to local disk)
 * - Web (online): Official jsdelivr CDN URL
 */
export function resolvePyodideIndexURL(indexURL?: string): { url: string; isOfflineElectron: boolean } {
  if (indexURL) {
    return { url: indexURL, isOfflineElectron: isElectronEnvironment() };
  }

  const isElectron = isElectronEnvironment();

  if (isElectron) {
    // In Electron, use relative or file-based local path to guarantee 100% offline functionality
    let localPath: string;
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
      // Resolves to local dist/pyodide/ folder on disk without internet
      localPath = new URL('pyodide/', window.location.href).href;
    } else {
      const base = import.meta.env?.BASE_URL || './';
      localPath = `${base.replace(/\/?$/, '/')}pyodide/`;
    }
    return { url: localPath, isOfflineElectron: true };
  }

  // Standard web browser: Load from official jsdelivr CDN
  return { url: OFFICIAL_PYODIDE_CDN_URL, isOfflineElectron: false };
}

/**
 * Service to manage and execute Pyodide in the browser for OrientSol calculations.
 */
export class PyodideService {
  private static instance: PyodideService | null = null;
  private pyodide: PyodideInterface | null = null;
  private initPromise: Promise<PyodideInterface> | null = null;
  private listeners: Set<PyodideStatusListener> = new Set();

  private stdoutBuffer: string[] = [];
  private stderrBuffer: string[] = [];

  private state: PyodideState = {
    status: 'idle',
    version: null,
    pythonVersion: null,
    error: null,
    loadProgress: 0,
    lastExecutionTimeMs: null,
    environment: undefined,
    indexURL: null,
  };

  private constructor() {}

  public static getInstance(): PyodideService {
    if (!PyodideService.instance) {
      PyodideService.instance = new PyodideService();
    }
    return PyodideService.instance;
  }

  /**
   * Returns true if currently running in an Electron environment.
   */
  public isElectron(): boolean {
    return isElectronEnvironment();
  }

  /**
   * Returns the current detected environment type.
   */
  public getEnvironment(): 'electron-offline' | 'web-online' {
    return this.isElectron() ? 'electron-offline' : 'web-online';
  }

  /**
   * Returns the resolved indexURL used to initialize Pyodide.
   */
  public getEffectiveIndexURL(): string | null {
    return this.state.indexURL || null;
  }

  public getState(): Readonly<PyodideState> {
    return { ...this.state };
  }

  public subscribe(listener: PyodideStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<PyodideState>): void {
    this.state = { ...this.state, ...partial };
    const currentState = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(currentState);
      } catch (err) {
        console.error('Error in Pyodide status listener:', err);
      }
    });
  }

  /**
   * Initializes the Pyodide WebAssembly runtime.
   * - Electron (offline): Uses local disk path (/pyodide/ or relative) + local NumPy wheel.
   * - Web (online): Uses official jsdelivr CDN + CDN NumPy package.
   */
  public async initialize(indexURL?: string): Promise<PyodideInterface> {
    if (this.pyodide) {
      return this.pyodide;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    const { url: targetIndexURL, isOfflineElectron } = resolvePyodideIndexURL(indexURL);
    const envMode: 'electron-offline' | 'web-online' = isOfflineElectron ? 'electron-offline' : 'web-online';

    this.updateState({
      status: 'loading',
      loadProgress: 10,
      error: null,
      environment: envMode,
      indexURL: targetIndexURL,
    });

    this.initPromise = (async () => {
      const startTime = performance.now();
      try {
        console.log(`[OrientSol Pyodide] Runtime Environment: ${isOfflineElectron ? 'Electron (Offline Native)' : 'Web Browser (Online CDN)'}`);
        console.log(`[OrientSol Pyodide] Loading Pyodide from indexURL: ${targetIndexURL}`);
        this.updateState({ loadProgress: 30 });

        let pyodide: PyodideInterface;
        try {
          pyodide = await loadPyodide({
            indexURL: targetIndexURL,
          });
        } catch (initErr) {
          // If online CDN failed (e.g. user is in web browser without active internet or strict firewall),
          // attempt graceful fallback to local /pyodide/ assets
          if (!isOfflineElectron && targetIndexURL.startsWith('http')) {
            console.warn('[OrientSol Pyodide] CDN initialization failed, attempting fallback to local /pyodide/...', initErr);
            const fallbackLocalURL = typeof window !== 'undefined'
              ? new URL('pyodide/', window.location.href).href
              : '/pyodide/';
            pyodide = await loadPyodide({
              indexURL: fallbackLocalURL,
            });
            this.updateState({ indexURL: fallbackLocalURL });
          } else {
            throw initErr;
          }
        }

        // Load NumPy package strictly and immediately after initializing Pyodide
        this.updateState({ loadProgress: 50 });
        console.log(`[OrientSol Pyodide] Loading NumPy package (${isOfflineElectron ? 'offline local wheel' : 'CDN'})...`);
        try {
          await pyodide.loadPackage('numpy');
        } catch (pkgErr) {
          console.warn('[OrientSol Pyodide] Direct loadPackage("numpy") failed, attempting wheel or micropip fallback...', pkgErr);
          try {
            if (isOfflineElectron) {
              // Direct wheel loading for Electron offline packaging
              const wheelName = 'numpy-2.4.6-cp314-cp314-pyemscripten_2026_0_wasm32.whl';
              const wheelUrl = `${targetIndexURL.replace(/\/?$/, '/')}/${wheelName}`;
              await pyodide.loadPackage(wheelUrl);
            } else {
              await pyodide.loadPackage('micropip');
              const micropip = (pyodide as any).pyimport('micropip');
              await micropip.install('numpy');
            }
          } catch (pipErr) {
            console.error('[OrientSol Pyodide] Fatal: Failed to load NumPy:', pipErr);
            throw new Error(`Failed to load NumPy: ${pkgErr instanceof Error ? pkgErr.message : String(pkgErr)}`);
          }
        }

        this.updateState({ loadProgress: 75 });

        // Capture stdout / stderr
        pyodide.setStdout({
          batched: (text: string) => {
            this.stdoutBuffer.push(text);
            console.log(`[Pyodide stdout]`, text);
          },
        });

        pyodide.setStderr({
          batched: (text: string) => {
            this.stderrBuffer.push(text);
            console.warn(`[Pyodide stderr]`, text);
          },
        });

        // Mount OrientSol embedded Python modules
        this.updateState({ loadProgress: 85 });
        for (const mod of EMBEDDED_PYTHON_MODULES) {
          const parts = mod.path.split('/').filter(Boolean);
          let current = '';
          for (let i = 0; i < parts.length - 1; i++) {
            current += '/' + parts[i];
            try {
              pyodide.FS.mkdir(current);
            } catch {
              // Directory exists
            }
          }
          pyodide.FS.writeFile(mod.path, mod.content);
        }

        // Configure sys.path so /orient is importable
        await pyodide.runPythonAsync(`
import sys
if '/orient' not in sys.path:
    sys.path.insert(0, '/orient')
`);

        // Query Python runtime metadata
        const pyVer = (await pyodide.runPythonAsync(`import sys; sys.version.split()[0]`)) as string;
        const pyodideVer = pyodide.version || '0.27+';

        const elapsed = Math.round(performance.now() - startTime);
        console.log(`[OrientSol Pyodide] Successfully initialized with NumPy in ${elapsed}ms (${envMode}). Python version: ${pyVer}`);

        this.pyodide = pyodide;
        this.updateState({
          status: 'ready',
          loadProgress: 100,
          version: pyodideVer,
          pythonVersion: pyVer,
          lastExecutionTimeMs: elapsed,
          environment: envMode,
        });

        return pyodide;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[OrientSol Pyodide] Initialization failed:', err);
        this.updateState({
          status: 'error',
          error: errorMsg,
          loadProgress: 0,
        });
        this.initPromise = null;
        throw err;
      }
    })();

    return this.initPromise;
  }

  /**
   * Run Python code asynchronously in Pyodide.
   */
  public async runPython<T = unknown>(
    code: string,
    options?: PyodideRunOptions
  ): Promise<PyodideRunResult<T>> {
    const py = await this.initialize();

    // Clear output buffers
    this.stdoutBuffer = [];
    this.stderrBuffer = [];

    const startTime = performance.now();

    try {
      // Injected globals
      if (options?.globals) {
        for (const [key, val] of Object.entries(options.globals)) {
          py.globals.set(key, val);
        }
      }

      // Pre-install packages if required
      if (options?.packages && options.packages.length > 0) {
        await py.loadPackage(options.packages);
      }

      const rawResult = await py.runPythonAsync(code);
      const executionTimeMs = Math.round(performance.now() - startTime);

      let finalResult = rawResult;
      // Convert PyProxy to native JS if applicable
      if (rawResult && typeof rawResult === 'object' && 'toJs' in rawResult && typeof rawResult.toJs === 'function') {
        finalResult = rawResult.toJs({ dict_converter: Object.fromEntries });
      }

      this.updateState({ lastExecutionTimeMs: executionTimeMs });

      return {
        success: true,
        result: finalResult as T,
        stdout: this.stdoutBuffer.join('\n'),
        stderr: this.stderrBuffer.join('\n'),
        executionTimeMs,
      };
    } catch (err: unknown) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        result: null as T,
        stdout: this.stdoutBuffer.join('\n'),
        stderr: this.stderrBuffer.join('\n'),
        executionTimeMs,
        error: errorMsg,
      };
    }
  }

  /**
   * Mount a virtual file into Pyodide's in-memory filesystem.
   * E.g. mountPythonModule('/orient/solar_geometry.py', fileContent)
   */
  public async mountFile(path: string, content: string): Promise<void> {
    const py = await this.initialize();
    
    // Ensure parent directories exist in Emscripten FS
    const parts = path.split('/').filter(Boolean);
    let current = '';
    for (let i = 0; i < parts.length - 1; i++) {
      current += '/' + parts[i];
      try {
        py.FS.mkdir(current);
      } catch {
        // Directory may already exist
      }
    }

    py.FS.writeFile(path, content);
    console.log(`[OrientSol Pyodide] Mounted virtual file: ${path}`);
  }

  /**
   * Load a Python package via pyodide.loadPackage
   */
  public async loadPackage(packages: string | string[]): Promise<void> {
    const py = await this.initialize();
    await py.loadPackage(packages);
  }
}

export const pyodideService = PyodideService.getInstance();
