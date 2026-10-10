import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../node_modules/pyodide');
const destDir = path.resolve(__dirname, '../public/pyodide');

const requiredFiles = [
  'pyodide.asm.wasm',
  'pyodide.asm.mjs',
  'pyodide.mjs',
  'pyodide.js',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy core files
for (const file of requiredFiles) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Pyodide] Copied ${file} -> public/pyodide/${file}`);
  } else {
    console.warn(`[Pyodide] Warning: ${file} not found in node_modules/pyodide`);
  }
}

// Copy all package wheels (.whl) such as numpy
const allFiles = fs.readdirSync(srcDir);
for (const file of allFiles) {
  if (file.endsWith('.whl')) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
    console.log(`[Pyodide] Copied wheel package ${file} -> public/pyodide/${file}`);
  }
}

console.log('[Pyodide] Setup complete: runtime files and wheels copied to public/pyodide/');
