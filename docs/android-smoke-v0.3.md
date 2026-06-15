# Android Emulator Smoke Evidence v0.3

Status: local debug APK smoke completed on the Android emulator.

## Baseline

- Date: 2026-06-15 Europe/Moscow
- Branch: `codex/android-emulator-smoke`
- Base main: `b5c5974ca756190d9f3d0eb5d1b609d0be2da97f`
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Package: `com.doorrunner.memory`
- Activity: `com.doorrunner.memory/.MainActivity`
- Emulator: `DoorRunner_API30_ATD`
- Device: `emulator-5554`
- Android: API 30
- WebView URL: `https://localhost/`

## Commands

```powershell
bun install --frozen-lockfile
bun run build
bun x cap sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk
adb -s emulator-5554 shell pm clear com.doorrunner.memory
adb -s emulator-5554 shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
```

WebView DevTools was attached through:

```powershell
adb -s emulator-5554 forward tcp:9222 localabstract:webview_devtools_remote_<pid>
```

## Results

| Area | Evidence | Result |
| --- | --- | --- |
| Install | `adb install -r` returned `Success` | Pass |
| Launch | `monkey` launched the package and `dumpsys window` focused `MainActivity` | Pass |
| Home render | WebView DOM title was `Door Runner Memory`, root had one rendered child, body contained home text | Pass |
| Settings persistence | Theme changed to `neon`, app was force-stopped/relaunched, `localStorage.drm_theme` remained `neon` | Pass |
| Regular game start | `PLAY!` opened the game scene and exposed `data-correct-lane` | Pass |
| Tap/click lane input | Correct door/lane was clicked; body text included `Correct! Score: 1` | Pass |
| Score save path | Back action opened score save dialog; `Android Smoke` saved into `drm_leaderboard` | Pass |
| Runtime errors | Filtered logcat found no `SyntaxError`, `Uncaught`, `ReferenceError`, `TypeError`, or `ERR_FILE_NOT_FOUND` from the app after the SystemBars config fix | Pass |

## Android Config Notes

- `android/app/build.gradle` currently uses `versionCode 1` and `versionName "1.0"` from the generated Capacitor project.
- App icon and splash assets are still generated defaults; they are not final branded Android release art.
- `capacitor.config.json` disables Capacitor `SystemBars.insetsHandling` to avoid early WebView safe-area CSS injection errors on the API 30 emulator.
- Debug signing only. Android versioning/signing policy is documented, but no release keystore, signed APK/AAB, or Play Store artifact is configured.

## Remaining Gaps

- No real-device smoke yet.
- No Android performance profiling yet.
- No release keystore, signed release artifact, or Play Store track process yet.
- No Play Store track or rollout process yet.
- Android Gradle `assembleDebug` is covered by the Linux CI lane after the Android debug build workflow update; emulator gameplay smoke remains local/manual.
