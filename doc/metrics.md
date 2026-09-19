# Metrics

## Overview

The [Metrics API](../src/api/metrics/MetricsAPI.ts) exposes playback metrics gathered by the player. It is available on the [THEOplayer API](../src/api/player/THEOplayer.ts) through `player.metrics`.

Metrics are **poll-based**: there is no change event, so you read a value on demand (for example on an interval, or piggy-backing on an existing event such as a time update).

## Current bandwidth estimate

`player.metrics.currentBandwidthEstimate()` returns the bandwidth, in **bits per second**, that the player estimates is currently available. This is the value the player uses to make adaptive bitrate (ABR) decisions.

```tsx
const onPlayerReady = (player: THEOplayer) => {
  // Poll the estimate every second.
  setInterval(async () => {
    const bps = await player.metrics.currentBandwidthEstimate();
    console.log(`Estimated bandwidth: ${bps} bps`);
  }, 1000);
};

<THEOplayerView
  config={playerConfig}
  onPlayerReady={onPlayerReady}
/>
```

> **Note:** A value of `0` means the estimate is **not available yet** (e.g. before playback, after a reset,
> or on a platform/source that does not populate it — see below). It does **not** mean the available
> bandwidth is literally zero.

## Platform specifics

The access path (`player.metrics.currentBandwidthEstimate()`, in bits/s) is identical on every platform,
but the *behaviour* is not uniform:

| Platform  | Populated for                              | Value when unsupported                                 |
|-----------|--------------------------------------------|--------------------------------------------------------|
| Android   | All streams, via the Media3/ExoPlayer estimate (HLS, DASH, SmoothStreaming, progressive) | `0.0` when no playback backend is attached |
| Web       | All streams driven by THEOplayer's MSE/ABR pipeline (HLS, DASH, HESP) | `0` during native HTML5 playback |
| iOS/tvOS  | THEOlive/HESP streams **only** in practice | `0` for regular `AVPlayer` playback (HLS, MP4)         |

- On **iOS/tvOS** the value is only meaningful for THEOlive/HESP sources. For ordinary HLS/MP4 played it stays `0`.
- On **Android** and **Web** the estimate is reported for regular adaptive streams as well; it is not
  HESP-specific.
