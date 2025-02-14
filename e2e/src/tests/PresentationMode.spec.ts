import { TestScope } from 'cavy';
import { PlayerEventType, PresentationMode, PresentationModeChangeEvent, RenderingTarget, THEOplayer } from 'react-native-theoplayer';
import { expect, preparePlayerWithSource, waitForPlayerEvent, waitForPlayerEventType } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';
import { Platform } from 'react-native';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';

export default function (spec: TestScope) {
  TestSources()
    .withPlain()
    .withAds()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Switch between presentation modes during play-out of a ${testSource.description}`, function () {
        spec.it('dispatches presentationmodechange events between inline and fullscreen.', async function () {
          const player = await preparePlayerWithSource(testSource.source);

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
            previousPresentationMode: PresentationMode.fullscreen,
          } as PresentationModeChangeEvent);
          player.presentationMode = PresentationMode.inline;

          //  Wait for 'presentationmodechange' event.
          await inlinePromise;

          // Play-out should not pause.
          expect(player.paused).toBeFalsy();
        });
      });

      if (Platform.OS === 'android') {
        spec.describe(`Switch between rendering targets during play-out of a ${testSource.description}`, function () {
          spec.it('continues play-out.', async function () {
            const player = await preparePlayerWithSource(testSource.source);

            await switchRenderingTarget(player, RenderingTarget.TEXTURE_VIEW);
            await switchRenderingTarget(player, RenderingTarget.SURFACE_VIEW);
          });
        });
      }
    });
}

async function switchRenderingTarget(player: THEOplayer, renderingTarget: RenderingTarget, sleepTime: number = 500) {
  console.debug(`Switching to ${renderingTarget}`);
  await sleep(sleepTime);
  player.renderingTarget = renderingTarget;
  await waitForPlayerEventType(player, PlayerEventType.TIME_UPDATE);
}
