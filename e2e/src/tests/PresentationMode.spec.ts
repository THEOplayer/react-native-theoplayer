import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType, PresentationMode, PresentationModeChangeEvent, RenderingTarget, THEOplayer } from 'react-native-theoplayer';
import { preparePlayerWithSource, waitForPlayerEvent, waitForPlayerEventType } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';
import { Log } from '../utils/Log';

export default function (spec: TestScope) {
  TestSources()
    .withPlain()
    .withAdsIf(spec.platform() !== 'ios')
    .forEach((testSource: TestSourceDescription) => {
      // Browsers only allow entering fullscreen from a user gesture, so the
      // presentation mode tests cannot run on web; report them as skipped.
      spec.describeIf(spec.platform() !== 'web', `Switch between presentation modes during play-out of a ${testSource.description}`, () => {
        spec.it('dispatches presentationmodechange events between inline and fullscreen.', async () => {
          const player = await preparePlayerWithSource(spec, testSource.source);

          // Switch to fullscreen.
          const fullscreenPromise = waitForPlayerEvent(player, {
            type: PlayerEventType.PRESENTATIONMODE_CHANGE,
            presentationMode: PresentationMode.fullscreen,
            previousPresentationMode: PresentationMode.inline,
          } as PresentationModeChangeEvent);
          player.presentationMode = PresentationMode.fullscreen;

          // Wait for 'presentationmodechange' event.
          await fullscreenPromise;
          expect(player.presentationMode).toBe(PresentationMode.fullscreen);

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

          // Wait for 'presentationmodechange' event.
          await inlinePromise;
          expect(player.presentationMode).toBe(PresentationMode.inline);

          // Play-out should not pause.
          expect(player.paused).toBeFalsy();
        });
      });

      // Rendering targets only exist on Android.
      spec.describeIf(spec.platform() === 'android', `Switch between rendering targets during play-out of a ${testSource.description}`, () => {
        spec.it('continues play-out.', async () => {
          const player = await preparePlayerWithSource(spec, testSource.source);

          await switchRenderingTarget(player, RenderingTarget.TEXTURE_VIEW);
          await switchRenderingTarget(player, RenderingTarget.SURFACE_VIEW);
        });
      });
    });
}

async function switchRenderingTarget(player: THEOplayer, renderingTarget: RenderingTarget, sleepTime: number = 500) {
  Log.debug(`Switching to ${renderingTarget}`);
  await sleep(sleepTime);
  player.renderingTarget = renderingTarget;
  await waitForPlayerEventType(player, PlayerEventType.TIME_UPDATE);
}
