# Android Media3 Pipeline

## Overview

The THEOplayer Android Media3 pipeline is an integration for the THEOplayer Android SDK that serves as a **new
and rebuilt base layer for playback of video and audio files**.
It is based on [Jetpack Media3](https://developer.android.com/media/media3) components,
and it provides more stable playback covering a broader range of use cases, all while being lighter in size and
more performant.

For more information, refer to the [Getting started with Media3 on Android](https://www.theoplayer.com/docs/theoplayer/how-to-guides/android/media3/getting-started/)
section in our Android SDK documentation.

The Media3 pipeline is available as of `react-native-theoplayer` v8.9.0.

### Usage

> [!IMPORTANT]
> As of THEOplayer 9.0, Media3 is the default playback pipeline on Android. In this version, it is still possible to
> opt-out and use the legacy pipeline with the `playbackPipeline` parameter in the `SourceDescription`.

> [!IMPORTANT]
> As of THEOplayer 10.0, the legacy pipeline has been removed.

The rest of this section **applies to THEOplayer 8.x only**.

Except for **THEOads sources**, where Media3 is **enabled by default**, the "legacy" pipeline remains
the default on THEOplayer v8.x.

To enable the new Media3 extension, set the `THEOplayer_extensionMedia3` in the app's gradle configuration,
such as the `gradle.properties` file:

```
THEOplayer_extensionMedia3=true
```

Additionally, pass the `useMedia3` flag in the [player configuration](../src/api/config/PlayerConfiguration.ts) as shown below:

```tsx
const playerConfig: PlayerConfiguration = {
  // ...
  useMedia3: true
};
```

### Multimedia tunneling

The Media3 pipeline provides support for multimedia tunneling, as described in the
[Android documentation](https://source.android.com/docs/devices/tv/multimedia-tunneling).
This is disabled by default.

To enable multimedia tunneling, pass the `tunnelingEnabled` flag in the
[player configuration](../src/api/config/PlayerConfiguration.ts) as shown below:

```tsx
const playerConfig: PlayerConfiguration = {
  // ...
  tunnelingEnabled: true
};
```
