import { TestScope } from 'cavy';
import { Platform } from 'react-native';
import { PlayerEventType, SourceDescription } from 'react-native-theoplayer';
import dash from '../res/dash.json';
import hls from '../res/hls.json';
import mp4 from '../res/mp4.json';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { expect, waitForPlayerEventType, waitForPlayerEventTypes } from '../utils/Actions';

const SEEK_THRESHOLD = 1e-1;

async function preparePlayerWithSource(source: SourceDescription, autoplay: boolean) {
  const player = await getTestPlayer();
  const eventsPromise = waitForPlayerEventType(player, PlayerEventType.SOURCE_CHANGE);
  const eventsPromiseAutoPlay = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

  // Start autoplay
  player.autoplay = autoplay;
  player.source = source;

  // Wait for `sourcechange`, `play` and `playing` events.
  if (autoplay) {
    await eventsPromiseAutoPlay;
  } else {
    await eventsPromise;
  }
  return player;
}

function testBasicPlayout(spec: TestScope, title: string, source: SourceDescription) {
  spec.describe(title, function () {
    spec.it('dispatches sourcechange event on setting a source without autoplay', async function () {
      // Set source and wait for playback
      const player = await preparePlayerWithSource(source, false);

      // Still playing
      expect(player.paused).toBeTruthy();
    });

    spec.it('dispatches sourcechange, play and playing events in order on setting a source with autoplay', async function () {
      // Set source and wait for playback
      const player = await preparePlayerWithSource(source, true);

      // Still playing
      expect(player.paused).toBeFalsy();
    });

    spec.it('dispatches a seeked event after seeking', async function () {
      // Set source and wait for playback
      const player = await preparePlayerWithSource(source, true);

      // Seek
      const seekPromise = waitForPlayerEventType(player, PlayerEventType.SEEKED);
      const seekTime = 10e3;
      player.currentTime = seekTime;

      // Wait for `seeked` event.
      await seekPromise;

      // Expect currentTime to be updated.
      expect(player.currentTime).toBeSmallerThanOrEqual(seekTime + SEEK_THRESHOLD);
    });

    spec.it('dispatches paused, play and playing events after pausing & resuming playback', async function () {
      // Set source and wait for playback
      const player = await preparePlayerWithSource(source, true);

      // Pause play-out.
      const pausePromise = waitForPlayerEventType(player, PlayerEventType.PAUSE);
      player.pause();

      //  Wait for 'paused' event.
      await pausePromise;

      // Resume play-out.
      const playPromises = waitForPlayerEventTypes(player, [PlayerEventType.PLAY, PlayerEventType.PLAYING]);
      player.play();

      // Wait for 'play' and 'playing' events.
      await playPromises;
    });
  });
}

export default function (spec: TestScope) {
  if (Platform.OS === 'android' || Platform.OS === 'web') {
    testBasicPlayout(spec, 'Set DASH source and auto-play', dash[0]);
  }
  testBasicPlayout(spec, 'Set HLS source and auto-play', hls[0]);
  testBasicPlayout(spec, 'Set mp4 source and auto-play', mp4[0]);
}
