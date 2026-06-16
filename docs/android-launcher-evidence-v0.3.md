# Android Launcher And Splash Evidence v0.3

Status: partial emulator evidence recorded; visual launcher/splash screenshots remain blocked in this local emulator run.

## Baseline

- Date: 2026-06-17 Europe/Moscow
- Branch: `codex/android-launcher-evidence`
- Base main: `197cce8b7fca9264e4c142c96ecedd944a424cd9`
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Package: `com.doorrunner.memory`
- Activity: `com.doorrunner.memory/.MainActivity`
- AVD: `DoorRunner_API30_ATD`
- Device: `emulator-5554`
- Android: 11 / API 30

## Recovery Note

The previous run was interrupted while waiting for `DoorRunner_API30_ATD` to boot. On recovery, no emulator process was running and `adb devices` had no active device. The AVD was restarted and reached `sys.boot_completed=1`.

## Commands Checked

```powershell
bun run build
node .\node_modules\@capacitor\cli\bin\capacitor sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
adb -s emulator-5554 install -r android\app\build\outputs\apk\debug\app-debug.apk
adb -s emulator-5554 shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
adb -s emulator-5554 shell dumpsys window
adb -s emulator-5554 shell screencap -p /sdcard/<capture>.png
```

## Results

| Area | Evidence | Result |
| --- | --- | --- |
| Emulator boot | `sys.boot_completed=1`; `ro.build.version.sdk=30`; `ro.build.version.release=11` | Pass |
| APK install | `adb install -r` returned `Success` | Pass |
| App launch | `monkey` launched `com.doorrunner.memory`; `dumpsys window` focused `MainActivity` | Pass |
| Splash-to-home screenshot | `screencap` output stayed fully black after launch | Blocked |
| Launcher/home screenshot | `screencap` output stayed fully black on home screen | Blocked |
| App info/settings screenshot | `android.settings.APPLICATION_DETAILS_SETTINGS` did not resolve on this ATD image | Blocked |
| Android 13 themed icon | Current emulator is API 30; themed icons require Android 13/API 33+ launcher behavior | Not verified |

## Screenshot Blocker Details

Both emulator modes produced black screenshots:

- Headless: `emulator -avd DoorRunner_API30_ATD -no-window -no-audio -no-snapshot`
- Visible/software renderer: `emulator -avd DoorRunner_API30_ATD -no-audio -no-snapshot -gpu swiftshader_indirect`

The app activity was focused while the screenshot remained black:

```text
mCurrentFocus=Window{... com.doorrunner.memory/com.doorrunner.memory.MainActivity}
mFocusedApp=ActivityRecord{... com.doorrunner.memory/.MainActivity ...}
```

This evidence verifies install and launch plumbing, but it does not visually verify launcher icon readability, splash transition, recents, app drawer, settings/app-info icon, adaptive masks, or themed icon appearance.

## Remaining Evidence Needed

- Capture launcher icon on home screen, app drawer, recents, and app info on a renderer that produces non-black screenshots.
- Capture splash-to-home transition screenshot or screen recording.
- Verify Android 13 themed icon on API 33+ emulator or real device with themed icons enabled.
- Record real-device smoke evidence.
- Record physical-device performance evidence.
- Record signed APK/AAB and Play/internal testing evidence before claiming Android release readiness.

