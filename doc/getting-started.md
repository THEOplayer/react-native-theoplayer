---
sidebar_position: 0
---

# Getting started with React Native THEOplayer

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

## Prerequisites

For each platform, a dependency to the corresponding THEOplayer SDK is included through a dependency manager:

- Gradle & Maven for Android
- Cocoapods for iOS
- npm for Web

In order to use one of these THEOplayer SDKs, it is necessary to obtain a valid THEOplayer license for that specific
platform, i.e. HTML5, Android, and/or iOS. You can sign up for a THEOplayer SDK license
through [our portal](https://portal.theoplayer.com/).

If you have no previous experience in React Native, we encourage you to first explore the
[React Native Documentation](https://reactnative.dev/docs/getting-started),
as it gives you a good start on one of the most popular app development frameworks.

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
<td colspan="2">MPEG-DASH (fmp4, CMAF), HLS (TS, CMAF), Progressive MP4, MP3</td>
<td>HLS (TS, CMAF), Progressive MP4, MP3</td>
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
<td><strong>Subtitles &amp; Closed Captions</strong></td>
<td colspan="3">CEA-608/708, SRT, TTML, WebVTT</td>
</tr>
<tr>
<td><strong>Metadata</strong></td>
<td colspan="3">Event stream, emsg, ID3, EXT-X-DATERANGE, EXT-X-PROGRAM-DATE-TIME</td>
</tr>
<tr>
<td><strong>Advertising Integration</strong></td>
<td colspan="3">Google IMA, Google DAI</td>
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

| Package name                                                                                                              | Purpose                                                  | Registry                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@theoplayer/react-native-analytics-adobe`](https://github.com/THEOplayer/react-native-theoplayer-analytics)             | Adobe analytics connector                                | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-adobe)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-adobe)       |
| [`@theoplayer/react-native-analytics-agama`](https://github.com/THEOplayer/react-native-theoplayer-analytics)             | Agama analytics connector                                | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-agama)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-agama)       |
| [`@theoplayer/react-native-analytics-comscore`](https://github.com/THEOplayer/react-native-theoplayer-analytics)          | Comscore analytics connector                             | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-comscore)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-comscore) |
| [`@theoplayer/react-native-analytics-conviva`](https://github.com/THEOplayer/react-native-theoplayer-analytics)           | Conviva analytics connector                              | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-conviva)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-conviva)   |
| [`@theoplayer/react-native-analytics-mux`](https://github.com/THEOplayer/react-native-theoplayer-analytics)               | Mux analytics connector                                  | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-mux)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-mux)           |
| [`@theoplayer/react-native-analytics-nielsen`](https://github.com/THEOplayer/react-native-theoplayer-analytics)           | Nielsen analytics connector                              | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-nielsen)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-nielsen)   |
| [`@theoplayer/react-native-analytics-youbora`](https://github.com/THEOplayer/react-native-theoplayer-analytics)           | Youbora analytics connector                              | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-youbora)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-youbora)   |
| [`@theoplayer/react-native-drm`](https://github.com/THEOplayer/react-native-theoplayer-drm)                               | Content protection (DRM) connectors                      | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-drm)](https://www.npmjs.com/package/@theoplayer/react-native-drm)                               |
| [`@theoplayer/react-native-ui`](https://github.com/THEOplayer/react-native-theoplayer-ui)                                 | React Native user interface                              | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-ui)](https://www.npmjs.com/package/@theoplayer/react-native-ui)                                 |
| [`@theoplayer/react-native-connector-template`](https://github.com/THEOplayer/react-native-theoplayer-connector-template) | A template for<br/>`react-native-theoplayer` connectors. | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-connector-template)](https://www.npmjs.com/package/@theoplayer/react-native-connector-template) |

## Creating your first app

This section starts with creating a minimal demo app that integrates the `react-native-theoplayer` package,
followed by an overview of the available properties and functionality of the THEOplayerView component.
An example application including a basic user interface and demo sources is included in the
[git repository](https://github.com/THEOplayer/react-native-theoplayer/tree/develop/example),
and discussed in the next section.

- [Creating a minimal demo app](creating-minimal-app.md)
  - [Getting started on Android](creating-minimal-app.md#getting-started-on-android)
  - [Getting started on iOS](creating-minimal-app.md#getting-started-on-ios-and-tvos)
  - [Getting started on Web](creating-minimal-app.md#getting-started-on-web)
- [The THEOplayerView component](theoplayerview-component.md)
- [The example application](example-app.md)

## Knowledge Base

This section gives an overview of features, limitations and known issues:

- [Adaptive Bitrate (ABR)](abr.md)
- [Advertisements](ads.md)
- [Android Media3 Pipeline🔥](media3.md)
- [Audio Control Management](audio-control.md)
- [Background playback and notifications](background.md)
- [Casting with Chromecast and Airplay](cast.md)
- [Common Media Client Data (CMCD)](cmcd.md)
- [Digital Rights Management (DRM)](drm.md)
- [Fullscreen presentation](fullscreen.md)
- [Media Caching](media-caching.md)
- [Migrating to THEOplayer 9.x🔥](migrating-to-react-native-theoplayer-9.md)
- [Millicast](millicast.md)
- [Picture-in-Picture (PiP)](pip.md)
- [Subtitles, Closed Captions and Metadata tracks](texttracks.md)
- [Limitations and known issues](limitations.md)

## API Reference

See the [API Reference](https://theoplayer.github.io/react-native-theoplayer/api/) for detailed documentation
about all available components and functions.
