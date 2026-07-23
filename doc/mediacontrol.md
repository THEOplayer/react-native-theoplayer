# Media Control API

Our [Media Control API](../src/api/media/MediaControlAPI.ts) provides a unified way to customise the behaviour of the different media playback controls and media sessions across platforms (iOS, Android, and Web). It enables integration with platform-level media controls such as lock screen controls, notification controls, media session, ...

## What is it used for?

- **Remote Control Actions:** Handle play, pause, seek, skip, and track switching from system UI (lock screen, notifications, etc.).
- **Media Session Integration:** Display media state and respond to hardware/media key events.
- **Custom Playlist Navigation:** Enable playlist navigation using system controls.

## Platform Support

- **Android:** Integrates with [Media Session](https://developer.android.com/guide/topics/media-apps/working-with-a-media-session) and media notifications.
- **iOS:** Integrates with [Now Playing](https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter) and [Remote Command Center](https://developer.apple.com/documentation/mediaplayer/mpremotecommandcenter).
- **Web:** Integrates with the [Media Session API](https://www.w3.org/TR/mediasession/).

## MediaControl API and MediaControl Action Reference

The [Media Control API](../src/api/media/MediaControlAPI.ts) allows you to override the default player's behaviour, by defining a handler for one of the MediaControl Actions:
```typescript
setHandler(action: MediaControlAction, handler: MediaControlHandler): void;
```

The [MediaControlAction](../src/api/media/MediaControlAPI.ts) enum defines all actions that can be controlled by the Media Control API:

- `PLAY`: Triggered when the user presses play.
- `PAUSE`: Triggered when the user presses pause.
- `SKIP_TO_NEXT`: Triggered when the user requests to go to the next track or playlist item.
- `SKIP_TO_PREVIOUS`: Triggered when the user requests to go to the previous track or playlist item.

Play and pause are only enabled for VOD and when the stream is not displaying an ad. For LIVE streams this can be configured through `allowLivePlayPause` in the player's [MediaControlConfiguration](../src/api/media/MediaControlConfiguration.ts).

If no handler is defined for an action, the player's default behaviour is applied.

### iOS: Track Control vs. Seek Behavior

On iOS, when you set handlers for `SKIP_TO_NEXT` or `SKIP_TO_PREVIOUS`, these handlers will take precedence over the seek behavior. This means:

- **If you provide next/previous track handlers:**
  - System controls (e.g., lock screen) will display and trigger your handlers for track navigation.
  - Seeking forward/backward via next/previous is not shown as seperate controls. (Platform limitation)
- **If you do not provide next/previous handlers:**
  - The system will display and use the seek forward/backward functionality with the configured or default intervals.

This allows you to customize whether system controls are used for playlist navigation or for seeking within the current track.

Note: In both cases, you can always use the system's time slider to adjust the playhead to seek to a location in the stream.

## Multiple players: single media-session owner

Each platform exposes a **single, process-wide** media session and set of remote controls (iOS `MPNowPlayingInfoCenter` / `MPRemoteCommandCenter`, Android `MediaSession` + notification,
Web `navigator.mediaSession`). When your app renders **more than one** `THEOplayerView` at the same time, they all share this single system session.

Because of that, **only one player should own the media session at any given time**. It is the **application's responsibility** to designate that single owner and to ensure no other player
simultaneously publishes Now Playing info or handles remote commands. If multiple players are allowed to take control at once:

- **Now Playing info** (title, artwork, position) from the different players will overwrite each other.
- **Remote commands** (play/pause/seek/skip) become last‑writer‑wins: the most recent player to claim the controls keeps them, and control can flip between players as each one updates its state.

### Recommended approach

Keep a single "active" player and toggle ownership so that exactly one player has the media session enabled at a time. You can update ownership across players using:

```typescript
// Give this player exclusive ownership of the media session / remote commands.
player.mediaControl?.setEnabled(isActive);
```

where `isActive` is true for the player that should own the media session and false for all other players. The owner will have it's state reflected on the media session widgets.

### iOS: lock screen and Control Center play/pause state with multiple playing players

As a good practice, disable [background audio](./background.md) for any player that does not own the media session or make sure only one player is playing at any given time. This could be achieved by shifting the ownership when a player starts playing (PLAY or PLAYING event received) and accordingly pause other players.

## Configuration

You can add additional media control configuration using the [MediaControlConfiguration](../src/api/media/MediaControlConfiguration.ts) interface:

```typescript
export interface MediaControlConfiguration {
  mediaSessionEnabled?: boolean; // (Web/Android) Enable/disable media session (default: true)
  skipForwardInterval?: number;  // (Web/Android/iOS) Skip forward interval (defaults: 5s on Web, Android / 15s on iOS)
  skipBackwardInterval?: number; // (Web/Android/iOS) Skip backward interval (defaults: 5s on Web, Android / 15s on iOS)
  allowLivePlayPause?: boolean;  // (Android/iOS) Enable play/pause for live (defaults: false on Android / true on iOS)
}
```

## Example Usage: Playlist Navigation

The Media Control API can be used to handle playlist navigation via system controls. For example, in a custom React hook:

```typescript
import { MediaControlAction } from 'react-native-theoplayer';

// ...
useEffect(() => {
  if (!player) return;

  const handleNext = () => { /* update player source ... */ };
  const handlePrevious = () => { /* update player source ... */ };

  player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_NEXT, handleNext);
  player.mediaControl?.setHandler(MediaControlAction.SKIP_TO_PREVIOUS, handlePrevious);
}, [player, filteredSources]);
```

This enables users to skip tracks using lock screen or Bluetooth controls. If you do not set these handlers, the controls will perform seek actions instead.

## Demo

As a demonstration, see the the `usePlaylist` hook in our [example app](../example/).
