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
6. [Getting Started](#getting-started)

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

<img src="./doc/features.svg">

## Available connectors

The `react-native-theoplayer` package can be combined with any number of connectors to provide extra
functionality. Currently, the following connectors are available:

| Package name                                                                                                              | Purpose                                                  | Registry                                                                                                                                                      |
|---------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
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

## Getting Started

This section starts with creating a minimal demo app that integrates the `react-native-theoplayer` package,
followed by an overview of the available properties and functionality of the THEOplayerView component.
An example application including a basic user interface and demo sources is included in the
[git repository](https://github.com/THEOplayer/react-native-theoplayer/tree/master/example),
and discussed in the next section. Finally, an overview of features, limitations and known issues is listed.

- [Creating a minimal demo app](./doc/creating-minimal-app.md)
    - [Getting started on Android](./doc/creating-minimal-app.md#getting-started-on-android)
    - [Getting started on iOS](./doc/creating-minimal-app.md#getting-started-on-ios-and-tvos)
    - [Getting started on Web](./doc/creating-minimal-app.md#getting-started-on-web)
- [The THEOplayerView component](./doc/theoplayerview-component.md)
- [The example application](./doc/example-app.md)
- Knowledge Base
  - [Adaptive Bitrate (ABR)](./doc/abr.md)
  - [Advertisements](./doc/ads.md)
  - [Audio Control Management](./doc/audio-control.md)
  - [Background playback and notifications](./doc/background.md)
  - [Casting with Chromecast and Airplay](./doc/cast.md)
  - [Custom iOS framework](./doc/custom-ios-framework.md)
  - [Digital Rights Management (DRM)](./doc/drm.md)
  - [Fullscreen presentation](./doc/fullscreen.md)
  - [Media Caching](./doc/media_caching.md)
  - [Migrating to `react-native-theoplayer` v2.x](./doc/migrating_v2.md)
  - [Picture-in-Picture (PiP)](./doc/pip.md)
  - [Subtitles, Closed Captions and Metadata tracks](./doc/texttracks.md)
  - [Limitations and known issues](./doc/limitations.md)
- [API Reference](https://theoplayer.github.io/react-native-theoplayer/api/)
