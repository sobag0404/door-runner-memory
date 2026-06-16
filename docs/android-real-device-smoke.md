# Android Real-Device Smoke Template

Status: template only. No real-device Android smoke has been completed yet.

Use this document when a debug APK, signed release APK, or signed release AAB-derived install is checked on physical hardware. Do not claim Android release readiness until the evidence section is completed for a real device.

## Baseline

- Date:
- Tester:
- Commit or tag:
- GitHub Actions CI run:
- Artifact type: debug APK / signed release APK / signed release AAB
- Artifact path or source:
- Artifact hash, if published:
- Package: `com.doorrunner.memory`
- Activity: `com.doorrunner.memory/.MainActivity`
- Device model:
- Manufacturer:
- Android version / API level:
- Android System WebView version:
- Install source: `adb install`, Android Studio, internal testing track, or other
- Screenshot or screen recording path, if captured:

## Required Evidence Packet

Record this packet for any Android 13+ physical-device validation, especially while emulator screenshots remain blocked by black `screencap` output in `docs/android-launcher-evidence-v0.3.md` and `docs/android-themed-icon-evidence-v0.3.md`.

- Commit or tag:
- GitHub Actions CI run:
- Artifact type: debug APK / signed release APK / signed release AAB
- Artifact path or source:
- Artifact hash:
- Package: `com.doorrunner.memory`
- Device ID from `adb devices`:
- Device model:
- Manufacturer:
- Android version / API level:
- Android System WebView version:
- Themed icons enabled: yes / no / not supported
- Wallpaper/theme state used for themed icon review:
- Evidence folder:

Expected evidence filenames:

- `android-real-device-home.png`
- `android-real-device-launcher-icon.png`
- `android-real-device-themed-icon.png`
- `android-real-device-app-drawer.png`
- `android-real-device-recents.png`
- `android-real-device-app-info.png`
- `android-real-device-splash-to-home.mp4`
- `android-real-device-logcat-filter.txt`
- `android-real-device-performance-notes.md`

## Build And Install Commands

Record the exact commands used. For a local debug APK, the baseline flow is:

```powershell
bun install --frozen-lockfile
bun run build
node .\node_modules\@capacitor\cli\bin\capacitor sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
adb devices
adb -s <device-id> install -r android/app/build/outputs/apk/debug/app-debug.apk
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
adb -s <device-id> shell dumpsys window | Select-String 'mCurrentFocus|mFocusedApp'
```

For a signed release artifact, record the signing approach without secrets and use the exact generated APK/AAB install path or testing-track source.

## Artifact Hash

For a debug APK:

```powershell
Get-FileHash android/app/build/outputs/apk/debug/app-debug.apk -Algorithm SHA256
```

For a signed APK/AAB, replace the path with the signed artifact path. Record only the hash and path, never signing credentials.

## Device And WebView Metadata

```powershell
adb -s <device-id> shell getprop ro.product.manufacturer
adb -s <device-id> shell getprop ro.product.model
adb -s <device-id> shell getprop ro.build.version.release
adb -s <device-id> shell getprop ro.build.version.sdk
adb -s <device-id> shell dumpsys package com.google.android.webview | Select-String 'versionName|versionCode'
adb -s <device-id> shell dumpsys package com.android.webview | Select-String 'versionName|versionCode'
adb -s <device-id> shell cmd package dump com.doorrunner.memory | Select-String 'versionCode|versionName|targetSdk'
```

## Visual Evidence Commands

Use device screenshots or screen recordings when `adb screencap` works. If the device blocks screenshots, capture photos externally and record that method.

```powershell
adb -s <device-id> shell input keyevent KEYCODE_WAKEUP
adb -s <device-id> shell wm dismiss-keyguard
adb -s <device-id> shell input keyevent HOME
adb -s <device-id> shell screencap -p /sdcard/android-real-device-home.png
adb -s <device-id> pull /sdcard/android-real-device-home.png .

adb -s <device-id> shell settings put secure themed_icons 1
adb -s <device-id> shell settings get secure themed_icons
adb -s <device-id> shell screencap -p /sdcard/android-real-device-themed-icon.png
adb -s <device-id> pull /sdcard/android-real-device-themed-icon.png .

adb -s <device-id> shell screenrecord --time-limit 10 /sdcard/android-real-device-splash-to-home.mp4
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
Start-Sleep -Seconds 10
adb -s <device-id> pull /sdcard/android-real-device-splash-to-home.mp4 .
```

If `settings put secure themed_icons 1` is rejected, enable themed icons manually in launcher settings and record the path used.

## Functional Checks

| Area | Evidence | Result |
| --- | --- | --- |
| Install | Install command or track install completed | Not run |
| Launch | App starts and foreground activity is `MainActivity` | Not run |
| Home render | Home screen text and primary controls are visible | Not run |
| Regular game start | Regular game starts from the home screen | Not run |
| Tap input | Door/lane tap changes game state as expected | Not run |
| Swipe input | Swipe lane input works, or blocker is recorded | Not run |
| Back behavior | Android back opens/closes the expected dialog or returns safely | Not run |
| Settings persistence | Theme/language/sound setting survives app restart | Not run |
| Local leaderboard | Score save path writes and displays a local leaderboard entry | Not run |
| Audio/haptics | Device audio/haptics behavior is checked if enabled | Not run |
| Orientation/viewport | Portrait layout fits the physical screen without clipping core controls | Not run |
| First-load network state | First launch works with normal connectivity | Not run |
| Offline caveat | Airplane-mode/offline behavior is checked after the app has been opened at least once; first offline launch is not assumed ready unless explicitly verified | Not run |
| Runtime errors | Logcat scan finds no app `SyntaxError`, `Uncaught`, `ReferenceError`, `TypeError`, `ERR_FILE_NOT_FOUND`, or fatal crash | Not run |
| Launcher icon | Home/app drawer icon is readable and uses project-specific artwork | Not run |
| Themed icon | Android 13+ themed icon renders with wallpaper-derived tint, or blocker is recorded | Not run |
| Splash-to-home recording | Splash transition reaches the home screen without black/blank frame or stuck state | Not run |

## Logcat Scan

Use a bounded scan and paste the filter result summary, not a full noisy log.

```powershell
adb -s <device-id> logcat -c
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
Start-Sleep -Seconds 5
adb -s <device-id> logcat -d | Select-String 'DoorRunner|Capacitor|chromium|AndroidRuntime|FATAL EXCEPTION|SyntaxError|Uncaught|ReferenceError|TypeError|ERR_FILE_NOT_FOUND'
```

Save the filtered output summary as:

- `android-real-device-logcat-filter.txt`

## Performance Notes

Record observations from a physical device, not an emulator. Use `docs/android-performance-profile.md` for a fuller profiling pass.

- Cold launch time:
- Warm launch time:
- Tap/input latency:
- 10-minute session result:
- Battery drain observation:
- Thermal/throttling observation:
- Visual readability on device brightness:
- Audio/haptics observation, if enabled:

## Final Result

- Result: pass / fail / blocked
- Blockers:
- Follow-up required:

## Readiness Interpretation

- Passing this smoke on one device is evidence for that device only.
- Android release readiness still requires versioned and signed artifact evidence, real-device smoke, performance notes, and a documented release or testing-track process.
- Do not include keystore files, signing passwords, Play service account JSON, tokens, or upload credentials in this document.
