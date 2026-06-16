# Android Play Testing Track Process

Status: process template only. No Play Console track, tester install, or production rollout has been verified yet.

Use this document when Door Runner Memory is prepared for Google Play internal testing or a later release track. Do not paste credentials, service account JSON, upload keys, signing passwords, or Play Console secrets into this repository.

## Prerequisites

- Google Play Developer account access.
- Play Console app listing created for package `com.doorrunner.memory`.
- App content, privacy, data safety, ads, age rating, and store listing fields completed in Play Console as required by Google.
- Reviewed release commit or tag.
- CI run green for the reviewed commit.
- Android `versionCode` and `versionName` selected according to `docs/android-release.md`.
- Release signing approach selected without committing signing credentials.
- Signed release AAB available for upload.
- First signed Android RC checklist in `docs/android-release.md` completed for the artifact being uploaded.
- Real-device smoke and Android performance profile either completed or explicitly recorded as blockers.

## Internal Testing Track Steps

High-level flow:

1. Confirm the release commit/tag and CI run.
2. Build web assets and sync Capacitor Android from the reviewed commit.
3. Produce a signed release AAB through Android Studio or a reviewed Gradle signing flow that uses only local ignored files or CI secrets.
4. In Play Console, create or update the Internal testing track release.
5. Upload the signed AAB.
6. Confirm Play Console accepts the `versionCode`, `versionName`, package name, and signing lineage.
7. Add internal testers or tester group.
8. Fill release notes for testers.
9. Submit the internal testing release.
10. Install from the tester link on at least one real device.
11. Record tester install, launch, real-device smoke, performance notes, and blockers.

## Evidence To Record

- Date:
- Release owner:
- Commit or tag:
- GitHub Actions CI run:
- Android `versionCode`:
- Android `versionName`:
- Package: `com.doorrunner.memory`
- Track: internal testing / closed testing / open testing / production
- Release name:
- Artifact type: signed AAB
- AAB path:
- AAB hash:
- Upload method: Play Console UI / future CI automation
- Signing approach, without secrets:
- Play App Signing / upload-key status:
- Version code confirmed unused in Play Console:
- Play Console upload result:
- Play Console warnings or errors:
- Store listing/app content/data safety/privacy/app access checks:
- Tester group or tester count, without private emails:
- Tester install result:
- Real-device smoke evidence:
- Performance profile evidence:
- Rollout status:
- Release notes source:
- Blockers:
- Follow-up required:

## Credential Rules

- Do not commit Play service account JSON.
- Do not commit upload keys, release keystores, signing passwords, `keystore.properties`, access tokens, `.env` values, or Play Console credentials.
- If future automation uploads to Play Console, credentials must come from GitHub Actions secrets and logs must not print secret values.
- Do not include private tester emails in repository docs; record only tester group names or counts.

## Readiness Interpretation

- A documented process is not Play readiness evidence.
- Play internal testing is not verified until a signed AAB is accepted by Play Console and at least one tester install is recorded.
- Production rollout is not verified until a production track release is submitted, reviewed as applicable, available to users, and backed by release evidence.
- Android release readiness still requires signed artifact evidence, real-device smoke, performance profiling, and store/testing-track evidence.
