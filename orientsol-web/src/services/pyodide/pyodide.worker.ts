import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;

interface WorkerMessage {
  id: string;
  type: 'init' | 'run' | 'mount' | 'loadPackage';
  payload?: any;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;

  try {
    if (type === 'init') {
      const indexURL = payload?.indexURL || '/pyodide/';
      if (!pyodide) {
        pyodide = await loadPyodide({ indexURL });
        await pyodide.loadPackage('numpy');
      }
      const pyVer = (await pyodide.runPythonAsync(`import sys; sys.version.split()[0]`)) as string;
      self.postMessage({ id, success: true, result: { pythonVersion: pyVer, pyodideVersion: pyodide.version } });
      return;
    }

    if (!pyodide) {
      pyodide = await loadPyodide({ indexURL: '/pyodide/' });
      await pyodide.loadPackage('numpy');
    }

    if (type === 'run') {
      const { code, globals } = payload;
      if (globals) {
        for (const [key, val] of Object.entries(globals)) {
          pyodide.globals.set(key, val);
        }
      }
      const rawResult = await pyodide.runPythonAsync(code);
      let result = rawResult;
      if (rawResult && typeof rawResult === 'object' && 'toJs' in rawResult && typeof rawResult.toJs === 'function') {
        result = rawResult.toJs({ dict_converter: Object.fromEntries });
      }
      self.postMessage({ id, success: true, result });
      return;
    }

    if (type === 'mount') {
      const { path, content } = payload;
      const parts = path.split('/').filter(Boolean);
      let current = '';
      for (let i = 0; i < parts.length - 1; i++) {
        current += '/' + parts[i];
        try {
          pyodide.FS.mkdir(current);
        } catch {
          // Exists
        }
      }
      pyodide.FS.writeFile(path, content);
      self.postMessage({ id, success: true });
      return;
    }

    if (type === 'loadPackage') {
      await pyodide.loadPackage(payload.packages);
      self.postMessage({ id, success: true });
      return;
    }

    throw new Error(`Unknown message type: ${type}`);
  } catch (err: any) {
    self.postMessage({ id, success: false, error: err?.message || String(err) });
  }
};
