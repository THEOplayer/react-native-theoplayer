import { TestScope } from 'cavy';
import { AdEventType, PlayerEventType, AdEvent } from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { waitForPlayerEvents, waitForPlayerEventTypes } from '../utils/Actions';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';
import { Log } from '../utils/Log';

export default function (spec: TestScope) {
  TestSources()
    .withAds()
    .forEach((testSource: TestSourceDescription) => {
      const specDescription = `Set ${testSource.description} and auto-play`;
      spec.describe(specDescription, function () {
        const itDescription = 'dispatches sourcechange, play, playing and ad events';
        spec.it(itDescription, async function () {
          Log.debug(`### START TEST ###: ${specDescription} - ${itDescription}`);
          const player = await getTestPlayer();
          const playEventsPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

          const adEventsPromise = waitForPlayerEvents(player, [
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_LOADED } as AdEvent,
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BREAK_BEGIN } as AdEvent,
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BEGIN } as AdEvent,
          ]);

          // Start autoplay
          player.autoplay = true;
          player.source = testSource.source;

          // Expect events.
          await playEventsPromise;
          await adEventsPromise;

          Log.debug(`### END TEST ###: ${specDescription} - ${itDescription}`);
        });
      });
    });
}
