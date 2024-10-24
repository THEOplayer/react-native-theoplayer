import { TestScope } from 'cavy';
import { PlayerEventType, PresentationMode, PresentationModeChangeEvent } from 'react-native-theoplayer';
import hls from '../res/hls.json';
import { expect, preparePlayerWithSource, waitForPlayerEvent } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';

export default function (spec: TestScope) {
  spec.describe('Switches between presentation modes.', function () {
    spec.it('dispatches presentationmodechange events between inline and fullscreen.', async function () {
      const player = await preparePlayerWithSource(hls[0]);

      // Switch to fullscreen.
      const fullscreenPromise = waitForPlayerEvent(player, {
        type: PlayerEventType.PRESENTATIONMODE_CHANGE,
        presentationMode: PresentationMode.fullscreen,
        previousPresentationMode: PresentationMode.inline,
      } as PresentationModeChangeEvent);
      player.presentationMode = PresentationMode.fullscreen;

      //  Wait for 'presentationmodechange' event.
      await fullscreenPromise;

      // Play-out should not pause.
      await sleep(500);
      expect(player.paused).toBeFalsy();

      // Switch back to inline.
      const inlinePromise = waitForPlayerEvent(player, {
        type: PlayerEventType.PRESENTATIONMODE_CHANGE,
        presentationMode: PresentationMode.inline,
        previousPresentationMode: PresentationMode.inline,
      } as PresentationModeChangeEvent);
      player.presentationMode = PresentationMode.inline;

      //  Wait for 'presentationmodechange' event.
      await inlinePromise;

      // Play-out should not pause.
      expect(player.paused).toBeFalsy();
    });
  });
}
