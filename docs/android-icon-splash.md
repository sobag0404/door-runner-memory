# Android Icon And Splash Branding Checklist

Status: checklist only. Final Android launcher icon and splash assets are not complete.

This document tracks Android-specific icon and splash requirements before a signed Android release. The visual direction is original colorful mobile-runner energy, broadly inspired by Subway Surfers only at the level of brightness, readability, and arcade momentum. Do not copy Subway Surfers characters, logos, UI, proprietary assets, track layouts, or recognizable environment art.

## Current Asset State

- App label: `Door Runner Memory` in `android/app/src/main/res/values/strings.xml`.
- Capacitor splash config uses `backgroundColor: "#FF8C42"` and no spinner in `capacitor.config.json`.
- Status bar config uses `backgroundColor: "#FF6B35"` in `capacitor.config.json`.
- Launcher icon resources exist in `mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, and `mipmap-xxxhdpi`.
- Adaptive icon XML exists in `mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml`.
- Current adaptive icon background is `#FFFFFF` in `values/ic_launcher_background.xml`.
- Current launcher foreground includes generated/default Android-style artwork and is not final branded release art.
- Splash PNGs exist for portrait and landscape density buckets under `drawable-*`, but they are generated/default release placeholders until reviewed.
- Current splash PNGs do not yet prove alignment with the orange Capacitor splash/status bar colors or final Door Runner Memory branding.

## Required Launcher Icon Assets

- Foreground artwork is original to Door Runner Memory.
- Background color supports the foreground at small sizes and does not rely on a one-hue palette.
- Adaptive icon foreground and background are checked for Android 8+ masks.
- Legacy PNG launcher icons exist for mdpi, hdpi, xhdpi, xxhdpi, and xxxhdpi.
- Round icon resources are present and visually acceptable.
- Icon remains readable at small launcher sizes and against light/dark launcher backgrounds.
- Icon is checked on home screen, app drawer, recents, settings/app info, and common adaptive icon masks.
- Asset provenance is recorded: generated specifically for this project, created in-house, or licensed for this project.

## Required Splash Assets

- Splash background matches the app visual direction and Android status/system bar colors.
- Splash image is original and does not copy external characters, logos, UI, or level art.
- Portrait and landscape splash assets are checked for clipping across density buckets.
- Cold-start splash is checked in portrait and landscape where supported, plus light/dark system modes where applicable.
- Splash is readable in light/dark device settings if applicable.
- Launch duration and transition do not feel broken on a physical device.

## Evidence To Record Before Android Release

- Asset source paths or generation prompt/provenance.
- Screenshots of launcher icon on at least one Android device or emulator.
- Screenshots or screen recording of splash-to-home transition.
- Device model, Android version, and WebView version used for review.
- Real-device smoke reference from `docs/android-real-device-smoke.md`, if available.
- Contrast/readability notes for launcher icon, splash, app label, and first home render.
- Confirmation that no copied Subway Surfers or third-party proprietary assets/UI are present.
- Confirmation that no Subway Surfers characters, coins, hoverboards, track layouts, graffiti logo treatment, HUD layout, or recognizable environment art are copied.
- Final branding approval status.

## Readiness Interpretation

- This checklist does not claim final Android branding readiness.
- Generated/default assets are acceptable for debug builds only.
- Do not claim signed APK/AAB, Play internal testing, or production release readiness on the basis of placeholder/generated icon or splash art.
- Final branding readiness requires reviewed original assets, screenshots, device smoke, and release documentation.
