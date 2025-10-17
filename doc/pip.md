# Picture-in-Picture (PiP)

## Overview

The Picture-in-Picture feature allows you to watch a stream in a floating window that is always
on top of other apps or windows.

Transitioning the player to a PiP window can be done in two ways:

- Explicitly, using the player API
- Automatically, when transitioning to background in mobile apps.

This page describes how to configure PiP with react-native-theoplayer.

## Configuration

### Transitioning to PiP automatically

The `pipConfiguration` property that is set on the player instance
allows native mobile apps on iOS and Android to automatically transition into PiP presentation mode when
the app goes to the background. The property can be changed at run-time, allowing to change the
behaviour depending on the active media asset.

```typescript
player.pipConfiguration = { startsAutomatically: true }
```

### Using presentationMode

The picture-in-picture presentation mode can also be triggered explicitly using the
`THEOplayer` API:

```typescript
// Change presentation mode (inline, fullscreen or pip).
player.presentationMode = PresentationMode.pip;
```

### Listening for presentationMode changes

Each time the player transitions from one presentationMode to another, either automatically
or manually through the API, the player dispatches a `presentationmodechange` event that can be
used to update the user-interface.

```typescript
player.addEventListener(
  PlayerEventType.PRESENTATIONMODE_CHANGE,
  (event: PresentationModeChangeEvent) => {
    const newPresentationMode = event.presentationMode;
  }
);
```

Additional configuration is necessary depending on the platform the app runs on.

## Android

Picture-in-picture support for Android was added in Android 8.0 (API level 26).

A react-native app on Android is typically a single-activity application. Launching picture-in-picture
mode means the whole activity transitions to an _out-of-app_ PiP window.

### Enabling PiP support

To enable PiP support, make sure to set `android:supportsPictureInPicture=true` in the
app's manifest, and specify that the activity handles layout configuration changes
so that it does not relaunch when layout changes occur during PiP mode transitions.

```xml
<activity
  android:name=".MainActivity"
  android:configChanges="screenSize|smallestScreenSize|screenLayout|orientation"
  android:supportsPictureInPicture="true">
</activity>
```

Also, add these methods to the `MainActivity` to let react-native know
when the app makes PiP, background and foreground transitions:

```kotlin
public override fun onUserLeaveHint() {
    // Notify the app is backgrounded in case the user taps home or back, and
    // the app needs to transition to PiP automatically.
    this.sendBroadcast(Intent("onUserLeaveHint"))
    super.onUserLeaveHint()
}

override fun onPictureInPictureModeChanged(
    isInPictureInPictureMode: Boolean,
    newConfig: Configuration
) {
    // Notify that the app is changing its picture-in-picture mode.
    super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
    val intent = Intent("onPictureInPictureModeChanged")
    intent.putExtra("isInPictureInPictureMode", isInPictureInPictureMode)
    this.sendBroadcast(intent)
}
```

### Enabling early transitioning to PiP event

You might want to enable [transitioning to PiP](<https://developer.android.com/reference/android/app/PictureInPictureUiState#isTransitioningToPip()>) event for Android 15+ (API 35+). To enable it make sure that
the compile SDK version is set to 35 in your build.gradle `compileSdkVersion = 35`. Also the appropriate intent should be sent from the `MainActivity` to let react-native know when the app starts the PiP animation:

```kotlin
override fun onPictureInPictureUiStateChanged(pipState: PictureInPictureUiState) {
    super.onPictureInPictureUiStateChanged(pipState)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM &&
        pipState.isTransitioningToPip
    ) {
        Intent("onPictureInPictureModeChanged").also {
            it.putExtra("isTransitioningToPip", true)
            sendBroadcast(it)
        }
    }
}
```

Then it should set the `context?.pip` to `PresentationModeChangePipContext.TRANSITIONING_TO_PIP` in the event `PlayerEventType.PRESENTATIONMODE_CHANGE`.

### PiP controls

The PiP window will show the default controls to configure, maximize and close the PiP window.
In addition, the active media session enables a play/pause toggle button and (disabled) play-list
navigator buttons.

| ![pip1](./pip_android_1.png) | ![pip2](./pip_android_2.png) | ![pip3](./pip_android_3.png) |
|------------------------------|:----------------------------:|:----------------------------:|

### User interface

As mentioned before, when choosing `picture-in-picture`
presentation mode on Android the whole activity moves to the PiP window, including the
react-native UI that potentially lies on top. For this reason it is necessary to disable the UI
on Android in PiP mode, as opposed to iOS and web where the video view is separated from the rest

More information on Android PiP support can be found on the [Android developer pages](https://developer.android.com/develop/ui/views/picture-in-picture).

## iOS

No additional configuration is required to support picture-in-picture on iOS.

## Web

On web platforms, only the "out-of-app" PiP presentation mode is supported, allowing the PiP window to float
independently from the browser window on the desktop.
The THEOplayer Web SDK refers to this as
[native-picture-in-picture](https://www.theoplayer.com/docs/theoplayer/v10/api-reference/web/types/PresentationMode.html)
, distinguishing it from the "in-app" floating player window used in picture-in-picture mode.
Note that except for the native PiP controls,
any user interface defined in React Native will not be shown in the PiP window.
