# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added an `AnalyticsDescription` property to `SourceDescription` to configure additional source-specific properties for analytics connectors.
- Added support for sideloaded webVTT and SRT texttracks on iOS.
- Added Audio Focus for Android, pausing play-out on audio focus loss and resuming play-out once focus has been regained.
- Added Audio Focus and Audio Becoming Noisy manager for Android.

### Fixed

- Fixed an issue on Android that would cause the player not to reset when setting an empty source.
- Fixed an issue where a text track cue was not properly removed from the cue list on a TextTrackEventType.REMOVE_CUE event.
- Fixed an issue on tvOS that allowed the user to pause a CSAI ad using the apple remote control.

## [2.11.0] - 23-08-10

### Added

- Added DAI support through iOS Native pipeline, using new THEOplayerGoogleIMAIntegration functionality
- Added `TextTrackStyle` API for iOS and Android.

### Fixed

- Fixed an issue on Android where the player would sometimes crash when requesting the current active video track.

### Changed

- Switched to 'displayIconUri' in sourceDescription.metadata as primary field for artwork selection in NowplayingInfo/MediaSession, 'poster' in sourceDescription is now the fallback.
- Removed the play/pause icon in the PiP window on Android while playing an ad.

## [2.10.0] - 23-07-25

### Fixed

- Fixed an issue on Android where the media button receiver would not accept button events in case multiple receivers are registered.
- Fixed an issue on Android where `react-native-theoplayer` would not build when depending on Android player SDK v5.6.0.
- Fixed an issue on Android where a `pause` event would not be dispatched when putting the app to the background during play-out of an ad, while background playback is enabled. The ad would also restart when bringing the app back to the foreground.

### Changed

- Removed restrictions on media session playback actions for AndroidTV.
- Upgraded `react-native` version of the example app to `react-native-tvos@0.71.12-0`.

### Added

- Added a `version` property to `THEOplayer` for querying the `player` version (e.g., `'5.5.0'`) and `playerSuite` (e.g., `'2023.3.0'`) versions.

## [2.9.0] - 23-06-16

### Changed

- Moved React Native UI to separate `@theoplayer/react-native-ui` package.

### Removed

- Removed `react-native-theoplayer` dependencies on packages `@react-native-community/slider`, `react-native-google-cast`, `react-native-svg`, `react-native-svg-web`, `react-native-url-polyfill` and `url-polyfill`.

### Added

- Added an overview of the available React Native connectors.

### Fixed

- Fixed an issue on Android where the background media service would crash the app in case it was started from the background.
- Fixed an issue on iOS where the delayed contentId extraction resulted in an incorrect value being passed to the license request setup.

## [2.8.0] - 23-06-01

### Added

- Added `ignoreAvailabilityWindow` property to `SourceDescription.dash` for Android and Web.
- Added `needsTimescaleShifting`, `desiredTimescale` and `forceSeekToSynchronize` properties to `SourceDescription.dash` for Web.

### Fixed

- Fixed an issue where text track cue changes were not applied to the TextTrack's `cue` property.
- Fixed an issue on Android where play-out of an MP4 stream would sometimes crash the player.
- Fixed an issue on Android where a `pause` event would not be dispatched while pausing during play-out of an ad.
- Fixed an issue on Android where hardware buttons, such as `play` and `pause`, were not handled anymore after toggling background audio support.
- Fixed an issue on Android where the app would crash when toggling background playback while multiple `MediaBrowserServiceCompat` instances are registered.

### Changed

- Improved fullscreen support to use non-native fullscreen on Safari for iPad and Mac.
- Limited the set of available media session actions on Android when an ad or live stream is playing.
- Removed pausing the stream when disabling background playback on Android.

## [2.7.0] - 23-05-15

### Changed

- Approved player behaviour on iOS and Android when doing player operations such as `play` and `pause` in case no source was set.

### Fixed

- Fixed an issue on Android where if an invalid view tag is passed to the native bridge, it would crash the player.
- Fixed an issue on Web where preview thumbnails would fail to load.

### Added

- Updated UI documentation with necessary dependencies.
- Added improved debug logging on iOS.

## [2.6.0] - 23-05-05

### Fixed

- Fixed an issue on Android where the `currentProgramDateTime` property of `TimeUpdateEvent` would not be formatted in milliseconds.
- Fixed an issue on Android where the order of text and media tracks would change when adding tracks.
- Fixed an issue on Web where an exception would be thrown when accessing the player API after the player had been destroyed.
- Fixed an issue with Google IMA where the main content wasn't resumed after a pre-roll ended.

