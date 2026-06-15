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

## Build And Install Commands

Record the exact commands used. For a local debug APK, the baseline flow is:

```powershell
bun install --frozen-lockfile
bun run build
bun x cap sync android
Push-Location android
.\gradlew.bat assembleDebug
Pop-Location
adb devices
adb -s <device-id> install -r android/app/build/outputs/apk/debug/app-debug.apk
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
adb -s <device-id> shell dumpsys window | Select-String 'mCurrentFocus|mFocusedApp'
```

For a signed release artifact, record the signing approach without secrets and use the exact generated APK/AAB install path or testing-track source.

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

## Logcat Scan

Use a bounded scan and paste the filter result summary, not a full noisy log.

```powershell
adb -s <device-id> logcat -c
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
Start-Sleep -Seconds 5
adb -s <device-id> logcat -d | Select-String 'DoorRunner|Capacitor|chromium|AndroidRuntime|FATAL EXCEPTION|SyntaxError|Uncaught|ReferenceError|TypeError|ERR_FILE_NOT_FOUND'
```

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
