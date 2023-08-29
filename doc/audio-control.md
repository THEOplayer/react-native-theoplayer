## Audio Control Management on Android

### Overview

Android allows multiple apps to play audio concurrently, but this can lead to a disruptive user experience due to
mixed audio streams. To enhance user experience, Android offers an API for apps to control **audio focus**, ensuring only
one app possesses audio focus, thus delivering a more favorable user experience.

This section details how `react-native-theoplayer` addresses changes in audio focus.

References:
- [Android for Developers: Audio focus](https://developer.android.com/reference/android/media/AudioFocusRequest)
- [Android for Developers: "Don't be Noisy"](https://developer.android.com/guide/topics/media/platform/output#becoming-noisy)

### Audio Focus

The `react-native-theoplayer` package is equipped with inherent audio focus management. It initiates an audio focus
request upon the start of playback and responds to the loss of audio focus by pausing playback.

If the loss was *transient*, i.e. lasting only for a short while such as during an incoming phone call,
the player will regain audio focus afterward and play-out while resume.

#### Audio "ducking"

When another app seeks audio focus, it can optionally indicate that the current audio focus holder can
lower its playback volume to continue playing (AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK). The new focus holder does
not require other apps to be silent. This behavior is known as "ducking."

However, `react-native-theoplayer` does not perform audio "ducking"; it consistently pauses playback.

In summary:

| Event                                            | Action          |
|--------------------------------------------------|-----------------|
| `AUDIOFOCUS_LOSS`, `AUDIOFOCUS_LOSS_TRANSIENT`, `AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK` | Pause play-out  |
| `AUDIOFOCUS_GAIN`                                | Resume play-out |


### Audio Becoming Noisy

When headphones are unplugged or a Bluetooth device is disconnected, the audio stream automatically reroutes to the
device's built-in speaker. This can lead to an abrupt increase in volume, which is an undesired outcome.

The "Audio Becoming Noisy" situation is also managed by pausing playback for the `react-native-theoplayer` package.
