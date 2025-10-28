import { TestScope } from 'cavy';
import { PlayerEventType } from 'react-native-theoplayer';
import { expect, preparePlayerWithSource, waitForPlayerEventType, waitForPlayerEventTypes } from '../utils/Actions';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';
import { Log } from '../utils/Log';

const SEEK_THRESHOLD = 500;

export default function (spec: TestScope) {
  TestSources()
    .withPlain()
    .forEach((testSource: TestSourceDescription) => {
      const specDescription = `Set ${testSource.description} and auto-play`;
      spec.describe(specDescription, function () {
        const it1Description = 'dispatches sourcechange event on setting the source without autoplay';
        spec.it(it1Description, async function () {
          Log.debug(`### START TEST ###: ${specDescription} - ${it1Description}`);
          // Set source and wait for playback
          const player = await preparePlayerWithSource(testSource.source, false);

          // Still playing
          expect(player.paused).toBeTruthy();
          Log.debug(`### END TEST ###: ${specDescription} - ${it1Description}`);
        });

        const it2Description = `dispatches sourcechange, play and playing events in order on setting the source with autoplay`;
        spec.it(it2Description, async function () {
          Log.debug(`### START TEST ###: ${specDescription} - ${it2Description}`);
          // Set source and wait for playback
          const player = await preparePlayerWithSource(testSource.source);

          // Still playing
          expect(player.paused).toBeFalsy();
          Log.debug(`### END TEST ###: ${specDescription} - ${it2Description}`);
        });

        const it3Description = 'dispatches a seeked event after seeking';
        spec.it(it3Description, async function () {
          Log.debug(`### START TEST ###: ${specDescription} - ${it3Description}`);
          // Set source and wait for playback
          const player = await preparePlayerWithSource(testSource.source);

          // Seek
          const seekPromise = waitForPlayerEventType(player, PlayerEventType.SEEKED);
          const seekTime = 10e3;
          player.currentTime = seekTime;

          // Wait for `seeked` event.
          await seekPromise;

          // Expect currentTime to be updated.
          expect(player.currentTime).toBeSmallerThanOrEqual(seekTime + SEEK_THRESHOLD);
          Log.debug(`### END TEST ###: ${specDescription} - ${it3Description}`);
        });

        const it4Description = `dispatches paused, play and playing events after pausing & resuming playback of the source`;
        spec.it(it4Description, async function () {
          Log.debug(`### START TEST ###: ${specDescription} - ${it4Description}`);
          // Set source and wait for playback
          const player = await preparePlayerWithSource(testSource.source);

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
          Log.debug(`### END TEST ###: ${specDescription} - ${it4Description}`);
        });
      });
    });
}
