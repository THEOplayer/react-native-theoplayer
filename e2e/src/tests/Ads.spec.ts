import { expect, TestScope } from 'react-native-cavynext';
import { AdEventType, PlayerEventType, AdEvent } from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { waitForPlayerEvents, waitForPlayerEventTypes } from '../utils/Actions';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';

const adEvent = (subType: AdEventType): Partial<AdEvent> => ({ type: PlayerEventType.AD_EVENT, subType }) as Partial<AdEvent>;

export default function (spec: TestScope) {
  TestSources()
    .withAds()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Set ${testSource.description} and auto-play`, () => {
        spec.it('dispatches sourcechange, play, playing and ad events', async () => {
          const player = await getTestPlayer();
          const playEventsPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

          const adEventsPromise = waitForPlayerEvents(
            player,
            [
              adEvent(AdEventType.AD_LOADED),
              adEvent(AdEventType.AD_BREAK_BEGIN),
              adEvent(AdEventType.AD_BEGIN),
              adEvent(AdEventType.AD_FIRST_QUARTILE),
              adEvent(AdEventType.AD_MIDPOINT),
              adEvent(AdEventType.AD_THIRD_QUARTILE),
              adEvent(AdEventType.AD_END),
              adEvent(AdEventType.AD_BREAK_END),
            ],
            false,
          );

          // Start autoplay
          player.autoplay = true;
          player.source = testSource.source;

          // Expect events.
          const playEvents = await playEventsPromise;
          const adEvents = await adEventsPromise;
          expect(playEvents.length).toBeGreaterThanOrEqual(3);
          expect(adEvents.length).toBeGreaterThanOrEqual(8);
        });
      });
    });
}
