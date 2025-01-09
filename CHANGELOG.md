# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added support for New Architecture's through the Interop Layer. More info on the [React Native developer pages](https://reactnative.dev/architecture/landing-page).

## [8.12.0] - 25-01-09

### Fixed

- Fixed a memory leak on iOS, where the presentationModeManager was holding a strong reference to the fullscreen's target and return views
- Fixed an issue on iOS where the destruction of the THEOplayerView was not always propagated correctly over the iOS Bridge, resulting in an occasional memory leak.
- Fixed an issue where, when requesting a text track's cues, the time properties would sometimes be in seconds instead of milliseconds.
- Fixed a rare crash on Android due to a `java.lang.NullPointerException` when creating the THEOplayerView.
- Fixed an issue on Android where R8 minification would obfuscate some API class names, which could lead to a crash.

### Added

- Added a `adLoadTimeout` property to `GoogleImaConfiguration` to control the amount of time that the SDK will wait before moving onto the next ad or main content.

## [8.11.1] - 24-12-18

### Fixed

- Fixed the picture-in-picture presentationMode for THEOlive sources on Web.

### Changed

- Deprecated the use of the `enableTHEOlive` flag in `PlayerConfiguration` as THEOlive support is always enabled.

## [8.11.0] - 24-12-13

### Added

- Added support for THEOlive on tvOS.

## [8.10.0] - 24-12-06

### Added

- Added support for THEOlive on iOS.

## [8.9.1] - 24-12-04

### Added

- Added a `enableTHEOlive` flag to `PlayerConfiguration` to enable play-out of THEOlive sources.

## [8.9.0] - 24-11-29

### Added

- Added support for the `SURFACE_CONTROL` rendering target on Android, which improves switching from/to fullscreen presentation mode. Rendering target `SURFACE_CONTROL` will be selected instead of `SURFACE_VIEW` on API level 29+.

### Fixed

- Fixed a memory leak on iOS, caused by the wrapping ViewController that was keeping a strong reference to the THEOplayerRCTView.

### Added

- Added support for the experimental media3 player pipeline on Android.

### Changed

- **BREAKING**: Changed the `view` parameter in the `Omid` API from a ref container to a native node handle when registering "friendly" obstructions.

## [8.8.1] - 24-11-20

### Fixed

- Fixed build issue on tvOS caused by HomeIndicatorViewController

## [8.8.0] - 24-11-19

### Added

- Added `HomeIndicatorViewController` to iOS, which can be used as an alternative `rootViewController` for the native App. It will automatically show/hide the home indicator when transitioning from/to fullscreen presentationMode.

### Changed

- Simplified the `viewController` reparenting mechanism on iOS that is applied when changing the presentationMode to/from fullscreen.
- The `MediaPlaybackService` on Android is never restarted if a MediaButton event is received after the app was closed.
- Added a consumer R8 config file on Android, telling R8 not to throw errors or warnings because of classes that are expected to be missing.

## [8.7.0] - 24-11-05

### Fixed

- Fixed an issue on iOS where the dynamic island (iphone 14 plus and higher) briefly disappeared when updating the nowPlayingInfo on for example backgrounding the app.
- Fixed an issue on Android when using Expo, where the Expo plugin would not add THEOplayer's Maven repo to the project's repositories list.

### Added

- Added the `Omid` API for ads, which can be used to manage friendly video controls overlay obstructions.

## [8.6.0] - 24-10-25

### Added

- Added `AdEvent.AD_CLICKED` and `AdEvent.AD_TAPPED` ad events for iOS and Android. The events are dispatched when a user taps or clicks on an ad that has a `clickThrough` link.

### Changed

- Upgrade example app to support React Native v0.75.

## [8.5.0] - 24-10-21

### Added

