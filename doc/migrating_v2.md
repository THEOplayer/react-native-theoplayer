# Migrating to `react-native-theoplayer` v2.x

The v2 release of `react-native-theoplayer` comes with a number of breaking API changes.
The `THEOplayerView` component is now split into two separate objects,
`THEOplayerView` and `THEOplayer`.
In addition, events are being dispatched to subscribed listeners instead of through callback properties.

In this section we will highlight the differences between the old and new approach in order
to allow a smooth transition.

## Player Creation

The `THEOplayerView` component is created and mounted as before.

Instead of passing all player properties, such as `paused`, `muted` and `volume`,
as properties to the `THEOplayerView` component, we now pass a `onPlayerReady`
callback that gives a `THEOplayer` object once it is created and ready. This interface
allows directly setting properties or executing methods
such as `player.autoplay = true` and `player.pause()`.

<table>
<th>v1.x</th><th>>= v2.x</th>
<tr valign="top">
<td>

```tsx
const App = () => {
  return (
    <View style={styles.container}>
    <THEOplayerView
      config={playerConfig}
      source={source}
      paused={false} />
    </View>
  );
};
```

</td>
<td>

```tsx
const onPlayerReady = (player: THEOplayer) => {
  player.autoplay = true;
  player.source = source;
}

const App = () => {
  return (
    <View style={styles.container}>
      <THEOplayerView
        config={playerConfig}
        onPlayerReady={onPlayerReady} />
    </View>
  );
};
```

</td>
</tr>
</table>

## Listening to Player Events

As of v2.x, the event callbacks have been removed from `THEOplayerView` and replaced
by a subscription approach.

<table>
<th>v1.x</th><th>>= v2.x</th>
<tr valign="top">
<td>

```tsx
const App = () => {
  const [error, setError] = useState<PlayerError | undefined>();
  const [textTracks, setTextTracks] = useState<TextTrack[]>([]);

  const onErrorCallback = useCallback((event: ErrorEvent) => {
    setError(event.error);
  }, []);

  const onLoadedMetadataCallback = useCallback((event: LoadedMetadataEvent) => {
    console.log('DEMO', `${event.textTracks.length} textTracks available`);
    setTextTracks(event.textTracks);
  }, []);

  return (
    <View style={styles.container}>
    <THEOplayerView
      config={playerConfig}
      source={source}
      paused={false}
      onError={onErrorCallback}
      onLoadedMetadata={onLoadedMetadataCallback}/>
    </View>
  );
};
```

</td>
<td>

```tsx
const App = () => {
  const theoPlayer = useRef<THEOplayer>();
  const [error, setError] = useState<PlayerError | undefined>();
  const [textTracks, setTextTracks] = useState<TextTrack[]>([]);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    theoPlayer.current = player;
    player.autoplay = true;
    player.source = source;

    player.addEventListener(PlayerEventType.ERROR, (event: ErrorEvent) => setError(event.error));
    player.addEventListener(PlayerEventType.LOADED_METADATA, (event: LoadedMetadataEvent) => {
      console.log('DEMO', `${event.textTracks.length} textTracks available`);
      setTextTracks(event.textTracks);
    });
  }, [theoPlayer]);

  return (
    <View style={styles.container}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />
      {error && <View style={styles.errorContainer}><Text style={styles.error}>{error?.errorMessage}</Text></View>}
    </View>
  );
};
```

</td>
</tr>
</table>

## AdsAPI and CastAPI

The existing ads and casting API's work the same as before. Instead of requesting an API
from the view's reference, it can now be requested directly from the player instance.

<table>
<th>v1.x</th><th>>= v2.x</th>
<tr valign="top">
<td>

```tsx
<THEOplayerView
  ref={(ref: THEOplayerView) => {
    this.player = ref;
  }}
  config={playerConfig}
/>

// Query whether an ad is currently playing.
const isPlayingAd = () => {
  return player.ads.playing();
};
```

</td>
<td>

```tsx
<THEOplayerView
  config={playerConfig}
  onPlayerReady={onPlayerReady}
/>

const onPlayerReady = (player: THEOplayer) => {
  player.autoplay = true;
  player.source = source;

  // Query whether an ad is currently playing.
  const adIsPlaying = await player.ads.playing();
}
```

</td>
</tr>
</table>
