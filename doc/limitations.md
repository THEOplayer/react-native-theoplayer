# Limitations and Known Issues

This sections lists any limitations and known issues in the current package version.

## Custom-built THEOplayer SDKs

Dependencies to the underlying THEOplayer SDKs are currently configured in the `react-native-theoplayer` package using
various dependency managers:

- Android: Gradle & Maven
- iOS & tvOS: Cocoapods
- Web: npm

This currently poses a limitation on the ability to include a SDK that is custom-built through
[THEOplayer Portal](https://portal.theoplayer.com/).
A custom-built library (a JavaScript library for web) including a specific set of features
currently still needs to be configured inside `react-native-theoplayer` package itself.

## iOS and tvOS

When building with Xcode 27, every application and dependency target must use a deployment target of 15.0 or newer.
Applications built against the iOS 27 or tvOS 27 SDK must also adopt the
[UIKit scene-based lifecycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle).
React Native 0.88 and newer provide native `SceneDelegate` support. Applications using React Native 0.79 through 0.87
can start React Native from an app-owned `SceneDelegate` with `RCTReactNativeFactory`, as demonstrated by the example app.