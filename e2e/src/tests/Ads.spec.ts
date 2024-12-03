import { TestScope } from 'cavy';
import { AdEventType, PlayerEventType, AdEvent } from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { waitForPlayerEvents } from '../utils/Actions';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';

export default function (spec: TestScope) {
  TestSources()
    .withAds()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Set ${testSource.description} and auto-play`, function () {
        spec.it('dispatches sourcechange, play, playing and ad events', async function () {
          const player = await getTestPlayer();
          const eventsPromise = waitForPlayerEvents(player, [
            { type: PlayerEventType.SOURCE_CHANGE },
            { type: PlayerEventType.PLAY },
            { type: PlayerEventType.PLAYING },
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BREAK_BEGIN } as AdEvent,
            { type: PlayerEventType.AD_EVENT, subType: AdEventType.AD_BEGIN } as AdEvent,
          ]);

          // Start autoplay
          player.autoplay = true;
          player.source = testSource.source;

          // Expect events in order.
          await eventsPromise;
        });
      });
    });
}
