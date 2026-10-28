import { Platform } from 'react-native';
import { expect, TestScope } from 'react-native-cavynext';
import { AdEventType, PlayerEventType, AdEvent, type Event, SourceDescription, THEOplayer } from 'react-native-theoplayer';
import { getTestPlayer, waitForPlayerEvents, waitForPlayerEventTypes } from '../utils/Actions';
import { adSources } from '../utils/SourceUtils';
import { sleep } from '../utils/TimeUtils';
import { Log } from '../utils/Log';

const adEvent = (subType: AdEventType): Partial<AdEvent> => ({ type: PlayerEventType.AD_EVENT, subType }) as Partial<AdEvent>;

const AD_BREAK_EVENTS = [
  adEvent(AdEventType.AD_LOADED),
  adEvent(AdEventType.AD_BREAK_BEGIN),
  adEvent(AdEventType.AD_BEGIN),
  adEvent(AdEventType.AD_FIRST_QUARTILE),
  adEvent(AdEventType.AD_MIDPOINT),
  adEvent(AdEventType.AD_THIRD_QUARTILE),
  adEvent(AdEventType.AD_END),
  adEvent(AdEventType.AD_BREAK_END),
];

// A pre-roll needs to load, play out and report its quartiles, but is done well
// within a minute. The shorter budget leaves room for a second attempt.
const AD_BREAK_TIMEOUT = { timeout: 60000 };

// On a loaded CI machine the ad request can be lost before it is even sent: IMA
// runs it in a WKWebView, and the runner sometimes takes longer to launch that
// web content process than IMA is willing to wait. Retry once instead of
// failing the run over it.
const ATTEMPTS = 2;

export default function (spec: TestScope) {
  if (Platform.OS === 'web') {
    // The IMA HTML5 SDK fails to issue its ad request from datacenter/CI
    // environments (IMA error 1005 before the VAST tag is even fetched), so
    // this test cannot pass on web CI. Native platforms use the native IMA
    // SDKs through the platform network stack and are unaffected.
    // See https://github.com/THEOplayer/react-native-theoplayer/pull/902#issuecomment-5481270151
    return;
  }

  spec.describe.each(adSources())('Set $description and auto-play', (testSource) => {
    spec.it('dispatches sourcechange, play, playing and ad events', async () => {
      const player = await getTestPlayer(spec);

      for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        try {
          const { playEvents, adEvents } = await playAdBreak(player, testSource.source);
          expect(playEvents.length).toBeGreaterThanOrEqual(3);
          expect(adEvents.length).toBeGreaterThanOrEqual(8);
          return;
        } catch (error) {
          if (attempt === ATTEMPTS) {
            throw error;
          }
          Log.error(`[Ads.spec] Attempt ${attempt} failed: ${(error as Error).message}`);
          await resetPlayer(player);
        }
      }
    });
  });
}

async function playAdBreak(player: THEOplayer, source: SourceDescription) {
  // Attach the listeners before touching the player, so no event can be missed.
  const playEventsPromise = waitForPlayerEventTypes(
    player,
    [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING],
    true,
    AD_BREAK_TIMEOUT,
  );
  const adEventsPromise = waitForPlayerEvents(player, AD_BREAK_EVENTS, false, AD_BREAK_TIMEOUT);

  // Start autoplay
  player.autoplay = true;
  player.source = source;

  // Expect events. Both waits are awaited to completion, so a failure of one
  // does not leave the other rejecting unobserved.
  const [playEvents, adEvents] = await settle([playEventsPromise, adEventsPromise]);
  return { playEvents, adEvents };
}

// Await all waits and report the first failure.
async function settle(promises: Promise<Event<PlayerEventType>[]>[]): Promise<Event<PlayerEventType>[][]> {
  const results = await Promise.all(
    promises.map((promise) =>
      promise.then(
        (events) => ({ events }),
        (error: Error) => ({ error }),
      ),
    ),
  );
  const failure = results.find((result) => 'error' in result);
  if (failure && 'error' in failure) {
    throw failure.error;
  }
  return results.map((result) => ('events' in result ? result.events : []));
}

// Tear the failed ad session down and give the native player time to release it
// before the next attempt sets a source again.
async function resetPlayer(player: THEOplayer): Promise<void> {
  player.autoplay = false;
  player.source = undefined;
  await sleep(1000);
}
