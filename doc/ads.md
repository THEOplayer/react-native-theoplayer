# Advertisements

## Overview

A good starting point to get acquainted with THEOplayer's advertising features
is THEOplayer's [Knowledge Base](https://www.theoplayer.com/docs/theoplayer/knowledge-base/advertisement/user-guide/).

While THEOplayer supports a wide range of different
[ad types](https://www.theoplayer.com/docs/theoplayer/knowledge-base/advertisement/user-guide/#an-overview-of-theoplayers-different-ad-types),
`react-native-theoplayer` currently supports:

- client-side ad insertion (CSAI) through [Google IMA](#getting-started-with-google-ima)
- server-side ad insertion (SSAI) through [Google DAI](#getting-started-with-google-dai).
- server-guided ad insertion (SGAI) through [THEOads](#getting-started-with-theoads).

In the next section we discuss how to integrate them on each platform.

Additional functionality, such as scheduling ads at runtime, is provided by the [ads API](#using-the-ads-api).

The final section describes how to subscribe and add custom logic to [ad events](#subscribing-to-ad-events).

## Getting started with Google IMA

### Configuration

First enable Google IMA support, which requires a different approach on each platform.

<details>
<summary>Android/AndroidTV</summary>

The Android SDK is modular-based, so enabling Google IMA is limited to including
the ima extension in gradle by setting this flag in your `gradle.properties`:

```
# Enable THEOplayer Extensions (default: disabled)
THEOplayer_extensionGoogleIMA = true
```

</details>

<details>
<summary>iOS/tvOS</summary>

To enable Google IMA you can add the "GOOGLE_IMA" [feature flag](./creating-minimal-app.md#getting-started-on-ios-and-tvos) to `react-native-theoplayer.json` (or `theoplayer-config.json`)

</details>

<details>

<summary>Web</summary>

To enable Google IMA on web, it suffices to add this script in the web page's header section, as shown
in the example app's [index.html](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/example/web/public/index.html):

```html

<head>
  <!-- Optionally load Google IMA/DAI libraries -->
  <script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
</head>
```

</details>

### Source description

When providing the player with a source that includes a list of ads, make sure to
set the `integration` property to `"google-ima"`, as shown in one of the sources of the example app:

```typescript
const imaSource = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/dash/webvtt-embedded-in-isobmff/Manifest.mpd',
      type: 'application/dash+xml',
    },
  ],
  ads: [
    {
      integration: 'google-ima' as AdIntegrationKind,
      sources: {
        src: 'https://cdn.theoplayer.com/demos/ads/vast/dfp-preroll-no-skip.xml',
      },
    },
  ],
};
```

The API's [`AdSource`](../src/api/source/ads/Ads.ts) description provides additional information on
the configurable properties.

It is also possible to pass a configuration to the IMA SDK via the `ads` API. For more information see the [GoogleImaConfiguration API](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/src/api/ads/GoogleImaConfiguration.ts).

## Getting started with Google DAI

First enable Google DAI support, which requires a different approach on each platform.

<details>
<summary>Android/AndroidTV</summary>

The Android SDK is modular-based, so enabling Google DAI is limited to including
the dai extension in gradle by enabling this flag in your `gradle.properties`:

```
# Enable THEOplayer Extensions (default: disabled)
THEOplayer_extensionGoogleDAI = true
```

Note that DAI support for Android is available as of SDK version 4.3.0.
</details>

<details>
<summary>iOS</summary>

Google DAI is part of the Google IMA SDK. To enable it, you add the "GOOGLE_IMA" [feature flag](./creating-minimal-app.md#getting-started-on-ios-and-tvos) to react-native-theoplayer.json (or theoplayer-config.json)

</details>

<details>

<summary>Web</summary>

To enable Google DAI on web, it suffices to add this script in the web page's header section, as shown
in the example app's [index.html](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/example/web/public/index.html):

```html

<head>
  <!-- Optionally load Google IMA/DAI libraries -->
  <script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3_dai.js"></script>
</head>
```

</details>

### Source description

Providing a Google DAI source description to the player requires providing an `ssai` object and
specifying `"google-dai"` as integration type:

```typescript
const daiSource = {
  sources: {
    ssai: {
      integration: 'google-dai',
      availabilityType: 'vod',
      contentSourceID: '2528370',
      videoID: 'tears-of-steel',
    } as GoogleDAIVodConfiguration,
  },
};
```

A full description of the available source properties can be found in the
[API](../src/api/source/ads/ssai/GoogleDAIConfiguration.ts) definition.

## Getting started with THEOads

THEOads is an ad-insertion service for both VOD and LIVE content, created by THEO Technologies,
utilizing Server-Guided Ad-Insertion (SGAI). For more information we refer to the
[THEOads](https://www.theoplayer.com/docs/theoads/) documentation.

## Using the Ads API

[THEOplayer](../src/api/player/THEOplayer.ts) provides an [AdsAPI](../src/api/ads/AdsAPI.ts) that enables additional
features
such as:

- Querying whether an ad is currently playing;
- Skipping the current ad (if possible);
- Getting the ad break that is currently playing;
- Getting a list of ads that are currently playing (only available for web);
- Getting a list of ad breaks that are still scheduled. Once an ad break starts, it is removed from the list;
- Manually scheduling a client-side ad.

The `THEOplayer` is provided with a callback on the `THEOplayerView` component:

```tsx
const onPlayerReady = (player: THEOplayer) => {
  this.player = player;
}

<THEOplayerView onPlayerReady={onPlayerReady}/>
```

After which the AdsAPI can be used:

```typescript
const isPlayingAd = () => {
  return this.player.ads.playing();
};
```

Google DAI has its own [API](../src/api/ads/GoogleDai.ts), which includes DAI-specific features, such as
converting time stamps between stream time and content time, and manipulating the `snapback` flag that prevents
users from seeking across ad breaks.

```typescript
// Convert timestamps using the DAI ads api.
const streamTimeForContentTime = (contentTime: number): Promise<number> | undefined => {
  return this.player.ads.dai?.streamTimeForContentTime(contentTime);
};
```

## Subscribing to ad events

[THEOplayer](../src/api/player/THEOplayer.ts) allows you to subscribe to ad events:

```typescript
const onAdEvent = (event: AdEvent) => {
  console.log(event)
}
player.addEventListener(PlayerEventType.AD_EVENT, onAdEvent);
```

See [AdEvent](../src/api/event/AdEvent.ts), [Ad](../src/api/ads/Ad.ts) and [AdBreak](../src/api/ads/AdBreak.ts)  for
more information.

Note that the availability of the events being dispatched depends on the platform.
