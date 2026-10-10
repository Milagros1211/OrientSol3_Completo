import assert from 'node:assert';

console.log('======================================================================');
console.log('TESTING PYODIDE DUAL ENVIRONMENT DETECTION (ELECTRON VS WEB)');
console.log('======================================================================');

// 1. Simulate Web Environment (window without isElectron or electronAPI, protocol http:)
{
  globalThis.window = {
    location: { protocol: 'http:', href: 'http://localhost:5173/' },
  };
  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36' },
    configurable: true,
  });

  const isElectronEnvironment = () => {
    if (globalThis.window.isElectron === true) return true;
    if (globalThis.window.electronAPI?.isElectron === true) return true;
    if (globalThis.window.location?.protocol === 'file:') return true;
    if (globalThis.navigator?.userAgent?.toLowerCase().includes('electron')) return true;
    return false;
  };

  const resolvePyodideIndexURL = () => {
    const isElectron = isElectronEnvironment();
    if (isElectron) {
      if (globalThis.window.location?.protocol === 'file:') {
        return { url: new URL('pyodide/', globalThis.window.location.href).href, isOfflineElectron: true };
      }
      return { url: './pyodide/', isOfflineElectron: true };
    }
    return { url: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/', isOfflineElectron: false };
  };

  const res = resolvePyodideIndexURL();
  console.log('[Web Test] Detected environment: isOfflineElectron =', res.isOfflineElectron);
  console.log('[Web Test] Pyodide indexURL =', res.url);
  assert.strictEqual(res.isOfflineElectron, false, 'Web should NOT be detected as Electron');
  assert.ok(res.url.includes('cdn.jsdelivr.net'), 'Web must point to official jsdelivr CDN');
  console.log('✓ Web environment correctly points to jsdelivr CDN.');
}

// 2. Simulate Electron Packaged Offline Environment (file: protocol and isElectron: true)
{
  globalThis.window = {
    isElectron: true,
    electronAPI: { isElectron: true },
    location: { protocol: 'file:', href: 'file:///C:/Users/app/dist/index.html' },
  };
  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Electron/44.5.1 Chrome/130.0.0.0 Safari/537.36' },
    configurable: true,
  });

  const isElectronEnvironment = () => {
    if (globalThis.window.isElectron === true) return true;
    if (globalThis.window.electronAPI?.isElectron === true) return true;
    if (globalThis.window.location?.protocol === 'file:') return true;
    if (globalThis.navigator?.userAgent?.toLowerCase().includes('electron')) return true;
    return false;
  };

  const resolvePyodideIndexURL = () => {
    const isElectron = isElectronEnvironment();
    if (isElectron) {
      if (globalThis.window.location?.protocol === 'file:') {
        return { url: new URL('pyodide/', globalThis.window.location.href).href, isOfflineElectron: true };
      }
      return { url: './pyodide/', isOfflineElectron: true };
    }
    return { url: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/', isOfflineElectron: false };
  };

  const res = resolvePyodideIndexURL();
  console.log('\n[Electron Test] Detected environment: isOfflineElectron =', res.isOfflineElectron);
  console.log('[Electron Test] Pyodide indexURL =', res.url);
  assert.strictEqual(res.isOfflineElectron, true, 'Electron must be detected as isOfflineElectron');
  assert.strictEqual(res.url, 'file:///C:/Users/app/dist/pyodide/', 'Electron must resolve local file path');
  console.log('✓ Electron environment correctly points to local offline /pyodide/ disk path.');
}

console.log('\n======================================================================');
console.log('ALL CONDITIONAL DUAL ENVIRONMENT TESTS PASSED (100%)');
console.log('======================================================================');
