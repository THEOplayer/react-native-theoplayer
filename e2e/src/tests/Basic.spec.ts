import { TestScope } from 'cavy';
import { Platform } from 'react-native';
import { PlayerEventType, SourceDescription } from 'react-native-theoplayer';
import dash from '../res/dash.json';
import hls from '../res/hls.json';
import mp4 from '../res/mp4.json';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { expect, waitForPlayerEventType, waitForPlayerEventTypes } from '../utils/Actions';

function testBasicPlayout(spec: TestScope, title: string, source: SourceDescription, autoplay: boolean) {
  spec.describe(title, function () {
    spec.it('dispatches sourcechange, play and playing in order', async function () {
      const player = await getTestPlayer();
      const eventsPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

      // Start autoplay
      player.autoplay = autoplay;
      player.source = source;

      // Expect events.
      await eventsPromise;

      // Still playing
      expect(player.paused).toBeFalsy();

      // Seek
      const seekPromise = waitForPlayerEventType(player, PlayerEventType.SEEKED);
      player.currentTime = 10e3;
      await seekPromise;
    });
  });
}

export default function (spec: TestScope) {
  if (Platform.OS === 'android' || Platform.OS === 'web') {
    testBasicPlayout(spec, 'Set DASH source and auto-play', dash[0], true);
  }
  testBasicPlayout(spec, 'Set HLS source and auto-play', hls[0], true);
  testBasicPlayout(spec, 'Set mp4 source and auto-play', mp4[0], true);
}
