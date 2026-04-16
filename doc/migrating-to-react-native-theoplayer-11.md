# Migrating to THEOplayer React Native SDK 11.x

This article will guide you through updating to THEOplayer React Native SDK version 11 (from version 10),
and the changes needed in your code.

## Update React Native THEOplayer

Run the following command to install THEOplayer React Native SDK version 11:

```bash
npm install react-native-theoplayer@11
```

## Breaking API changes

- Removed deprecated `ResizeEvent` in favor of `DimensionChangeEvent`.
- Removed deprecated `player.theolive` property in favor of `player.theoLive`.
- Removed deprecated `source.integration` property in favor of `source.type`.

## Breaking Changes on Web

The breaking changes for the native Web SDK are listed in the v11 [changelog](https://optiview.dolby.com/docs/theoplayer/changelog/#-breaking-changes),
none of which impact the React Native SDK on Web.

## Breaking Changes on iOS

The breaking changes for the native Web SDK are listed in the v11 [changelog](https://optiview.dolby.com/docs/theoplayer/changelog/#-breaking-changes-2).

The following updates in particular impact the React Native SDK on iOS.

- The minimum supported iOS/tvOS version is now 15.0, dropping support for iOS/tvOS 13 and 14.

## Breaking Changes on Android

The breaking changes for the native Android SDK are listed in the v11 [changelog](https://optiview.dolby.com/docs/theoplayer/changelog/#-breaking-changes-1).

The following updates in particular impact the React Native SDK on Android.

- The Google IMA SDK integration now requires [core library desugaring](https://developer.android.com/studio/write/java8-support#library-desugaring) to be enabled.
See [our updated guide for Google IMA](https://optiview.dolby.com/docs/theoplayer/how-to-guides/ads/google-ima/#android-sdk) for instructions, or the
React Native THEOplayer [example app](https://github.com/THEOplayer/react-native-theoplayer/tree/develop/example) for a sample implementation.
