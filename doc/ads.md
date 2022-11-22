## Advertisements

### Overview

A good starting point to get acquainted with THEOplayer's advertising features
is THEOplayer's [Knowledge Base](https://docs.theoplayer.com/knowledge-base/01-advertisement/01-user-guide.md).

While THEOplayer supports a wide range of different [ad types](https://docs.theoplayer.com/knowledge-base/01-advertisement/01-user-guide.md#an-overview-of-theoplayers-different-ad-types),
`THEOplayerView` currently supports:

- client-side ad insertion (CSAI) through [Google IMA](#getting-started-with-google-ima)
- server-side ad insertion (SSAI) through [Google DAI](#getting-started-with-google-dai).

In the next section we discuss how to integrate them on each platform.

Additional functionality, such as scheduling ads at runtime, is provided by the [ads API](#using-the-ads-api).

The final section describes how to subscribe and add custom logic to [ad events](#subscribing-to-ad-events).

### Getting started with Google IMA

#### Configuration

First enable Google IMA support, which requires a different approach on each platform.

<details>
<summary>Android/AndroidTV</summary>

The Android SDK is modular-based, so enabling Google IMA is limited to including
the ima extension in gradle by enabling this flag in your `gradle.properties`:

```
# Enable THEOplayer Extensions (default: disabled)
THEOplayer_extensionGoogleIMA = true
```
</details>

<details>
<summary>iOS/tvOS</summary>

To enable Google IMA for the iOS/tvOS platforms, a dependency to the THEOplayer SDK
that includes the IMA library needs to be added. See [Custom iOS framework](./custom-ios-framework.md) for more details.

</details>

<details>

<summary>Web</summary>

To enable Google IMA on web, it suffices to add this script in the web page's header section, as shown
in the example app's [index.html](../example/web/public/index.html):

```html
<head>
    <!-- Optionally load Google IMA/DAI libraries -->
    <script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
</head>
```
</details>

#### Source description

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

### Getting started with Google DAI

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
<summary>iOS/tvOS</summary>

To enable Google DAI for the iOS/tvOS platforms, a dependency to the THEOplayer SDK
that includes the DAI library needs to be added. See [Custom iOS framework](./custom-ios-framework.md) for more details.

</details>

<details>

<summary>Web</summary>

To enable Google DAI on web, it suffices to add this script in the web page's header section, as shown
in the example app's [index.html](../example/web/public/index.html):

```html
<head>
    <!-- Optionally load Google IMA/DAI libraries -->
    <script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3_dai.js"></script>
</head>
```
</details>

#### Source description

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

### Using the Ads API

`THEOplayerView` also provides a separate ads [API](../src/api/ads/AdsAPI.ts) that enables additional features
such as:

- Querying whether an ad is currently playing;
- Skipping the current ad (if possible);
- Getting the ad break that is currently playing;
- Getting a list of ads that are currently playing (only available for web);
- Getting a list of ad breaks that are still scheduled. Once an ad break starts, it is removed from the list;
- Manually scheduling a client-side ad.

The ads API is used by accessing the `ads` property on `THEOplayerView` component:

```tsx
<THEOplayerView
  ref={(ref: THEOplayerView) => {
    this.player = ref;
  }}
/>

// Query whether an ad is currently playing.
const isPlayingAd = () => {
  return player.ads.playing();
};
```

Google DAI has its own [API](../src/api/ads/GoogleDai.ts), which includes DAI-specific features, such as
converting time stamps between stream time and content time, and manipulating the `snapback` flag that prevents
users from seeking across ad breaks.

```tsx
// Convert timestamps using the DAI ads api.
const streamTimeForContentTime = (contentTime: number): Promise<number> | undefined => {
  return player.ads.dai?.streamTimeForContentTime(contentTime);
};
```

### Subscribing to ad events

The `THEOplayerView` component includes a callback to subscribe to ad events:

```tsx
<THEOplayerView
  onAdEvent={(event: AdEvent) => {
    const { type, ad } = event;
    console.log(TAG, 'onAdEvent', type, ad);
  }}
/>
```

Where [`AdEvent`](../src/api/event/AdEvent.ts)
contains a field indicating the type of the event, and a description of the
relevant [`Ad`](../src/api/ads/Ad.ts) or [`AdBreak`](../src/api/ads/AdBreak.ts) instance.

```typescript
export interface AdEvent {
  /**
   * Type of ad event.
   */
  type: AdEventType;

  /**
   * The ad or adbreak for which the event was dispatched.
   */
  ad: Ad | AdBreak;
}
```

The event type can be any of the following:

| Event name        | Event                                           |
|-------------------|-------------------------------------------------|
| `addadbreak`      | an ad break is added.                           |
| `removeadbreak`   | an ad break is removed.                         |
| `adloaded`        | an ad is loaded.                                |
| `adbreakbegin`    | an ad break (a list of consecutive ads) begins. |
| `adbreakend`      | an ad break ends.                               |
| `adbreakchange`   | an ad break changes.                            |
| `updateadbreak`   | an ad break is updated.                         |
| `addad`           | an ad is added.                                 |
| `adbegin`         | an ad begins.                                   |
| `adend`           | an ad ends.                                     |
| `updatead`        | an ad is updated.                               |
| `adloaded`        | an ad is loaded.                                |
| `adfirstquartile` | an ad reaches the first quartile.               |
| `admidpoint`      | an ad reaches the mid point.                    |
| `adthirdquartile` | an ad reaches the third quartile.               |
| `adskip`          | an ad is skipped.                               |
| `adimpression`    | an ad counts as an impression.                  |
| `aderror`         | an ad error occurs.                             |
| `admetadata`      | an ads list is loaded.                          |
| `adbuffering`     | the ad has stalled playback to buffer.          |

Note that the availability of the events being dispatched depends on the platform.

For details on the [Ad](../src/api/ads/Ad.ts) and [AdBreak](../src/api/ads/AdBreak.ts) types,
we refer to the API.