- Added `SdkVersion` interface to be used by the sdk and its connectors to report version info.
- Added the `THEOads` SGAI ad integration for Android. See [THEOads](https://www.theoplayer.com/product/theoads) for more details.

### Fixed

- Fixed an issue on Web where all text tracks other than the selected would be set to `disabled` when enabling a text track.
- Fixed an issue on iOS where the player would crash when changing the presentationMode from fullscreen to picture-in-picture during ad playout.

### Changed

- On iOS, after closing picture-in-picture the player returns back to the previous presentationMode instead of always returning to inline.

## [8.4.0] - 24-10-10

### Added

- Added a `posterStyle` property on `THEOplayerView` to allow overriding the default 16:9 poster style.
- Added a `theoads` property on `PlayerConfiguration.ads` to allow play-out of THEOads sources on Web platforms.
- Added a `hlsDateRange` property on `SourceDescription` to enable parsing and exposing date ranges from HLS playlists. This flag was already available on `PlayerConfiguration`, which applies for all HLS sources.

### Fixed

- Added support for a breaking change to `ContentProtectionIntegrationFactory`'s signature in THEOplayer Android 8.2.0.

## [8.3.1] - 24-10-07

### Fixed

- Fixed an issue on Android where on some Android SDK versions controlling playback with the notification buttons would not work.
- Fixed an issue on Web and Android where a text track with attribute `DEFAULT` was not set as the player's `selectedTextTrack` property.

### Added

- Added `sdkVersions` to react-native-theoplayer, which contains the current RN SDK version and the version of the underlying native THEOplayer SDK.

## [8.3.0] - 24-09-30

### Added

- Added the option to specify the AVAudioSession mode for iOS (moviePlayback versus spokenAudio).

## [8.2.2] - 24-09-28

- Fixed a build issue on iOS for applications that run without the GOOGLE_IMA feature flag

## [8.2.1] - 24-09-27

### Fixed

- Fixed a build issue on Android when pinning a specific Android player SDK version, while also disabling the Google IMA extension.

## [8.2.0] - 24-09-26

### Added

- Added the `PlaybackSettings` API for Android, allowing control of playback behaviour across all THEOplayer instances.

## [8.1.0] - 24-09-23

### Added

- Added support for `bitrate` config on the GoogleIMAConfiguration, to be passed to the IMA SDK rendering settings.
- Added support on iOS and Android for `allowedMimeTypes` config on the AdsConfiguration, to be passed to the IMA SDK rendering settings.

### Fixed

- Fixed an issue where cast events were not forwarded from the native Android SDK.
- Fixed an issue where presentationMode changes on iOS would cause a UIViewControllerHierarchyInconsistency when an ad is playing.
- Fixed an issue where some ad event types could not be resolved at runtime when excluding the IMA integration on Android.

## [8.0.3] - 24-09-14

### Fixed

- Fixed an issue on Android where the THEO Maven repository would not be picked up by all dependencies.

## [8.0.2] - 24-09-14

### Fixed

- Fixed an issue on Android where not all dependencies would be correctly resolved.

## [8.0.1] - 24-09-11

### Fixed

- Fixed an issue on Android where registering a content protection integration would fail.

## [8.0.0] - 24-09-11

### Added

- Added support for THEOplayer 8.0.

### Changed

- Deprecated Jitpack.io in favor of the THEOplayer Maven repository on Android.

### Fixed

- Fixed an issue on iOS where the initial `duration` property of the player would be `0` instead of `NaN`.

## [7.9.0] - 24-09-06

### Added

- Added THEOlive source integration type to `SourceDescription`.
- Added THEOads as `AdIntegrationKind`.
- Added a `headers` property to `TypedSource`. The player will add the headers to the HTTP requests for the given resource.

## [7.8.2] - 24-08-21

### Changed

- Modified the poster behavior on iOS and Android to remain visible until the first frame is displayed.

## [7.8.1] - 24-08-14

### Fixed

- Fixed an issue on Android where the notification background would be displayed in low resolution on recent Android versions.

### Added

- Added support on iOS for 'album' and 'artist' in the nowPlayingInfo.

## [7.8.0] - 24-08-09

### Added

- Added shouldResumeAfterInterruptions to the BackgroundAudioConfiguration which toggles playback resume after an interruption (e.g. phone call) on the lockscreen.
- Added the option to set a nil source on the iOS Bridge, to 'unset' the previous source.
- Added the fast-forward & rewind buttons for the Android notification when `mediaControl.mediaSessionEnabled` is set to `true`.
- Added a `mediaControl.convertSkipToSeek` player config property to allow seeking with the `NEXT` and `PREVIOUS` media buttons. Its default value is `false`.

### Fixed

- Fixed an issue where the Lockscreen showed enabled controls when the player has no valid source.
- Fixed an issue on Android where the notification would not disappear when setting an undefined source.

### Changed

- Replaced the `MediaBrowserService` with a regular `Service` to facilitate background playback on Android.

## [7.7.1] - 24-07-29

### Fixed

- Fixed an issue on tvOS where native cache functionality was not excluded correctly resulting in build errors.

## [7.7.0] - 24-07-25

### Added

- Added ActiveQualityChanged event support for iOS.

### Fixed

- Fixed an issue where on iOS a cached asset would not play when setting the tasks's source on the player.
- Fixed an issue where on iOS the createTask method (CacheAPI) was not returning the created task.
- Fixed an issue where on iOS the Ad and AdBreak protocols where extended in the underlying native SDK and required some modifications.
- Fixed an issue where on Android the native module preparation would fail due to a change in the Android SDK 7.8.0 on eventDispatching.

## [7.6.0] - 24-07-01

### Added

- Added `'root'` as an alternative id for the root div element in Web applications, supporting fullscreen presentation mode in Expo-based apps.
- Added `renderingTarget` property to `THEOplayer` API for Android, enabling the option to choose between either rendering to a `SurfaceView` (default) or `TextureView`.

### Changed

- Lowered the required node version to v16+.

## [7.5.1] - 24-06-20

### Added

- Added ad event support for custom SSAI integrations.

## [7.5.0] - 24-06-18

### Fixed

- Fixed an issue where the Cast API wouldn't be initialized yet when in the `onPlayerReady` callback.
- Added support for THEOplayer Android v7.6.0.

## [7.4.0] - 24-06-11

### Added

- Added support for `SourceDescription.poster` for Android & iOS.
- Made the intervals for the forward and backward skip buttons on the iOS lockScreen configurable.
- Added preferredPeakBitRate and preferredMaximumResolution to ABRConfiguration for iOS

## [7.3.0] - 24-06-03

### Changed

- Disabled skip forward/backward remote control buttons by default for Live content on Android TV platforms.

### Added

- Added support for React Native 0.74 and upgraded the example application to depend on `react-native-tvos` 0.74.1.

### Fixed

- Fixed an issue where on the iOS bridge the wrong value was extracted from the CachingParameters to configure the bandwidth setting on the MediaCache.

## [7.2.0] - 24-05-12

### Added

- Added `resize` player event enabling monitoring of player resizes.
- Added `width` and `height` properties to `THEOplayer` containing the player's current dimensions in pixels.
- Added the possibility to set the player volume on iOS programmatically via the player API.
- Added `AD_CLICKED`, `AD_TAPPED`, `AD_ICON_TAPPED` and `AD_ICON_FALLBACK_IMAGE_CLOSED` ad events for Android platforms.

### Fixed

- Fixed an issue on Android where the `scheduledAdBreaks` list did not include the pre-roll ad on play-out of a Google DAI stream.

## [7.1.1] - 24-04-26

### Fixed

- Fixed an issue where the selectedAudioTrack and selectedVideoTrack were not in sync with the actual selected mediatracks on the native player.

## [7.1.0] - 24-04-23

### Fixed

- Fixed a build issue on tvOS example app due to the deprecated `prepare` method.

### Added

- Added multiple configuration options to `GoogleImaConfiguration` for both iOS and Android. These map to the corresponding IMASettings from the underlying native Google IMA SDKs.
- Added `skipForwardInterval` and `skipBackwardInterval` properties to `MediaControlConfiguration` for Android and Web, enabling configurable skip intervals for media sessions.
- Added ios bridging code to make 'forced' property available from native iOS TextTrack API.

### Removed

- Removed support for the web-based native iOS SDK on the RN iOS Bridge.

## [7.0.0] - 24-04-10

### Fixed

- Fixed an issue where the player had the wrong layout in fullscreen presentationMode, after changing the source.
- Fixed an issue where not enabling autoplay would explicitly pause the stream, reverting a possible play() request right after setting up the source.

### Added

- Added support for THEOplayer native SDK 7.0.
- Aligned SDK major version with native player SDKs.

### Changed

- Raise minimal ios deployment target to 13.4, to match react native 0.73's minimal deployment target

## [3.10.3] - 24-03-22

### Fixed

- Fixed a crash on iOS when playing an IMA Ad after reparenting the THEOplayerView to a different native Viewcontroller.

## [3.10.2] - 24-03-22

### Changed

- Downgraded default `androidx.core:core-ktx` dependency version to support Android target sdk 33.

## [3.10.1] - 24-03-19

### Changed

- Updated ios sdk version to 6.12.1

## [3.10.0] - 24-03-15

### Changed

- Updated dependencies and example app to support ReactNative v0.73.
- Updated ios sdk version to 6.11

### Fixed

- Improved NowPlayingInfo updates for iOS by setting playbackRate on pause/playing events and processing the final info on player desctruction.
- Fixed an issue with misinterpretation of `targetVideoQuality = 0` (use video track with `uid == 0`) as `targetVideoQuality = undefined` (use ABR across all video qualities).
- Fixed an issue where the `srclang` property of a `textTrack` passed to a `SourceDescription` would not be parsed on Android.

### Added

- Added an optional `THEOplayer_reparent_on_fullscreen` build property on Android to disable `THEOplayerView` reparenting when transitioning to fullscreen presentation mode.

## [3.9.2] - 24-03-06

### Changed

- Never pause play-out when losing audio focus while playing an advertisement.

## [3.9.1] - 24-03-05

### Changed

- Bumped google-cast-sdk dependency to v4.8.0 for iOS.

## [3.9.0] - 24-03-04

### Changed

- Reduce audio volume (duck) on Android when another app gains transient audio focus and ducking is allowed. In other cases the player will pause, and optionally resume if the audio focus loss was transient.

### Fixed

- Fixed an issue on iOS where the lockscreen controls and displayed asset metadata would remain visible after the player has been destroyed.
- Fixed an issue on iOS where the castState was not initialized correctly.

## [3.8.0] - 24-02-23

### Changed

- Renamed native modules to avoid name collisions with external packages.

### Added

- Added `adbreakbegin` and `adbreakend` events for Google IMA on Android.
- Added `liveOffset` property to `PlayerConfiguration`, allowing to set a custom offset from the live point.
- Added a second, alternative config filename to the iOS podspec setup to prevent a react-native-theoplayer module resolving clash.

## [3.7.1] - 24-02-09

### Fixed

- Fixed a dependency issue on iOS when using chromecast or Google IMA features.

## [3.7.0] - 24-02-09

### Added

- Added fullscreen presentation mode support for iOS and Android. More info on the [documentation](./doc/fullscreen.md) page.

## [3.6.0] - 24-02-02

### Fixed

- Fixed a build issue on the iOS bridge caused by the deprecated DispatchDispatch protocol.
- Fixed an issue on Android where the `MediaPlaybackService` would sometimes crash with a `ForegroundServiceDidNotStartInTimeException` exception.

### Added

- Added the ability to override both small and large notification icons in Android with `ic_notification_small` and `ic_notification_large` resources respectively.

## [3.5.0] - 24-01-30

### Added

- Added the ability to toggle `keepScreenOn` on Android. By default, screen timeout is disabled while the player is visible.

## [3.4.2] - 23-12-22

### Fixed

- Fixed an issue in the Expo plugin for Android where it would fail to execute when no properties are passed.

## [3.4.1] - 23-12-21

### Changed

- Take the Kotlin Gradle plugin version from the root project, if specified.

## [3.4.0] - 23-12-21

### Added

- Added `ui` configuration object to `PlayerConfiguration` to configure the ads UI language.
- Added support for Android 14.
- Added Expo plugin to support Android dependency configuration.

### Changed

- Changed the Android notification channel name to `Notification channel`. It can be renamed by defining the `notification_channel_name` resource string.

## [3.3.2] - 23-12-12

### Fixed

- Fixed an issue on iOS & Android where timestamps in ad events were not consistently defined in seconds.
- Fixed an issue on tvOS where unknown AdIntegrationKind values resulted in build issues.

## [3.3.1] - 23-12-11

### Fixed

- Fixed an issue on Android where a `ContentResumeRequested` ad event was never broadcasted.
- Fixed an issue on iOS where the ad duration was provided in milliseconds instead of seconds.

## [3.3.0] - 23-12-11

### Changed

- Extended event dispatching mechanism with broadcast functionality.

## [3.2.1] - 23-12-07

### Fixed

- Fixed an issue on Android where `EnterCue` and `ExitCue` text track events did not contain the `trackUid` property.

## [3.2.0] - 23-11-29

### Fixed

- Fixed an issue on iOS and Android were selecting an audio, video or text track that has a `uid` with value `0`, would fail.

### Added

- Added support for HLS #EXT-X-DATERANGE timed metadata tags. The tags appear as cues in a dedicated text track with type `daterange`.

## [3.1.0] - 23-10-27

### Changed

- Revised audio focus protocol on Android. When resuming an app, audio focus is retrieved only if the player is not paused.
- Changed the behaviour of the Android component supporting background playback. It is stopped but not disabled when setting `backgroundAudioConfiguration.enabled = true`.

### Fixed

- Fixed an issue on Android where during play-out of a locally stored media asset the `seekable` property would not update.
- Fixed an issue on iOS where the error was not forwarded to theoplayer if a drm request fails on the iOS bridge

## [3.0.2] - 23-10-17

### Fixed

- Fixed an issue on Android where compilation would fail when depending on player SDK 6.2.0.

## [3.0.1] - 23-10-12

### Fixed

- Fixed compilation issues caused by Caching API not being supported on tvOS

## [3.0.0] - 23-10-06

### Fixed

- Fixed sourceDescription processing on iOS for offline playback.

### Changed

- Added support for THEOplayer 6.0. See [THEOplayer's changelog](https://www.theoplayer.com/docs/theoplayer/changelog/) for details.
- Bumped minimal version for SideloadedTextTracks connection on iOS to v6.1.1 which contains fix for iOS 17.0.

### Added

- Added `MediaCache` API, enabling download of media assets for offline playback.

## [2.16.1] - 23-09-27

### Added

- For iOS, added a subtitlePTS property to the TextTrackDescription that syncs a sideloaded textTrack with the video content.

## [2.15.0] - 23-09-26

### Changed

- Upgraded the iOS side-loaded text track connector.

### Fixed

- Fixed an issue where the Android mediaSession connector would still process media button events when the app was in the background, and `enableBackgroundPlayback` was false.
- Fixed an issue on Android where play-out would still start when the app was put to the background during initial buffering, and `enableBackgroundPlayback` was false.
- Fixed an issue on Android where the MediaButtonReceiver would crash the app when it did not find a registered MediaBrowserService instance, when setting `enableBackgroundPlayback` to false while backgrounding the app.

## [2.14.0] - 23-09-25

### Fixed

- Fixed an issue on Android where the MediaButtonReceiver would crash the app when it did not find a registered MediaBrowserService instance.

### Added

- Added support for side-loaded metadata tracks on iOS.

## [2.13.0] - 23-09-15

### Fixed

- Fixed an issue where setting a new source on iOS, during DRM handling, would crash the application due to unsafe array access by different threads.

## [2.12.1] - 23-09-14

### Fixed

- Fixed an issue on Android where the player SDK dependency could resolve to version 6.+.
- Fixed an issue on iOS where the player integration dependencies could resolve to version 6.+.

## [2.12.0] - 23-09-04

### Added

- Added an `AnalyticsDescription` property to `SourceDescription` to configure additional source-specific properties for analytics connectors.
- Added support for sideloaded webVTT and SRT texttracks on iOS.
- Added Audio Focus for Android, pausing play-out on audio focus loss and resuming play-out once focus has been regained.
- Added Audio Focus and Audio Becoming Noisy manager for Android.

### Fixed

- Fixed an issue on Android that would cause the player not to reset when setting an empty source.
- Fixed an issue where a text track cue was not properly removed from the cue list on a TextTrackEventType.REMOVE_CUE event.
- Fixed an issue on tvOS that allowed the user to pause a CSAI ad using the apple remote control.
- Fixed an issue on iOS where the cue event listeners were not cleanup up when destroying the player instance, resulting in memory build-up.

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

- Added `onPlayerReady` callback on `THEOplayerView` to pass a `THEOplayer` instance once it is ready for access. More info on the [migration documentation](https://github.com/THEOplayer/react-native-theoplayer/blob/v7.0.0/doc/migrating-v2.md) page.
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

- Moved all player properties such as `paused`, `muted` and `volume`, from `THEOplayerView` component to `THEOplayer` instance. More info on the [migration documentation](https://github.com/THEOplayer/react-native-theoplayer/blob/v7.0.0/doc/migrating-v2.md) page.
- Removed `onEventName` callback methods from `THEOplayerView` component in favor of `THEOplayer` event listener's interface. More info on the [migration documentation](https://github.com/THEOplayer/react-native-theoplayer/blob/v7.0.0/doc/migrating-v2.md) page.
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
