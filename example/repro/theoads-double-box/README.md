# THEOads back-to-back double box: buffering spinner stays visible (web)

Play the **THEOads • Back-to-back double box (spinner repro)** source in the web example and seek to about 0:50. After the second interstitial ends, the buffering spinner stays visible while content plays. Pausing and resuming clears it.

- The source has two `com.theoplayer.theoads.interstitial` date ranges (`LAYOUT=DOUBLE`, `DURATION=15`) at about 1:00 and 1:17.
- `App.tsx` mirrors the reporter's production web config: `mutedAutoplay: 'all'` and `ads.vpaidMode: 'disabled'`.

## Observed

- After the second interstitial ends, the web SDK dispatches `readystatechange` with `event.readyState === 0` while `player.readyState === 4`. Nothing follows.
- `useWaiting` in `@theoplayer/react-native-ui` uses the event payload (`event.readyState < 3`), so the spinner stays. Using `player.readyState` instead clears it.

Seen with `react-native-theoplayer` 11.7.0, `@theoplayer/react-native-ui` 0.23.3 and `theoplayer` 11.12.1 / 11.14.1.
