## Background Playback and Notifications

### Overview

One of the key features of `react-native-theoplayer` is its support for background playback,
notifications, and lock-screen controls. This feature allows your users to continue listening
to audio when the app is not in the foreground, and control playback using notifications and lock-screen controls.

### Configuration

The `backgroundAudioConfiguration` player configuration affects the play-out behaviour when the app is moved to
the background: in case the `enabled` property is set to `true`, the current media asset will continue
playing when the app is moved to the background, otherwise play-out will pause.

The configuration can be modified at run-time, allowing the player to pause depending on the current media asset's
properties, or whether an ad is playing or not.

```typescript
player.backgroundAudioConfiguration = { enabled: true };
```

#### Android

On Android, a [service](https://developer.android.com/guide/components/services) is used to
continue playback in the background while the user is not interacting with the app.
It is possible to disable the service by setting the build config field `'THEOplayer_usePlaybackService = false'`.
In that case the background playback feature is disabled, no notifications are displayed, and the
player will always pause when the hosting app goes to the background.

### Notifications, Metadata and Lockscreen Controls

During play-out of a media asset, a notification is displayed that provides some metadata and
enables basic control. The source description passed to the player should provide the necessary metadata
properties:

```json
{
  "sources": [
    {
      "src": "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
      "type": "application/x-mpegurl"
    }
  ],
  "poster": "https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg",
  "metadata": {
    "title": "Big Buck Bunny",
    "subtitle": "A THEOplayer demo stream",
    "artist": "THEOplayer"
  }
}
```

| ![notification_android](./notification_android.png) | ![notification_ios](./notification_ios.png) |  ![notification_web](./notification_web.png)   |
|-----------------------------------------------------|:-------------------------------------------:|:---:|
| Android                             |                     iOS                     | Web |
