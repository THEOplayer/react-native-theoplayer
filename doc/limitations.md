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
A custom-built library (an .aar of Android, framework for iOS and JavaScript library for web)
including a specific set of features currently still needs to be configured inside
`react-native-theoplayer` package itself.