### Changed

- Use `enum` instead of a string union for `ABRStrategyType`.
- Changed the way artwork is fetched for NowPlayingInfo on the iOS Lockscreen, to prevent a crash caused by threading issues.

## [2.5.0] - 23-04-26

### Added

- Added an `aspectRatio` property on the `THEOplayer` instance that can be either `FIT` (default), `FILL` or `ASPECT_FILL`.

### Changed

- Set `theoplayer` Web SDK as optional peer dependency.

## [2.4.0] - 23-04-21

### Fixed

- Fixed an issue on iOS and Android where cue event properties `startTime` and `endTime` with value `Infinity` or `NaN` were not passed correctly.
- Fixed an issue on iOS Safari where switching to fullscreen presentation during an ad would not work.
- Fixed an issue on iOS Safari where an ad could be skipped during unmuted autoplay.
- Fixed a memory leak on iOS where the player would be allocated after being destroyed.
- Fixed an issue on Android where building the SDK would require IMA to be enabled.

### Changed

- Changed Web media session controls to only show trick-play buttons if the player is in foreground, or `backgroundAudioEnabled` is `true`, and never for ads and live stream.
- Changed Web media session controls to only show a play/pause button if the player is in foreground, or `backgroundAudioEnabled` is `true`, and never for ads.

### Added

- Added the `crossOrigin` property to `SourceDescription` for requesting CORS access to content.

## [2.3.0] - 23-04-14

### Changed

- Updated picture-in-picture controls on Android to include forward/rewind buttons and disabled pause button for ads.

## [2.2.0] - 23-04-12

### Fixed

- Fixed an issue on Android and iOS where error codes were not correctly formatted.

### Added

- Added `RetryConfiguration` on `PlayerConfiguration` for Web and Android.

### Changed

- Set minimum THEOplayer dependency version to 5.0.1 for Web, iOS and Android.
- Set `MediaPlaybackService` disabled by default on Android.

## [2.1.0] - 23-04-09

### Fixed

- Fixed invalid location of the typescript declaration file.
- Fixed an issue on Android where the player would not pause when closing the app while background playback is disabled.

### Changed

- Removed `backgroundAudioConfiguration.mediaPlaybackServiceEnabled` property on Android. Disabling background playback disables the service as well.

## [2.0.0] - 23-04-06

### Added

- Released 2.0.0 version.

## [Unreleased 2.0.0-pre9]

### Changed

- Set the player container on Web to by default have a width and height not larger than the devices width and height.
- Use `enum` type for `PresentationMode`, `CastState` and`AdIntegrationKind`.
- Changed the methods of the Cast API, such as `casting` and `state`, to be synchronous.
- Applied `backgroundAudioConfig` properties on Android when closing picture-in-picture window.
- Applied `backgroundAudioConfig` properties on Android when showing Notifications.
- Disable iOS lockscreen controls when backgroundAudioConfig is set to `disabled`.

### Added

- Added `enableMediaPlaybackService` option to `backgroundAudioConfiguration` to optionally disable the MediaBrowserService that provides background audio support on Android.
- Added support for the `enabled` flag of `BackgroundAudioConfiguration` for Web.
- Added serviceId and contentId to NowPlayingInfo
- Feature flag extraction from custom iOS builds

### Fixed

- Fixed an issue on Android where the media session would become inactive when going to picture-in-picture mode, removing all transport controls.
- Fixed an issue where removing a player listener within a listener callback would sometimes result in events not being dispatched.

## [Unreleased 2.0.0-pre7]

### Fixed

- Fixed an issue where the media session connector for Web would report an error when passing an Infinite duration for live streams.
- Fixed an issue on iOS where ID3 metadata content would not be correctly passed to cue instances.
- Fixed an issue on Android where the `'picture-in-picture'` permission was not checked.
- Fixed an issue on Android where the aspect ratio of the `'picture-in-picture'` window could be outside the valid range.
- Fixed an issue on iOS and Android where for a live stream the `duration` property of a `loadedmetadata` event was not properly passed as being `Infinite`.

### Changed

- Replaced deprecated systemUiVisibility code in Android's PresentationManager.
- Use `enum` types for `TextTrackMode`, `TextTrackType` and `TextTrackKind`.
- Allow go-to-live on iOS and Android by setting `currentTime` to `Infinity`.

### Added

