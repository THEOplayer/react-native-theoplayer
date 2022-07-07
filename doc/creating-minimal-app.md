## Creating a minimal demo app

In this section we start from an empty React Native template, include a dependency to `react-native-theoplayer`,
and deploy it on an Android or iOS device.

There is no React Native UI included in this app, as this is covered in the accompanying [example application](example-app.md).

### Table of Contents
- [Setting up a new project](#setting-up-a-new-project)
- [Getting started on Android](#getting-started-on-android)
- [Getting started on iOS](#getting-started-on-ios)
- [Getting started on Web](#getting-started-on-web)
- [Building and running the app](#building-and-running-the-app)
- [Final notes](#final-notes)

### Setting up a new project

First initialize a template for a React Native app. In this demo we use a template that also provides support for tvOS, as it will
depend on `react-native-tvos`, a fork of the main React Native branch.

```bash
$ npx react-native init rntheodemo --template=react-native-template-typescript-tv
$ cd rntheodemo
```

Next, include the dependency to `react-native-theoplayer`.

```bash
$ npm i
$ npm i react-native-theoplayer
```

or optionally specifying a specific version of the package:

```bash
$ npm i react-native-theoplayer@<version>
```

Note: depending on your node version, an extra `--legacy-peer-deps` option has to be added:

```bash
$ npm i
$ npm i react-native-theoplayer --legacy-peer-deps
```

Finally, replace the `App.tsx` with this minimal code:

```typescript
import React from 'react';
import { Platform, View } from 'react-native';
import { PlayerConfiguration, THEOplayerView } from 'react-native-theoplayer';

const playerConfig: PlayerConfiguration = {
  license: undefined,     // insert THEOplayer React Native license here
};

const source = {
  sources: [
    {
      src: 'https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd',
      type: 'application/dash+xml',
    },
  ],
};

const App = () => {
    return (
      <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
          <THEOplayerView config={playerConfig} source={source} paused={false}/>
      </View>
    );
};

export default App;
```

A license for the React Native SDK needs to be obtained through the 'Licenses' built in the [THEOplayer portal](https://portal.theoplayer.com/)
or request a [free trial license](https://www.theoplayer.com/free-trial-theoplayer?hsLang=en-us).

![license_portal](./license_portal.png)

### Getting started on Android

After completing the [initial project setup](#setting-up-a-new-project), which is shared for all platforms,
this packaging option needs to be added to Android's Gradle config `./android/app/build.gradle`.

```bash
android {
    // ...
    packagingOptions {
      exclude 'META-INF/kotlin-stdlib.kotlin_module'
    }
}
```

The following Gradle buildConfig fields can be used in your Gradle file to override or
set various react-native-theoplayer options:

```
buildscript {
  ext {
    // ...

    // Override compileSdkVersion
    THEOplayer_compileSdkVersion = 31

    // Override minSdkVersion
    THEOplayer_minSdkVersion = 21

    // Override targetSdkVersion
    THEOplayer_targetSdkVersion = 31

    // Specify a specfic SDK version (default: the lastest available version).
    THEOplayer_sdk = "3.5.0"

    // Optionally limit timeUpdate rate, which could improve performance. Possible values:
    // - "com.theoplayer.TimeUpdateRate.UNLIMITED"
    // - "com.theoplayer.TimeUpdateRate.LIMITED_ONE_HZ"
    // - "com.theoplayer.TimeUpdateRate.LIMITED_TWO_HZ"
    // - "com.theoplayer.TimeUpdateRate.LIMITED_THREE_HZ"
    THEOplayer_timeUpdateRate = "com.theoplayer.TimeUpdateRate.LIMITED_ONE_HZ"

    // Toggle player event logging
    THEOplayer_logPlayerEvents = "false"

    // Toggle playerView event logging
    THEOplayer_logViewEvents = "false"
  }
}
```

For optimal performance, make sure to build your app in release mode, and  optionally limit the number of `timeupdate`
events send by the player as shown in the config above. A `timeupdate` event typically triggers a number of
React Native component updates and could affect performance in negative way.

### Getting started on iOS and tvOS

After completing the [initial project setup](#setting-up-a-new-project), which is shared for all platforms,
for iOS/tvOS set the source to the following HLS stream:

```typescript
const source = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/elephants-dream/playlist.m3u8',
      type: 'application/x-mpegurl',
    },
  ],
};
```

You need an additional change for tvOS, since the tvOS SDK needs to be prepared before it can be used in a RN context. First, include TheoplayerSDK into your project's AppDelegate:
```swift
#if TARGET_OS_TV
#import <THEOplayerSDK/THEOplayerSDK-Swift.h>
#endif
```
Next, prepare the THEOplayer right after the creation of the rootViewController in your AppDelegate's didFinishLaunchingWithOptions:
```swift
#if TARGET_OS_TV
  [THEOplayer prepareWithFirstViewController: [UIViewController new]];
#endif
```

Some RN templates miss a specific Swift version setting for tvOS. To fix this add a custom build setting to your tvOS app target:
```
SWIFT_VERSION 5.0
```

Run pod install in your app's ios folder
```bash
pod install
```

### Getting started on Web

Make sure to first complete the [initial project setup](#setting-up-a-new-project), which is shared for all platforms.
Deploying a web app requires a little more work. The example uses [react-native-web](https://necolas.github.io/react-native-web/) to
support web-based platforms, which translates React Native components to React DOM components.
In addition, the project relies on webpack to create the bundle that is loaded in the hosting web page.

We refer to the [example application](example-app.md) and its [code](../example/web/) for a full demonstration.

#### libraryConfiguration

When passing the `PlayerConfiguration` object while creating the player, the
[`libraryConfiguration`](https://docs.theoplayer.com/api-reference/web/theoplayer.playerconfiguration.md#librarylocation) parameter specifies
where the THEOplayer web worker files are located. The worker files are dynamically loaded and
necessary to play-out MPEG-TS based HLS streams. By default it is set to the location where npm installed THEOplayer
('./node_modules/theoplayer').

### Building and running the app

Finally build and deploy the app. Make sure an emulator is available, or there is a physical
device connected to deploy to.

```bash
$ npm run android
$ npm run ios
$ npm run web
```

### Final notes

On some platforms issues with [React Native Flipper](https://fbflipper.com/), a platform for debugging apps, can occur,
either during building or running the app. If so, it is advised to just remove it for this demo app.
