# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added `onPlayerReady` callback on `THEOplayerView` to pass a `THEOplayer` instance once it is ready for access. More info on the [migration documentation](./doc/migrating_v2.md) page.
- Added `canplay` event, which is dispatched when the player can start play-out.
- Added `waiting` event, which is dispatched when the player has stopped play-out because of a temporary lack of data.
- Added `nativeHandle` property on `THEOplayer` to access the native player instance on web, and view id on mobile.
- Added `entercue` and `exitcue` events for text tracks, which are dispatched when a cue becomes (in)active.
- Added `ratechange` event, which is dispatched when the player's playback rate was changed.
- Added `seekable` property on `THEOplayer`, containing the time ranges of the media the player is able to seek to.
- Added `buffered` property on `THEOplayer`, containing the time ranges of the media the player has currently buffered.
- Added `buffered` property to the payload of the `onprogress` event.
- Added `duration`, `seeking`, `preload`, `textTrack`, `videoTracks` and `audioTracks` properties to `THEOplayer`.
- Added `libraryLocation` property to `PlayerConfiguration` to allow passing custom location for web workers.
- Added `mutedAutoplay` property to `PlayerConfiguration` to allow autoplay on web browsers with different autoplay policies.
- Added mode `hidden` as a value for a text track's `TextTrackMode` property, which is typically used for metadata tracks.
- Added `TextTrackStyle` API to support text track styling. This feature is currently supported on web only.
- Added support for 'picture-in-picture' presentation mode. More information on the [documentation page](./doc/pip.md)
- Added `muted` state in `volumechange` event payload.
- Added media session connector for Android.

### Changed

- Moved all player properties such as `paused`, `muted` and `volume`, from  `THEOplayerView` component to `THEOplayer` instance. More info on the [migration documentation](./doc/migrating_v2.md) page.
- Removed `onEventName` callback methods from `THEOplayerView` component in favor of `THEOplayer` event listener's interface. More info on the [migration documentation](./doc/migrating_v2.md) page.
- Changed documentation sample code to reflect API changes.
- Exposed the `activeQuality` of a `MediaTrack` as a `Quality` instance instead of the quality's `uid`.
- Set the default container style for web to let the player cover the whole container.

### Removed

- Removed `seek` method on `THEOplayer`. It is replaced with a `currentTime` setter.
- Removed `fullscreen` setter and getter in favor of `presentationMode`.

### Fixed

- Fixed an issue on Android where an exception is thrown when an empty source description would be passed.
- Fixed the Webpack configuration in the sample application to copy web workers to `libraryLocation`.
- Fixed an issue on web where in case multiple player instances are created, the players would overlap.
- Fixed an issue on iOS Safari where switching to fullscreen presentation would not work.
- Fixed an issue on Android where passing an invalid empty source description would result in a crash.
- Fixed an issue on Android where the `framerate` property of a `VideoQuality` instance would not be filled in.
- Fixed an issue on iOS where the `TextTrackMode` property of a text track would be incorrect.
- Fixed an issue on iOS where after enabling/disabling a text track, metadata tracks would be set to `disabled` as well.
- Fixed missing `volumechange` events on mobile platforms.

## [1.8.2]

### Fixed

- Fixed an issue on Android where building the SDK would fail when depending on player SDK v4.12.0.

## [1.8.1]

### Changed

- Restructured iOS bridge code to extensions based on features.

### Fixed

- Fixed an issue on Android where the system UI would not be restored when unmounting THEOplayerView with `fullscreen` enabled.
- Fixed an issue with the availability of the cast button and play buttons in the example application.
- Fixed an issue on iOS where the player was not destroyed correctly on the iOS bridge.
- Added support for `DRMConfig` through `SourceDescription` for SSAI sources on iOS.

## [1.8.0]

### Added

- Support for Chromecast and Airplay.

### Fixed

- Fixed an issue where moving the sender app to the background while playing a DAI source on an Airplay device, would pause playback.

### Changed

- Upgraded Web SDK to v4.6.0.
- Updated the custom build setup to support both iOS and tvOS.

## [1.7.2]

### Fixed

- Fixed an issue on tvOS where a feature flag was incorrectly used for ads-related code.

## [1.7.1]

### Fixed

- Fixed an issue on Android where the player would consider unusable custom drm integrations.
- Fixed missing kotlin classpath property on Android.

## [1.7.0]

### Added

- Support for content protection integration (DRM connectors).
- Support for subscribing to ad events.
- Support for Google DAI ads.
- Support for Google IMA ads.
- Support for ABR configuration on Android and Web.
- Support for video quality selection on Android and Web.

### Fixed

- Fixed an issue where the player would not be correctly released when destroying the view on Android.
- Fixed a warning during debugging when a stream would have duration INF or NaN.
- Fixed an issue in the example app where it would not be possible to select a specific text track.
- Fixed conflicting npm dependencies in the example app.

## [1.6.1]

### Added

- Improved source handling for iOS.

## [1.6.0]

### Fixed

- Fixed jitpack.io repository url for Android.
- Fixed an issue where play-out of HLS streams would fail on Android.

### Changed

- Excluded folders from bob build config.
- Upgraded gradle versions for Android.

## [1.5.0]

### Fixed

- Fixed disabling all debug logs for iOS/tvOS release builds.
- Fixed duration from seconds to milliseconds on iOS/tvOS.

### Added

- Support for DRM pre-integrations on Android.
- Support for additional source properties on Android: `liveOffset`, `hlsDateRange`, `timeServer` and `hls`.

## [1.4.0]

### Fixed

- Fixed an issue on iOS where subtitles upon disappearing would sometimes leave a thin black line on the image.
- Fixed an issue on iOS where the player would not be destroyed after going to fullscreen.

### Added

- Improved determination of the stream source type on Android.

## [1.3.0]

### Fixed

- Fixed an issue where the app would crash due to the configured Flipper version.
- Fixed duplicate classes issue for Android when having dependencies on local libs folder.
- Fixed documentation feature matrix.
- Fixed duration scale in loadedmetadata event properties for Web.

## [1.2.0]

### Fixed

- Fixed a crash when removing text tracks event listeners on iOS.
- Fixed a number of broken links in the documentation.
- Removed unused files.

## [1.1.0]

### Added

- Initial release.