- Added a `mediaControl` property to `PlayerConfiguration` to configure Media Session, Now Playing and Remote Command Center functionality across all platforms. It currently only contains a media session toggle for Web.
- Added a `backgroundAudioConfiguration` property to `THEOplayer` to allow dynamically configuring background audio functionality.
- Added a `pipConfiguration` property to `THEOplayer` to allow dynamically configuring picture-in-picture behavior.
- Added support for background audio playback on iOS and Android.
- Added `keepScreenOn` as a default player view property on Android to keep the device awake.

## [Unreleased 2.0.0-pre6]

### Fixed

- Fixed an issue where the IMA player container would be rendered collapsed on Web.
- Fixed a missing check for picture-in-picture permission on Android.

### Added

- Added media session connector for Web.

## [Unreleased 2.0.0-pre5]

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
- Added public accessor on the `THEOplayerRCTView` that exposes the underlying iOS `THEOplayer` instance. So you can use the underlying THEOplayer from other packages.

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
- Fixed an issue on iOS where after toggling the mute state during an ad playout, succeeding mute toggles had no effect.

## [1.8.4] - 23-04-27

### Fixed

- Fixed an issue on Android where the `pause` event was not dispatched during play-out of an ad.

### Added

- Added a `videoAspectRatio` property on the `THEOplayerView` for iOS and Android.
- Added a `PlayerEventTypes.WAITING` event that is dispatched when play-back stops due to lack of media data.

## [1.8.3] - 23-04-06

### Fixed

- Fixed an issue on Android where building the SDK would fail when depending on player SDK v5.x.

## [1.8.2] - 23-04-05

### Fixed

- Fixed an issue on Android where building the SDK would fail when depending on player SDK v4.12.0.

## [1.8.1] - 23-02-09

### Changed

- Restructured iOS bridge code to extensions based on features.

### Fixed

- Fixed an issue on Android where the system UI would not be restored when unmounting THEOplayerView with `fullscreen` enabled.
- Fixed an issue with the availability of the cast button and play buttons in the example application.
- Fixed an issue on iOS where the player was not destroyed correctly on the iOS bridge.
- Added support for `DRMConfig` through `SourceDescription` for SSAI sources on iOS.

## [1.8.0] - 23-01-16

### Added

- Support for Chromecast and Airplay.

### Fixed

- Fixed an issue where moving the sender app to the background while playing a DAI source on an Airplay device, would pause playback.

### Changed

- Upgraded Web SDK to v4.6.0.
- Updated the custom build setup to support both iOS and tvOS.

## [1.7.2] - 22-12-05

### Fixed

- Fixed an issue on tvOS where a feature flag was incorrectly used for ads-related code.

## [1.7.1] - 22-11-28

### Fixed

- Fixed an issue on Android where the player would consider unusable custom drm integrations.
- Fixed missing kotlin classpath property on Android.

## [1.7.0] - 22-11-23

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

## [1.6.1] - 22-10-07

### Added

- Improved source handling for iOS.

## [1.6.0] - 22-09-28

### Fixed

- Fixed jitpack.io repository url for Android.
- Fixed an issue where play-out of HLS streams would fail on Android.

### Changed

- Excluded folders from bob build config.
- Upgraded gradle versions for Android.

## [1.5.0] - 22-09-26

### Fixed

- Fixed disabling all debug logs for iOS/tvOS release builds.
- Fixed duration from seconds to milliseconds on iOS/tvOS.

### Added

- Support for DRM pre-integrations on Android.
- Support for additional source properties on Android: `liveOffset`, `hlsDateRange`, `timeServer` and `hls`.

## [1.4.0] - 22-08-11

### Fixed

- Fixed an issue on iOS where subtitles upon disappearing would sometimes leave a thin black line on the image.
- Fixed an issue on iOS where the player would not be destroyed after going to fullscreen.

### Added

- Improved determination of the stream source type on Android.

## [1.3.0] - 22-07-26

### Fixed

- Fixed an issue where the app would crash due to the configured Flipper version.
- Fixed duplicate classes issue for Android when having dependencies on local libs folder.
- Fixed documentation feature matrix.
- Fixed duration scale in loadedmetadata event properties for Web.

## [1.2.0] - 22-06-30

### Fixed

- Fixed a crash when removing text tracks event listeners on iOS.
- Fixed a number of broken links in the documentation.
- Removed unused files.

## [1.1.0] - 22-06-06

### Added

- Initial release.
