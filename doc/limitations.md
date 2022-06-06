## Limitations and Known Issues

This sections lists any limitations and known issues in the current package version.

### Custom-built THEOplayer SDKs

Dependencies to the underlying THEOplayer SDKs are currently configured in the `react-native-theoplayer` package using
various dependency managers:

- Android: Gradle & Maven
- iOS & tvOS: Cocoapods
- Web: npm

This currently poses a limitation on the ability to include a SDK that is custom-built through
[THEOplayer Portal](https://portal.theoplayer.com/).
A custom-built library (an .aar of Android, framework for iOS and JavaScript library for web)
including a specific set of features currently still needs to be configured inside
`react-native-theoplayer` package itself.

### Fullscreen

The behaviour of the fullscreen property currently depends on both the target platform being used, and whether
the native (chromefull) UI or a built-in React Native UI is used:

- If the native (chromefull) UI is used, the fullscreen functionality works the same as when using the native SDK without
React Native.
- Otherwise, when using the fullscreen property with a chromeless UI:
    - On Android and Web, the current activity or container will go into immersive mode;
    - On iOS & tvOS, fullscreen should be implemented in React Native to preserve interaction with the player.
