# Matching the TV display to the content

On tvOS, a television often supports several display modes: a range of refresh rates and dynamic range
formats such as SDR, HDR10 or Dolby Vision. By default the app renders in the mode that tvOS was
configured with, which means content is converted to that mode: a 24fps Dolby Vision movie played on a
60Hz SDR output loses both its cadence and its dynamic range.

Setting `manageContentMatching` to `true` lets the player pick the display mode that fits the content
it is about to play, before playback starts:

```typescript
player.manageContentMatching = true;
```

The property defaults to `false`, and can be changed at any time during the lifetime of the player.

## Remarks

- The property is only supported on tvOS. On all other platforms, setting it has no effect.
- The player only applies the display criteria while it is presented in `PresentationMode.fullscreen`.
- The display only follows these criteria when the viewer enabled content matching on the TV in
  **Settings > Video and Audio > Match Content**.
- Switching display mode can briefly blank the screen, so only enable it on a single, fullscreen player,
  and preferably not while another player is producing frames.

## Use case: a movie kiosk with auto-playing trailers

Consider a movie catalogue where selecting an item auto-starts its trailer in an inline preview player,
and tapping the item opens the movie fullscreen.

The trailer is a preview next to the catalogue UI: it is short, it is interrupted every time the viewer
moves to another item, and a display mode switch would blank the screen on every selection. So content
matching stays disabled for it. Once the viewer commits to the movie and the player goes fullscreen,
content matching is enabled so the TV switches to the movie's frame rate and dynamic range - the Dolby
Vision presentation the movie was mastered in.

Because the flag only needs to be correct before playback starts, it can be flipped together with the
presentation mode:

```typescript
const playTrailer = (trailer: SourceDescription) => {
  // A preview next to the catalogue: keep the display mode as it is.
  player.manageContentMatching = false;
  player.presentationMode = PresentationMode.inline;
  player.source = trailer;
  player.autoplay = true;
};

const playMovie = (movie: SourceDescription) => {
  // The main feature: let the TV match the frame rate and dynamic range of the movie.
  player.manageContentMatching = true;
  player.presentationMode = PresentationMode.fullscreen;
  player.source = movie;
  player.autoplay = true;
};
```

If the app instead lets the viewer expand the running trailer to fullscreen, keep the flag in sync with
the presentation mode. Note that the display criteria are applied when a source starts loading, so an
already playing stream keeps its current display mode until the next source:

```typescript
player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, (event: PresentationModeChangeEvent) => {
  player.manageContentMatching = event.presentationMode === PresentationMode.fullscreen;
});
```
