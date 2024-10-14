import { TestScope } from 'cavy';
import { Platform } from 'react-native';
import { PlayerEventType, SourceDescription, THEOplayer } from 'react-native-theoplayer';
import { applyActionAndExpectPlayerEventsInOrder, failOnPlayerError } from '../utils/Actions';
import dash from '../res/dash.json';
import hls from '../res/hls.json';
import mp4 from '../res/mp4.json';

function testBasicPlayout(spec: TestScope, title: string, source: SourceDescription, autoplay: boolean) {
  spec.describe(title, function() {
    spec.it('dispatches sourcechange, play and playing in order', async function() {
      // We are not epecting any player errors.
      await failOnPlayerError();

      // Start autoplay and expect events.
      await applyActionAndExpectPlayerEventsInOrder(
        (player: THEOplayer) => {
          player.autoplay = autoplay;
          player.source = source;
        },
        [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING],
      );
    });
  });
}

export default function(spec: TestScope) {
  if (Platform.OS === 'android' || Platform.OS === 'web') {
    testBasicPlayout(spec, 'Set DASH source and auto-play', dash[0], true);
  }
  testBasicPlayout(spec, 'Set HLS source and auto-play', hls[0], true);
  testBasicPlayout(spec, 'Set mp4 source and auto-play', mp4[0], true);
}
