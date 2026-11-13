# React Native THEOplayer

<img src="./doc/logo-optiview-dark.png#gh-dark-mode-only" height="120" alt="OptiView logo"><img src="./doc/logo-optiview-light.png#gh-light-mode-only" height="120" alt="OptiView logo"><img src="./doc/logo-react-native.png" height="120" alt="React Native logo">

## License

This projects falls under the license as defined in https://github.com/THEOplayer/license-and-disclaimer.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [How to use these guides](#how-to-use-these-guides)
4. [Features](#features)
5. [Available connectors](#available-connectors)
6. [Creating your first app](#creating-your-first-app)
7. [Knowledge Base](#knowledge-base)
8. [API Reference](#api-reference)

## Overview

The `react-native-theoplayer` package provides a `THEOplayerView` component supporting video playback on the
following platforms:

- Android, Android TV & FireTV
- iOS & tvOS (Apple TV)
- HTML5, Tizen & webOS (web, mobile web, smart TVs, set-top boxes and gaming consoles).

This document covers the creation of a minimal app including a `THEOplayerView` component,
and an overview of the accompanying example app with a user interface provided
by the `@theoplayer/react-native-ui` package.

It also gives a description of the properties of the `THEOplayerView` component, and
a list of features and known limitations.

### Player facade (Web and Android)

Set `usePlayerFacade: true` in the player configuration at creation to enable the facade.
The default is `false`; iOS and tvOS do not support this option.
On Web, the facade is available at `player.nativeHandle`.
Integrations can register through `registerIntegration`, dispatch THEOplayer player
and ad events (including `adclicked`), and supply a clock through `getCurrentTime()` in
seconds. The wrapper forwards `adclicked` to React Native's ad-event stream.
Close the registration before replacing an integration. Playback engines and ad
schedulers should use `facade.contentPlayer`, not the facade's overridden ad clock.

Integrations can provide an `ads` object implementing the Ads API and its event
subscriptions. The stable public `player.ads` delegates to that object, including
scheduling queries and controls. Existing listeners migrate when an integration
registers or closes; native Ads behavior returns after removal. The earlier
`getAdState()` and `shouldConsumeAdEvent(event)` hooks remain available for
integrations without an Ads object. The facade never reconstructs ad lifecycle.

`getMuted()` / `setMuted(value)` and `getVolume()` / `setVolume(value)` route audio
through an integration. Setters return `true` when handled; otherwise the facade
falls back to content. Nullish getter results also fall back to content.
`registration.dispatchEvent(event)` accepts typed THEOplayer player and ad events.
Ad events route to `player.ads` listeners; player events such as `playing`, `waiting`,
and `volumechange` route to `player` listeners. Dispatch does not emit on the content
player or pass through backing-event interceptors. Closed registrations cannot emit.
`registration.dispatchPlayerEvent(event)` remains a compatible player-event entry point.
Playback ownership and audio synchronization remain integration responsibilities.

`registration.interceptPlayerEvent(type, callback)` lets an integration inspect a
backing player event once before facade listeners receive it. Return `true` to
consume the event, or `false` to forward it. Raw player listeners are unaffected.
The returned disposer removes the interceptor. Existing interceptors remain until
disposed or the facade is destroyed, allowing an integration to drain already-queued
events after unregistering; a closed registration cannot install new interceptors.
`registration.interceptPlayerEvents(callback)` applies the same policy to every
subscribed backing-player event, including subscriptions added later. Type-specific
interceptors run first; integration-dispatched events bypass both kinds. Use a
type-specific interceptor when an event must be observed even without consumers.
An optional `isSeeking()` integration hook overrides the public seeking state;
nullish results fall back to the backing player.
Pause/seek ownership, pending transitions, lifecycle exceptions and ad lifecycle
decisions belong to the integration, not the facade.

On Android, implement `com.theoplayer.integration.Integration` and call
`ReactTHEOplayerView.registerIntegration(integration)` after the view is initialized.
The returned `IntegrationRegistration` supports the same dispatch and interception
semantics using native Android SDK events. Interceptor disposers implement `Closeable`;
call `close()` to remove them. Access the raw engine through
`(view.player as PlayerFacade).contentPlayer`. Time values are in seconds on both platforms.
Android's `getAdState()` returns a `PlayerFacadeAdState`; its nullable result delegates
to native Ads. The facade permits registration during native ads and does not infer
state or suppress native ad events merely because an integration is registered.
Native SDK extensions (`theoAds`, `ima`, `dai`) resolve against the raw player or Ads
object through the facade-aware extensions in `com.theoplayer.integration`.

Custom advertising must not overlap ongoing native IMA/DAI playback on Android.
Finish or reset native advertising before taking over. Replacing/filtering native
ad events can suspend the RN bridge's native DAI bookkeeping, so fresh native state
after hidden native playback is not guaranteed. `ReactTHEOplayerView.adsApi` remains
the native source-specific adapter/event sink; use `view.player.ads` for facade state.
React Native Ads queries and controls use a facade-aware bridge with native fallback.

Focused facade regression tests (Node 22.18+):
`node --test src/__tests__/PlayerFacade.test.ts`.
Android tests, from `example/android`:
`./gradlew :react-native-theoplayer:testDebugUnitTest --tests 'com.theoplayer.integration.PlayerFacade*Test' --console=plain`.

## Prerequisites

For each platform, a dependency to the corresponding THEOplayer SDK is included through a dependency manager:

- Gradle & Maven for Android
- CocoaPods for iOS, or experimental Swift Package Manager support as described below
- npm for Web

In order to use one of these THEOplayer SDKs, it is necessary to obtain a valid THEOplayer license for that specific platform,
i.e. HTML5, Android, and/or iOS. You can sign up for a THEOplayer SDK license through [our portal](https://portal.theoplayer.com/).

If you have no previous experience in React Native, we encourage you to first explore the
[React Native Documentation](https://reactnative.dev/docs/getting-started),
as it gives you a good start on one of the most popular app development frameworks.

### Experimental iOS/tvOS Swift Package Manager Support

This setup requires iOS 16 or later, an app already configured for React Native 0.88's experimental SPM support, and Swift tools 6.1 or later.
Set the app's Xcode deployment target to iOS 16 or later before running SPM sync so RN's generated packages use a compatible minimum.
It does not migrate an app from CocoaPods. THEOlive is always included; Google IMA, THEOads, Millicast, sideloaded subtitles, and Chromecast are optional.

Supported JSON features are `GOOGLE_IMA`, `THEO_ADS`, `MILLICAST`, `SIDELOADED_TEXTTRACKS`, and `CHROMECAST`.

Select features in the app's `react-native-theoplayer.json`, then run from the app root:

```sh
npx --no-install theoplayer-features-spm --sync
```

The command generates `ios/THEOplayerFeatures`, registers it with RN's SPM autolinking, and runs RN sync.
Rerun it after changing features or updating the generator, then build in Xcode.

For tvOS, use `react-native-tvos` and set the app's deployment target to tvOS 15.1 or later.
The same `ios.features` array configures both platforms; no separate tvOS feature list is needed.
`CHROMECAST` can remain selected: both the Cast integration and Google's SDK are iOS-only dependencies and are not linked or embedded on tvOS.
SwiftPM can still resolve and download their packages.
Advertising uses Google's iOS IMA SDK on iOS and its tvOS IMA SDK on tvOS.
The React Native app's SPM setup must supply tvOS React binaries; the standard iOS React package is not a tvOS runtime.

Native version constraints are separate from feature selection:

| Dependency | Current SPM requirement | CocoaPods comparison |
| --- | --- | --- |
| THEOplayer core and integrations | `11.14.0..<12.0.0` | Matches `~> 11.14`; all native products share one SPM package version. |
| Google IMA SDK with `GOOGLE_IMA` or `THEO_ADS` | iOS: `3.31.0..<4.0.0`; tvOS: `4.16.0..<5.0.0` | Both integrations intentionally share the Google IMA integration's minimum for the platform, including THEOads-only builds. |
| Millicast SDK | `2.7.0..<2.8.0` | Shared 2.7.x baseline across the supported THEOplayer versions, including releases whose podspecs permit older SDKs. |
| Sideloaded subtitle connector | `11.0.2..<12.0.0` | Matches `~> 11.0`, `> 11.0.1`; its SPM package supplies Swifter 1.5.0 and SwiftSubtitles 0.9.1, matching CocoaPods. |
| Google Cast SDK | `4.8.0..<5.0.0` | Matches `~> 4.8`; uses Google's official `GoogleCastDynamic` SPM product instead of the community-maintained CocoaPods packaging. |

An app-owned Swift package participating in RN's dependency graph can add exact version requirements within these ranges.
Do not edit the generated selector to pin versions: the generator overwrites it.
SwiftPM combines all requirements and rejects conflicting pins. Commit the app-owned manifest and Xcode's `Package.resolved`.
Broadening a requirement does not automatically upgrade compatible locked versions.

The native THEOplayer SPM package currently omits vendor SDK requirements carried by its CocoaPods integration podspecs.
The wrapper and generated selector therefore supply them explicitly. For manual feature configuration without the generator,
enable the wrapper traits and supply the same SDK constraints and product dependencies.
The SPM setup intentionally uses common vendor SDK baselines rather than reproducing every release-specific podspec range:
THEOads and Google IMA share IMA 3.31 or later within 3.x on iOS and 4.16 or later within 4.x on tvOS; Millicast uses the backward-compatible 2.7.x baseline.
These baselines do not raise the THEOplayer minimum above 11.14.

#### Chromecast App Setup

`CHROMECAST` enables the THEOplayer Google Cast integration and Google's official dynamic SDK on iOS.
The dynamic framework includes the Cast UI resources; do not add `GoogleCastStatic` or a second Google Cast framework alongside it.
Google removed guest mode in SDK 4.8.1; the official package supplies the current supported functionality.

Initialize `GCKCastContext` in the app's `AppDelegate`, before creating a player, using the receiver application ID for your app:

```swift
import GoogleCast

// In application(_:didFinishLaunchingWithOptions:), before creating the player:
let criteria = GCKDiscoveryCriteria(applicationID: "<receiverAppID>")
let options = GCKCastOptions(discoveryCriteria: criteria)
GCKCastContext.setSharedInstanceWith(options)
```

Add `NSLocalNetworkUsageDescription` to the app's `Info.plist`, plus `NSBonjourServices` entries
`_googlecast._tcp` and `_<receiverAppID>._googlecast._tcp`, using that same receiver ID.
The app still provides a Cast control, for example a button calling `player.cast.chromecast?.start()`, and configures discovery behavior.
The SDK presents the device dialog; `react-native-google-cast` is not required.
If `react-native-google-cast` is used,
its native dependency must share the same Google Cast framework rather than installing another copy through CocoaPods.
See [Google's iOS sender setup](https://developers.google.com/cast/docs/ios_sender) for discovery and permission requirements.

## How to use these guides

These are guides on how to use the THEOplayer React Native SDK in your React Native project(s) and can be used
linearly or by searching the specific section. It is recommended that you have a basic understanding of how
React Native works to speed up the way of working with THEOplayer React Native SDK.

## Features

Depending on the platform on which the application is deployed, a different set of features is available.

If a feature missing, additional help is needed, or you need to extend the package,
please reach out to us for support.

<table>
<thead>
<tr>
<th>Feature</th>
<th>Android, Android TV, Fire TV</th>
<th>Web</th>
<th>iOS, tvOS</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Streaming</strong></td>
<td colspan="2">MPEG-DASH (fmp4, CMAF), HLS (TS, CMAF), Progressive MP4, MP3, M4A</td>
<td>HLS (TS, CMAF), Progressive MP4, MP3, M4A</td>
</tr>
<tr>
<td><strong>Content Protection</strong></td>
<td>Widevine</td>
<td>Widevine, PlayReady, Fairplay</td>
<td>Fairplay</td>
</tr>
<tr>
<td><strong>DRM Connectors</strong></td>
<td colspan="3">BuyDRM, EZDRM, Anvato, Titanium, Axinom, Irdeto, VuDRM, Comcast, Verimatrix, Azure, …</td>
</tr>
<tr>
<td><strong>Analytics Connectors</strong></td>
<td colspan="3">Adobe, Agama, Comscore, Conviva, Mux, Nielsen, Youbora</td>
</tr>
<tr>
<td><strong>Other Connectors</strong></td>
<td colspan="1">Yospace SSAI</td>
<td colspan="2"></td>
</tr>
<tr>
<td><strong>Subtitles &amp; Closed Captions</strong></td>
<td colspan="3">CEA-608/708, SRT, TTML, WebVTT</td>
</tr>
<tr>
<td><strong>Metadata</strong></td>
<td colspan="3">Event stream, emsg, ID3, EXT-X-DATERANGE, EXT-X-PROGRAM-DATE-TIME</td>
</tr>
<tr>
<td><strong>Advertising Integration</strong></td>
<td colspan="3">Google IMA, Google DAI, THEOads</td>
</tr>
<tr>
<td><strong>Cast Integration</strong></td>
<td>Chromecast</td>
<td colspan="2">Chromecast, Airplay</td>
</tr>
<tr>
<td><strong>Presentation Mode</strong></td>
<td colspan="3">Inline, Picture-in-Picture, Fullscreen</td>
</tr>
<tr>
<td><strong>Audio Control Management</strong></td>
<td>Audio focus &amp; Audio-Becoming-Noisy mgmt</td>
<td colspan="2">(Audio control management by platform)</td>
</tr>
<tr>
<td><strong>Advanced APIs</strong></td>
<td colspan="2">Background playback,<br/>Media Session,<br/>Media Cache (offline playback)</td>
<td>Background playback,<br/>NowPlaying,<br/>Media Cache (iOS only)</td>
</tr>
<tr>
<td><strong>User Interface</strong><br/><code>@theoplayer/react-native-ui</code></td>
<td colspan="3">Basic playback, media &amp; text track selection, progress bar, live &amp; vod, preview thumbnails, customisable &amp; extensible</td>
</tr>
</tbody>
</table>

## Available connectors

The `react-native-theoplayer` package can be combined with any number of connectors to provide extra
functionality. Currently, the following connectors are available:

| Connector                                                 | npm package                                                                                                                                                                                                                                                            | Source                                                                                           |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| Adobe Heartbeat analytics using the Media Collections API | [![%40theoplayer/react-native-analytics-adobe](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-adobe?label=%40theoplayer/react-native-analytics-adobe)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-adobe)                | [`Adobe`](https://github.com/THEOplayer/react-native-connectors/tree/main/adobe)                 |
| Adobe Media Edge analytics                                | [![%40theoplayer/react-native-analytics-adobe-edge](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-adobe-edge?label=%40theoplayer/react-native-analytics-adobe-edge)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-adobe) | [`Adobe Edge`](https://github.com/THEOplayer/react-native-connectors/tree/main/adobe-edge)       |
| Agama analytics                                           | [![%40theoplayer/react-native-analytics-agama](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-agama?label=%40theoplayer/react-native-analytics-agama)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-agama)                | [`Agama`](https://github.com/THEOplayer/react-native-connectors/tree/main/agama)                 |
| Bitmovin analytics                                        | [![%40theoplayer/react-native-analytics-bitmovin](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-bitmovin?label=%40theoplayer/react-native-analytics-bitmovin)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-bitmovin)    | [`Bitmovin`](https://github.com/THEOplayer/react-native-connectors/tree/main/bitmovin)           |
| Comscore analytics                                        | [![%40theoplayer/react-native-analytics-comscore](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-comscore?label=%40theoplayer/react-native-analytics-comscore)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-comscore)    | [`Comscore`](https://github.com/THEOplayer/react-native-connectors/tree/main/comscore)           |
| Conviva analytics                                         | [![%40theoplayer/react-native-analytics-conviva](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-conviva?label=%40theoplayer/react-native-analytics-conviva)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-conviva)        | [`Conviva`](https://github.com/THEOplayer/react-native-connectors/tree/main/conviva)             |
| Engage                                                    | [![%40theoplayer/react-native-engage](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-engage?label=%40theoplayer/react-native-engage)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-engage)                                                    | [`Engage`](https://github.com/THEOplayer/react-native-connectors/tree/main/engage)               |
| Gemius                                                    | [![%40theoplayer/react-native-analytics-gemius](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-gemius?label=%40theoplayer/react-native-analytics-gemius)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-gemius)            | [`Gemius`](https://github.com/THEOplayer/react-native-connectors/tree/main/gemius)               |
| Mux analytics                                             | [![%40theoplayer/react-native-analytics-mux](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-mux?label=%40theoplayer/react-native-analytics-mux)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-mux)                        | [`Mux`](https://github.com/THEOplayer/react-native-connectors/tree/main/mux)                     |
| Nielsen analytics                                         | [![%40theoplayer/react-native-analytics-nielsen](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-nielsen?label=%40theoplayer/react-native-analytics-nielsen)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-nielsen)        | [`Nielsen`](https://github.com/THEOplayer/react-native-connectors/tree/main/nielsen)             |
| Nielsen AdScript analytics                                | [![%40theoplayer/react-native-analytics-adscript](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-adscript?label=%40theoplayer/react-native-analytics-adscript)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-adscript)    | [`AdScript`](https://github.com/THEOplayer/react-native-connectors/tree/main/adscript)           |
| Youbora analytics                                         | [![%40theoplayer/react-native-analytics-youbora](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-youbora?label=%40theoplayer/react-native-analytics-youbora)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-youbora)        | [`Youbora`](https://github.com/THEOplayer/react-native-connectors/tree/main/youbora)             |
| Yospace SSAI                                              | [![%40theoplayer/react-native-yospace](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-yospace?label=%40theoplayer/react-native-yospace)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-yospace)                                                | [`Yospace`](https://github.com/THEOplayer/react-native-connectors/tree/main/yospace)             |
| Content protection (DRM)                                  | [![%40theoplayer/react-native-drm](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-drm?label=%40theoplayer/react-native-drm)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-drm)                                                                | [`DRM`](https://github.com/THEOplayer/react-native-theoplayer-drm)                               |
| React Native Open UI                                      | [![%40theoplayer/react-native-ui](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-ui?label=%40theoplayer/react-native-ui)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-ui)                                                                    | [`Open UI`](https://github.com/THEOplayer/react-native-theoplayer-ui)                            |
| A template for<br/>`react-native-theoplayer` connectors.  | [![%40theoplayer/react-native-connector-template](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-connector-template?label=%40theoplayer/react-native-connector-template)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-connector-template)    | [`Connector template`](https://github.com/THEOplayer/react-native-theoplayer-connector-template) |

## Creating your first app

This section starts with creating a minimal demo app that integrates the `react-native-theoplayer` package,
followed by an overview of the available properties and functionality of the THEOplayerView component.
An example application including a basic user interface and demo sources is included in the
[git repository](https://github.com/THEOplayer/react-native-theoplayer/tree/develop/example),
and discussed in the next section.

- [Creating a minimal demo app](./doc/creating-minimal-app.md)
  - [Getting started on Android](./doc/creating-minimal-app.md#getting-started-on-android)
  - [Getting started on iOS](./doc/creating-minimal-app.md#getting-started-on-ios-and-tvos)
  - [Getting started on Web](./doc/creating-minimal-app.md#getting-started-on-web)
- [The THEOplayerView component](./doc/theoplayerview-component.md)
- [The example application](./doc/example-app.md)

## Knowledge Base

This section gives an overview of features, limitations and known issues:

- [Adaptive Bitrate (ABR)](./doc/abr.md)
- [Advertisements](./doc/ads.md)
- [Android Media3 Pipeline](./doc/media3.md)
- [Audio Control Management](./doc/audio-control.md)
- [Background playback and notifications](./doc/background.md)
- [Casting with Chromecast and Airplay](./doc/cast.md)
- [Common Media Client Data (CMCD)](./doc/cmcd.md)
- [Content matching on tvOS](./doc/content-matching.md)
- [Digital Rights Management (DRM)](./doc/drm.md)
- [Expo](./doc/expo.md)
- [Fullscreen presentation](./doc/fullscreen.md)
- [Media Control](./doc/mediacontrol.md)
- [Media Caching](./doc/media-caching.md)
- [Metrics](./doc/metrics.md)
- [Migrating to THEOplayer 9.x](./doc/migrating-to-react-native-theoplayer-9.md)
- [Migrating to THEOplayer 10.x🔥](./doc/migrating-to-react-native-theoplayer-10.md)
- [Millicast](./doc/millicast.md)
- [Picture-in-Picture (PiP)](./doc/pip.md)
- [Subtitles, Closed Captions and Metadata tracks](./doc/texttracks.md)
- [Limitations and known issues](./doc/limitations.md)

## API Reference

See the [API Reference](https://theoplayer.github.io/react-native-theoplayer/api/) for detailed documentation
about all available components and functions.
