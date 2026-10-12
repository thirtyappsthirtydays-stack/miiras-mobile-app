# Miiras: conversation cards

A simple iPhone and Android app that helps families talk about money, health, care and the future, one question at a time. 10 decks, 100 questions. No accounts, no AI, nothing saved.

Built with Expo (React Native). One codebase for iOS and Android.

## What's where

| You want to change | Edit this |
| --- | --- |
| A question, its tag (who it’s for), its tip, a deck title, blurb or "why" text | `src/content/decks.json` |
| Colours and fonts | `src/theme.ts` |
| Onboarding screens | `src/screens/OnboardingScreen.tsx` |
| "How we wrote the questions", contact email, privacy link | `src/screens/AboutScreen.tsx` |
| App name, version, bundle ID | `app.json` |
| App icon and splash | `assets/` |

## Try it on your phone (no Mac needed)

1. Install [Node.js](https://nodejs.org) (LTS version) on your computer.
2. In this folder, run `npm install`, then `npx expo start`.
3. Install **Expo Go** on your iPhone and scan the QR code that appears.

## Publish to the App Store and Google Play

You'll need:
- An **Apple Developer Program** membership ($99 a year) for the App Store.
- A **Google Play Developer** account ($25 one time) for Android.
- A free **Expo** account at expo.dev.

Then, in this folder:

1. `npx eas-cli@latest login`
2. **Check the bundle ID** in `app.json` (`com.getmiiras.app`). It must be unique and can't change after the first upload.
3. **Build for iOS:** `npx eas-cli@latest build --platform ios`. Sign in with your Apple account when asked; EAS creates the certificates for you.
4. **Upload to App Store Connect:** `npx eas-cli@latest submit --platform ios`. The build shows up in TestFlight after about 15 minutes. Invite test families there first.
5. **Fill in the listing** in App Store Connect. Draft text is in `docs/STORE_LISTING.md`. Add screenshots, the privacy policy link and the privacy answers ("Data not collected"). Then submit for review.
6. **Android:** create the app in Google Play Console, then run the same build and submit commands with `--platform android`. The first release goes to internal testing.

To release an update, bump `version` in `app.json` (and `ios.buildNumber` and `android.versionCode`), then build and submit again.

## Before you launch

- [ ] Make sure the privacy link in `AboutScreen.tsx` points to a policy that covers the app (draft in `docs/privacy-policy.html`), not only the website waitlist.
- [ ] Run `npx expo-doctor` on your computer and fix anything it flags.
- [ ] Test on a real iPhone and Android phone, including swiping and the back button.
