import { TestScope } from 'cavy';
import { AdDescription, PlayerEventType, SourceDescription, THEOplayer } from 'react-native-theoplayer';
import { applyActionAndExpectPlayerEvents, failOnPlayerError } from '../utils/Actions';
import hls from '../res/hls.json';
import ads from '../res/ads.json';

function extendSourceWithAds(source: SourceDescription, ad: AdDescription): SourceDescription {
  return { ...source, ads: [ad] };
}

export default function (spec: TestScope) {
  spec.describe('Set source with ads and auto-play', function () {
    spec.it('dispatches sourcechange, play, playing and ad events', async function () {
      // We are not epecting any player errors.
      await failOnPlayerError();

      // Start autoplay and expect events.
      await applyActionAndExpectPlayerEvents(
        (player: THEOplayer) => {
          player.autoplay = true;
          player.source = extendSourceWithAds(hls[0], ads[0] as AdDescription);
        },
        [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING, PlayerEventType.AD_EVENT],
      );
    });
  });
}
