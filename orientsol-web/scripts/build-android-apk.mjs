import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');

console.log('======================================================================');
console.log('ORIENTSOL 3.0 - ANDROID APK BUILDER (CAPACITOR)');
console.log('======================================================================');

if (!fs.existsSync(androidDir)) {
  console.error('[Error] Android project directory not found. Run "npm run cap:add:android" first.');
  process.exit(1);
}

const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const gradlewPath = path.join(androidDir, gradlew);

console.log(`[APK Builder] Checking Gradle wrapper at: ${gradlewPath}`);
console.log('[APK Builder] Executing Gradle assembleDebug...');

const proc = spawn(gradlewPath, ['assembleDebug'], {
  cwd: androidDir,
  shell: true,
  stdio: 'inherit',
});

proc.on('close', (code) => {
  if (code === 0) {
    const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    console.log('\n[SUCCESS] Android APK built successfully!');
    if (fs.existsSync(apkPath)) {
      console.log(`[APK Location]: ${apkPath}`);
    } else {
      console.log(`[APK Directory]: ${path.join(androidDir, 'app', 'build', 'outputs', 'apk')}`);
    }
  } else {
    console.log(`\n[Info] Gradle assembleDebug finished with code ${code}.`);
    console.log('[Note] If Java JDK or Android SDK is not in system PATH, open the project in Android Studio with:');
    console.log('       npm run cap:open:android');
    console.log('       Or install OpenJDK 17/21 and Android Command Line Tools.');
  }
});
