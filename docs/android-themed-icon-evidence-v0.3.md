# Android Themed Icon Evidence v0.3

Status: API 35 emulator path is available locally; themed icon visual verification remains blocked by black emulator screenshots.

## Baseline

- Date: 2026-06-17 Europe/Moscow
- Branch: `codex/android-api35-themed-icon-evidence`
- Base main: `78789ae8096e537cb9b80014182c9a6d9663a937`
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Package: `com.doorrunner.memory`
- Activity: `com.doorrunner.memory/.MainActivity`
- AVD: `DoorRunner_API35_ATD`
- Device: `emulator-5554`
- Android: 15 / API 35
- System image: `system-images;android-35;google_atd;x86_64`

## Commands Checked

```powershell
sdkmanager --list_installed
sdkmanager --install 'system-images;android-35;google_atd;x86_64'
avdmanager create avd -n DoorRunner_API35_ATD -k 'system-images;android-35;google_atd;x86_64' -d 'medium_phone' --force
emulator -avd DoorRunner_API35_ATD -no-audio -no-snapshot -gpu swiftshader_indirect
adb shell getprop ro.build.version.sdk
adb shell getprop ro.build.version.release
bun run build
node .\node_modules\@capacitor\cli\bin\capacitor sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
adb -s emulator-5554 install -r android\app\build\outputs\apk\debug\app-debug.apk
adb -s emulator-5554 shell settings put secure themed_icons 1
adb -s emulator-5554 shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
adb -s emulator-5554 shell dumpsys window
adb -s emulator-5554 shell screencap -p /sdcard/api35_launched.png
```

## Results

| Area | Evidence | Result |
| --- | --- | --- |
| API 35 image | `system-images;android-35;google_atd;x86_64` installed successfully | Pass |
| API 35 AVD | `DoorRunner_API35_ATD` created and listed by `emulator -list-avds` | Pass |
| Emulator boot | `sys.boot_completed=1`; `ro.build.version.sdk=35`; `ro.build.version.release=15` | Pass |
| Debug build | `bun run build`, Capacitor sync, and `assembleDebug` completed | Pass |
| APK install | `adb install -r` returned `Success` | Pass |
| Themed icon setting | `settings get secure themed_icons` returned `1` after enabling | Pass |
| App launch | `monkey` launched `com.doorrunner.memory`; `dumpsys window` focused `MainActivity` | Pass |
| Visual themed icon screenshot | `screencap` output stayed fully black on API 35 | Blocked |
| Splash-to-home screenshot | `screencap` output stayed fully black after launch | Blocked |

## Themed Icon Interpretation

The APK builds and installs on an API 35 emulator with themed icons enabled, so the Android 13+ validation path now exists locally. This does not visually prove themed icon appearance because emulator screenshots are still black in this environment.

The current evidence is enough to confirm:

- API 35 emulator creation and boot are feasible.
- The debug APK installs and launches on API 35.
- The app package uses `targetSdk=36`.
- The themed icon toggle can be enabled on the emulator.

The current evidence is not enough to claim:

- Android 13+ themed icon visual readiness.
- Launcher icon readability under wallpaper-derived tint.
- Splash-to-home visual readiness.
- Recents/app drawer/settings icon visual readiness.

## Remaining Evidence Needed

- Capture a non-black screenshot or screen recording on API 33+ with themed icons enabled.
- Prefer a physical Android 13+ device or a local emulator renderer that can produce non-black `screencap` output.
- Record wallpaper/theme state and launcher settings used for the themed icon screenshot.
- Keep `docs/android-launcher-evidence-v0.3.md` as the API 30 install/launch evidence record.

