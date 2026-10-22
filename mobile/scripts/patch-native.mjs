// Lisää natiiviprojekteihin luvat ja versionumerot sen jälkeen, kun
// `npx cap add ios|android` on luonut ne. Ajetaan pilvikäännöksessä.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mobile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = Number(process.env.BUILD_NUMBER || process.env.PROJECT_BUILD_NUMBER || 1);
const versionName = process.env.APP_VERSION || '1.0.0';

// ---------- iOS ----------
const plist = path.join(mobile, 'ios/App/App/Info.plist');
if (fs.existsSync(plist)) {
  let s = fs.readFileSync(plist, 'utf8');
  const add = (key, xml) => {
    if (!s.includes(`<key>${key}</key>`)) s = s.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n\t${xml}\n</dict>\n</plist>\n`);
  };
  add('NSLocationWhenInUseUsageDescription', '<string>Kulku käyttää sijaintia vain lähimmän kaupungin valitsemiseen. Sijaintia ei tallenneta.</string>');
  add('ITSAppUsesNonExemptEncryption', '<false/>');
  s = s.replace(/<key>CFBundleDisplayName<\/key>\s*<string>[^<]*<\/string>/, '<key>CFBundleDisplayName</key>\n\t<string>Kulku</string>');
  fs.writeFileSync(plist, s);
  console.log('iOS Info.plist päivitetty');
}

// ---------- Android ----------
const manifest = path.join(mobile, 'android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifest)) {
  let s = fs.readFileSync(manifest, 'utf8');
  for (const perm of ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION', 'POST_NOTIFICATIONS']) {
    const line = `<uses-permission android:name="android.permission.${perm}" />`;
    if (!s.includes(`android.permission.${perm}"`)) s = s.replace('</manifest>', `    ${line}\n</manifest>`);
  }
  fs.writeFileSync(manifest, s);
  console.log('AndroidManifest.xml päivitetty');
}
const gradle = path.join(mobile, 'android/app/build.gradle');
if (fs.existsSync(gradle)) {
  let s = fs.readFileSync(gradle, 'utf8');
  s = s.replace(/versionCode\s+\d+/, `versionCode ${build}`).replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
  fs.writeFileSync(gradle, s);
  console.log(`Android versio ${versionName} (${build})`);
}
