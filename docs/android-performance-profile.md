# Android Performance Profile Template

Status: template only. No physical-device Android performance profile has been completed yet.

Use this document after a debug APK, signed release APK, or signed release AAB-derived install is running on a real Android device. Emulator results may be useful for debugging, but they are not release-readiness evidence.

## Baseline

- Date:
- Tester:
- Commit or tag:
- GitHub Actions CI run:
- Artifact type: debug APK / signed release APK / signed release AAB
- Artifact path or source:
- Package: `com.doorrunner.memory`
- Device model:
- Manufacturer:
- Android version / API level:
- Android System WebView version:
- Battery level at start:
- Battery level at end:
- Screen brightness:
- Charging state:
- Network state:
- Power mode / battery saver state:
- Reduced-motion setting:

## Measurement Setup

Record the tools and commands used. At minimum, clear logs before the run and capture a filtered logcat summary after the run.

- Profiling tool or command used:
- Run duration:
- Raw profile artifact path, if captured:
- Screenshot or screen recording path, if captured:

```powershell
adb devices
adb -s <device-id> logcat -c
adb -s <device-id> shell monkey -p com.doorrunner.memory -c android.intent.category.LAUNCHER 1
```

Optional memory snapshots:

```powershell
adb -s <device-id> shell dumpsys meminfo com.doorrunner.memory
```

Runtime error scan:

```powershell
adb -s <device-id> logcat -d | Select-String 'DoorRunner|Capacitor|chromium|AndroidRuntime|FATAL EXCEPTION|SyntaxError|Uncaught|ReferenceError|TypeError|ERR_FILE_NOT_FOUND|OutOfMemory'
```

## Profile Checks

| Area | Evidence To Record | Gate |
| --- | --- | --- |
| Cold startup | Sample count, median, and max time from launcher tap to usable home screen | Record observation; no release threshold defined yet |
| Warm startup | Sample count, median, and max time from relaunch to usable home screen | Record observation; no release threshold defined yet |
| Game start | Time from `PLAY!` tap to interactive game scene | Record observation; no release threshold defined yet |
| Input latency | Tap/swipe responsiveness during normal play | No obvious delayed or dropped input during smoke |
| 10-minute session | Continuous play/settings/leaderboard navigation | No crash, freeze, forced close, or unusable slowdown |
| Jank/stutter | Visible frame drops, FPS, or frame/jank evidence if measured | Record severity; blocker if core interaction becomes hard to read or use |
| Memory growth | Memory start/end/peak from `dumpsys meminfo` or profiler, if captured | Record observation; blocker if device shows OOM, crash, or visible degradation |
| Battery | Battery percent before/after and session length | Record observation; no release threshold defined yet |
| Thermal | Device warmth, throttling warning, or OS thermal state if available | Blocker if thermal throttling makes gameplay visibly unstable |
| WebView/runtime errors | Filtered logcat result | No fatal app crash, `SyntaxError`, `Uncaught`, `ReferenceError`, `TypeError`, `ERR_FILE_NOT_FOUND`, or `OutOfMemory` attributable to the app |
| Reduced motion | Reduced-motion setting checked on device | Feedback remains readable without nonessential motion |

## Long Session Script

Manual minimum:

1. Start the app cold.
2. Record cold startup observation.
3. Start regular game.
4. Play or interact for 10 minutes, including tap input, swipe input if available, settings open/close, and local leaderboard save path.
5. Record visible jank, delayed input, thermal changes, and battery change.
6. Capture filtered logcat.
7. Record whether the session passed, failed, or was blocked.

## Result

- Result: pass / fail / blocked
- Startup notes:
- Cold launch samples / median / max:
- Warm launch samples / median / max:
- Input latency notes:
- 10-minute session notes:
- Jank/stutter notes:
- Memory notes:
- Battery notes:
- Thermal notes:
- Runtime error notes:
- Blockers:
- Follow-up required:

## Readiness Interpretation

- Performance readiness is not claimed until this template is completed on at least one real Android device.
- Passing one device profile is limited evidence for that device and Android/WebView version.
- Before an Android release, pair this profile with `docs/android-real-device-smoke.md`, signed artifact evidence, and release/versioning notes.
- Do not include keystore files, signing passwords, Play service account JSON, tokens, or upload credentials in this document.
