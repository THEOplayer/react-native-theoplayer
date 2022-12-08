## Casting with Chromecast and Airplay

### Overview

The basics of both Chromecast and Airplay are well-described on
THEOplayer's [Knowledge Base](https://docs.theoplayer.com/how-to-guides/03-cast/01-chromecast/00-introduction.md).
The `react-native-theoplayer` package has support for both.

This page first outlines the setup
needed for Chromecast and Airplay, and then describes the player's cast API and events
subscription, which is common for both.

### Chromecast

#### Setup

To enable Chromecast we recommend using the
[`react-native-google-cast`](https://github.com/react-native-google-cast/react-native-google-cast)
package, which comes with native support for both iOS and Android. It is fully-featured and provides the possibility to manage
devices and sessions, send a source description and listen for cast events.
Most importantly, it includes a `<CastButton>` component that can added to the app's UI, as demonstrated in the [example app](example-app.md).
This button represents a native media route button that shows the connection state and opens a
device dialog when tapped.

```tsx
<CastButton
  style={styles.castButton}
  tintColor={chromecastConnected ? '#ffc50f' : 'white'}
/>
```

The THEOplayer SDK is able to send a source description to a receiver and route all cast events through its
API, so we will not need `react-native-google-cast`'s functionality for that.

The [installation instructions](https://react-native-google-cast.github.io/docs/getting-started/installation)
for `react-native-google-cast` also cover the steps to enable support for Chromecast in your app.

Enabling the player with Chromecast support requires a different approach on each platform.

<details>
<summary>Android</summary>

The Android SDK is modular-based, so enabling Chromecast is limited to including
the cast extension in gradle by setting this flag in your `gradle.properties`:

```
# Enable THEOplayer Extensions (default: disabled)
THEOplayer_extensionCast = true
```
</details>

<details>
<summary>iOS</summary>

To enable Chromecast for the iOS platform, a dependency to the THEOplayer SDK
that includes the Google Cast library needs to be added. See [Custom iOS framework](./custom-ios-framework.md) for more details.

</details>

#### THEOplayerView configuration

In the configuration of a `THEOplayerView` component you can optionally override the
receiver's appID, which is already set natively through `CastOptionsProvider` on Android
and `AppDelegate` on iOS:

```javascript
const playerConfig: PlayerConfiguration = {
  cast: {
    chromecast: {
      appID: '<receiverAppID'
    },
    strategy: 'auto'
  }
}
```

The `strategy` property indicates the *join strategy* that will be used when starting/joining sessions:

- `auto`: The player will automatically join a cast session if one exists when play is called.
- `manual` (**default**): The player needs to start or join the session manually using its cast API. See next section for details.
- `disabled`: The player is not affected by cast sessions and is not castable.

In case the join strategy `manual` is chosen and a cast session is started by `react-native-google-cast`, it is necessary
to explicitly let the player either join or take over the current session.
This can be done by listening to the cast state and using the player's cast API to either start or join:

```typescript
import CastContext, {CastState} from "react-native-google-cast";

useEffect(() => {
  const subscription = CastContext.onCastStateChanged((castState) => {
    if (castState === CastState.CONNECTED) {
      // Let the player either start or join the session.
      video.cast.chromecast?.start();
    }
  })
  return () => subscription.remove()
}, [])
```

The [example app](./example-app.md) uses strategy `auto` so the player will automatically
send its source description when a session is created.

### Airplay

TODO

### Cast API

The `react-native-theoplayer` package includes a cast API to control or start cast sessions,
either Chromecast or Airplay, which includes the following functionality:

| Property/Method | Description                                            |
|-----------------|--------------------------------------------------------|
| `casting`       | Whether the player is connected with a casting device. |
| `chromecast`    | An interface to the [Chromecast API](#chromecast-api). |
| `airplay`       | An interface to the [Airplay API](#airplay-api).       |

#### Chromecast API

| Property/Method | Description                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------|
| `casting`       | Whether the player is connected with a chromecast device.                                                                 |
| `state`         | The state of the casting process, with possible values: `'unavailable'`, `'available'`, `'connecting'` and `'connected'`. |
| `start`         | Start a casting session with the player's source. A native browser pop-up will prompt to choose a chromecast device.      |
| `stop`          | Stop the active casting session.                                                                                          |
| `join`          | Join an active casting session.                                                                                           |
| `leave`         | Leave the active casting session. This does not stop the session when other devices are connected.                        |

#### Airplay API

| Property/Method | Description                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------|
| `casting`       | Whether the player is connected with an airplay device.                                                                   |
| `state`         | The state of the casting process, with possible values: `'unavailable'`, `'available'`, `'connecting'` and `'connected'`. |
| `start`         | Start a casting session with the player's source. A native browser pop-up will prompt to choose a airplay device.         |
| `stop`          | Stop the active casting session.                                                                                          |


### Subscribing to Cast Events

The `THEOplayerView` component includes a callback to subscribe to cast events:

```tsx
<THEOplayerView
  onCastEvent={(event: CastEvent) => {
    const { type } = event;
    console.log(TAG, 'onCastEvent', type);
  }}
/>
```

Where [`CastEvent`](../src/api/event/CastEvent.ts)
contains a field indicating the type of the event, which can be any of the following:

| Event name              | Event                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------|
| `chromecaststatechange` | the ChromeCast state was changed. The new state is described in a `state` property.     |
| `airplaystatechange`    | the Airplay state was changed. The new state is described in a `state` property.        |
| `chromecasterror`       | an error occurred when using Chromecast. The error is described in an `error` property. |
