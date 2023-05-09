## Getting started with the react-native-theoplayer UI

The `react-native-theoplayer` package provides UI components and a `DefaultTHEOplayerUi` that can be used with
alongside the `THEOplayerView`.

This section covers what is possible with the current UI and also documents the known limitations.

![basic-ui](./example-app-player-ui.png)

### Table of Contents

- [Using the DefaultTHEOplayerUi](#using-the-defaulttheoplayerui)
- [Creating your own custom UI](#creating-your-own-custom-ui)
- [Available components](#available-components)
- [Known Limitations](#known-limitations)

### Prerequisites

The UI components have a few non-transitive dependencies that are required to be installed manually:

```bash
npm install \
  react-native-svg \
  @react-native-community/slider
```

### Using the DefaultTHEOplayerUi

The `THEOplayerDefaultUi` can be used to provide basic playback controls to the viewer.
As the default UI also includes Chromecast & Airplay support, make sure to configure these first as explained in the
[cast documentation](./cast.md).

```tsx
const App = () => {
  return (
    <THEOplayerDefaultUi
      style={StyleSheet.absoluteFill}
      config={playerConfig}
      onPlayerReady={onPlayerReady}
    />
  );
};
```

The UI can be styled with a `theme: THEOplayerTheme` prop, to give it your own look and feel.

Additional components can be passed as properties to be added to the top/bottom control bars of the UI. These can be
components from the `react-native-theoplayer` package, or they could be your own custom components:

```tsx
const App = () => {
  return (
    <THEOplayerDefaultUi
      style={StyleSheet.absoluteFill}
      config={playerConfig}
      {/* A UI component provided by react-native-theoplayer.*/}
      bottomSlot={<PipButton/>}
      {/* A custom component.*/}
      topSlot={<MyCustomComponent/>}
    />
  );
};
```

This use-case is implemented in the [example app](./example-app.md) with the
custom [SourceMenuButton](../example/src/custom/SourceMenuButton.tsx).

### Available components

The available UI components with their documentation can be found [here](../src/ui).

### Creating your own custom UI

All components inside the `DefaultTHEOplayerUi` are available through the `react-native-theoplayer` package and can
be use these to create your own custom layout. Since `DefaultTHEOplayerUi` is our version of a "custom" UI, you could
use this as a starting point for your own custom layout.

This example shows a UI layout with only basic playback controls:

```tsx
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
  };
  return (
    <View style={StyleSheet.absoluteFill}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
        {player !== undefined && (
          <UiContainer
            theme={DEFAULT_THEOPLAYER_THEME}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50}/>}
            center={
              <CenteredControlBar
                left={<SkipButton skip={-10}/>}
                middle={<PlayButton/>}
                right={<SkipButton skip={30}/>}
              />}
            bottom={
              <>
                <ControlBar>
                  <SeekBar/>
                </ControlBar>
                <ControlBar>
                  <MuteButton/>
                  <TimeLabel showDuration={true}/>
                  <Spacer/>
                  <FullscreenButton/>
                </ControlBar>
              </>
            }
          />
        )}
      </THEOplayerView>
    </View>
  );
}
```

### Known Limitations

With the UI come a number of limitations that we are currently working on, and should be tackled in future versions:

- Support for TV platforms (remote control navigation)
- Ad support
- TextTrack styling
