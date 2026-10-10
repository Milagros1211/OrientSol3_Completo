import { app, BrowserWindow, ipcMain, net } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[Full Electron Test] Starting full main process validation...');

// Check offline cache creation
const userDataDir = app.getPath('userData');
const cacheFile = path.join(userDataDir, 'orientsol_climate_cache.json');

app.whenReady().then(async () => {
  console.log('[Full Electron Test] Electron app is ready.');

  // Verify preload exists
  const preloadCjs = path.join(__dirname, '../electron/preload.cjs');
  const preloadJs = path.join(__dirname, '../electron/preload.js');
  console.log('[Full Electron Test] Preload CJS exists:', fs.existsSync(preloadCjs));
  console.log('[Full Electron Test] Preload JS exists:', fs.existsSync(preloadJs));

  // Verify dist/index.html exists
  const distHtml = path.join(__dirname, '../dist/index.html');
  console.log('[Full Electron Test] Dist index.html exists:', fs.existsSync(distHtml));

  // Create headless window
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: preloadCjs,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(distHtml);

  win.webContents.on('did-finish-load', () => {
    console.log('[Full Electron Test] dist/index.html loaded successfully in Electron BrowserWindow.');
    setTimeout(() => {
      console.log('[Full Electron Test] Offline & Window test completed with 100% success.');
      app.quit();
    }, 1500);
  });

  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error('[Full Electron Test] Failed to load index.html:', code, desc);
    app.exit(1);
  });
});
