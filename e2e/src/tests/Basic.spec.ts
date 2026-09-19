import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType } from 'react-native-theoplayer';
import { preparePlayerWithSource, seekTo, waitForPlayerEventType, waitForPlayerEventTypes } from '../utils/Actions';
import { plainSources } from '../utils/SourceUtils';

const SEEK_THRESHOLD = 500;

export default function (spec: TestScope) {
  spec.describe.each(plainSources(spec.platform()))('Set $description and auto-play', (testSource) => {
    spec.it('dispatches sourcechange event on setting the source without autoplay', async () => {
      const player = await preparePlayerWithSource(spec, testSource.source, false);

      // Not playing.
      expect(player.paused).toBeTruthy();
    });

    spec.it('dispatches sourcechange, play and playing events in order on setting the source with autoplay', async () => {
      const player = await preparePlayerWithSource(spec, testSource.source);

      // Still playing.
      expect(player.paused).toBeFalsy();
    });

    spec.it('dispatches a seeked event after seeking', async () => {
      const player = await preparePlayerWithSource(spec, testSource.source);

      // Seek and wait for the `seeked` event.
      const seekTime = 5e3;
      await seekTo(player, seekTime);

      // Expect currentTime to be updated.
      expect(player.currentTime).toBeLessThanOrEqual(seekTime + SEEK_THRESHOLD);
    });

    spec.it('dispatches paused, play and playing events after pausing & resuming playback of the source', async () => {
      const player = await preparePlayerWithSource(spec, testSource.source);

      // Pause play-out.
      const pausePromise = waitForPlayerEventType(player, PlayerEventType.PAUSE);
      player.pause();

      // Wait for 'paused' event.
      await pausePromise;
      expect(player.paused).toBeTruthy();

      // Resume play-out.
      const playPromises = waitForPlayerEventTypes(player, [PlayerEventType.PLAY, PlayerEventType.PLAYING]);
      player.play();

      // Wait for 'play' and 'playing' events.
      await playPromises;
      expect(player.paused).toBeFalsy();
    });
  });
}
