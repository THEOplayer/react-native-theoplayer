# React Native THEOplayer

![](./doc/logo-react-native.png) ![](./doc/logo-theo.png)

## Using published fork

We're using the pre-release version to update our patched version and keep track of the upstream version.

E.g. we're working on v1.7.2, we will use version `1.7.2-0` and incrementally increase the `-0` with the patches we do. If they release a new version upstream we will merge it in our patched branch `git merge v1.8.0`* and release a new version starting from 0 again as `1.8.0-0`.

\* to be able to merge tags from upstream you will need to add upstream to your remotes
```
git remote add upstream git@github.com:THEOplayer/react-native-theoplayer.git
```

### Publishing

```bash
# build the source
npm run prepare

# publish to npm
npm publish --access public
```

## License

This projects falls under the license as defined in https://github.com/THEOplayer/license-and-disclaimer.

## Table of Contents

1. [Overview](#overview)
1. [How to use these guides](#how-to-use-these-guides)
1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)

## Overview

The `react-native-theoplayer` package provides a `THEOplayerView` component supporting video playback on the
following platforms:

- Android, Android TV & FireTV
- iOS & tvOS (Apple TV)
- Web (currently only HTML5 browsers are tested)

This document covers the creation of a minimal app including a `THEOplayerView` component,
and an overview of the included example app with its basic UI.
It also gives a description of the properties of the `THEOplayerView` component, and
a list of features and known limitations.

## Prerequisites
For each platform, a dependency to the corresponding THEOplayer SDK is included through a dependency manager:

- Gradle & Maven for Android
- Cocoapods for iOS
- npm for Web

In order to use one of these THEOplayer SDKs, it is necessary to obtain a valid THEOplayer license for that specific platform,
i.e. HTML5, Android, and/or iOS. You can use your existing THEOplayer SDK license or request a
[free trial account](https://www.theoplayer.com/free-trial-theoplayer?hsLang=en-us).

If you have no previous experience in React Native, we encourage you to first explore the
[React Native Documentation](https://reactnative.dev/docs/getting-started),
as it gives you a good start on one of the most popular app development frameworks.

## How to use these guides

These are guides on how to use the THEOplayer React Native SDK in your React Native project(s) and can be used
linearly or by searching the specific section. It is recommended that you have a basic understanding of how
React Native works to speed up the way of working with THEOplayer React Native SDK.

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
- [The example application with React Native UI](./doc/example-app.md)
- [Features](./doc/features.md)
- Knowledge Base
  - [Adaptive Bitrate (ABR)](./doc/abr.md)
  - [Advertisements](./doc/ads.md)
  - [Casting with Chromecast and Airplay](./doc/cast.md)
  - [Custom iOS framework](./doc/custom-ios-framework.md)
  - [Digital Rights Management (DRM)](./doc/drm.md)
- [Limitations and known issues](./doc/limitations.md)
