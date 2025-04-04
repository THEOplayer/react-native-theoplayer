# React Native THEOplayer

![](./doc/logo-react-native.png) ![](./doc/logo-theo.png)

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

## Prerequisites

For each platform, a dependency to the corresponding THEOplayer SDK is included through a dependency manager:

- Gradle & Maven for Android
- Cocoapods for iOS
- npm for Web

In order to use one of these THEOplayer SDKs, it is necessary to obtain a valid THEOplayer license for that specific platform,
i.e. HTML5, Android, and/or iOS. You can sign up for a THEOplayer SDK license through [our portal](https://portal.theoplayer.com/).

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
| Comscore analytics                                        | [![%40theoplayer/react-native-analytics-comscore](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-comscore?label=%40theoplayer/react-native-analytics-comscore)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-comscore)    | [`Comscore`](https://github.com/THEOplayer/react-native-connectors/tree/main/comscore)           |
| Conviva analytics                                         | [![%40theoplayer/react-native-analytics-conviva](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-conviva?label=%40theoplayer/react-native-analytics-conviva)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-conviva)        | [`Conviva`](https://github.com/THEOplayer/react-native-connectors/tree/main/conviva)             |
| Mux analytics                                             | [![%40theoplayer/react-native-analytics-mux](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-mux?label=%40theoplayer/react-native-analytics-mux)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-mux)                        | [`Mux`](https://github.com/THEOplayer/react-native-connectors/tree/main/mux)                     |
| Nielsen analytics                                         | [![%40theoplayer/react-native-analytics-nielsen](https://img.shields.io/npm/v/%40theoplayer%2Freact-native-analytics-nielsen?label=%40theoplayer/react-native-analytics-nielsen)](https://www.npmjs.com/package/%40theoplayer%2Freact-native-analytics-nielsen)        | [`Nielsen`](https://github.com/THEOplayer/react-native-connectors/tree/main/nielsen)             |
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
- [Android Media3 Pipeline🔥](./doc/media3.md)
- [Audio Control Management](./doc/audio-control.md)
- [Background playback and notifications](./doc/background.md)
- [Casting with Chromecast and Airplay](./doc/cast.md)
- [Common Media Client Data (CMCD)](./doc/cmcd.md)
- [Digital Rights Management (DRM)](./doc/drm.md)
- [Fullscreen presentation](./doc/fullscreen.md)
- [Media Caching](./doc/media-caching.md)
- [Migrating to THEOplayer 9.x🔥](migrating-to-react-native-theoplayer-9.md)
- [Picture-in-Picture (PiP)](./doc/pip.md)
- [Subtitles, Closed Captions and Metadata tracks](./doc/texttracks.md)
- [Limitations and known issues](./doc/limitations.md)

## API Reference

See the [API Reference](https://theoplayer.github.io/react-native-theoplayer/api/) for detailed documentation
about all available components and functions.
