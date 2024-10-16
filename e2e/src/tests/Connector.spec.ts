import { TestScope } from 'cavy';
import { applyActionAndExpectPlayerEventsInOrder, failOnPlayerError } from '../utils/Actions';
import hls from '../res/hls.json';
import { ConvivaConnector } from '@theoplayer/react-native-analytics-conviva';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { NielsenConnector } from '@theoplayer/react-native-analytics-nielsen';
import { AdobeConnector } from '@theoplayer/react-native-analytics-adobe';
import { ComscoreConfiguration, ComscoreConnector, ComscoreMetadata, ComscoreUserConsent } from '@theoplayer/react-native-analytics-comscore';
import { ComscoreMediaType } from '@theoplayer/react-native-analytics-comscore/src/api/ComscoreMetadata';

type PlayerFn = (player: THEOplayer) => Promise<void> | void;
const NoOpPlayerFn: PlayerFn = (_player: THEOplayer) => {
};

function testConnector(spec: TestScope, onCreate: PlayerFn, onUseAPI: PlayerFn, onDestroy: PlayerFn) {
  spec.it('successfully creates the connector and connects to the player', async function() {
    // We are not expecting any player errors.
    await failOnPlayerError();
    await onCreate(await getTestPlayer());
  });

  spec.it('handles sourcechange, play and playing events on play-out', async function() {
    // Start autoplay and expect events.
    await applyActionAndExpectPlayerEventsInOrder(
      (player: THEOplayer) => {
        player.autoplay = true;
        player.source = hls[0];
      },
      [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING],
    );
  });

  if (onUseAPI !== NoOpPlayerFn) {
    spec.it('successfully uses connector API', async function() {
      await onUseAPI(await getTestPlayer());
    });
  }

  spec.it('successfully cleans up on destroy', async function() {
    await onDestroy(await getTestPlayer());
  });
}

export default function(spec: TestScope) {

  spec.describe(`Setup Conviva connector`, function() {
    let connector: ConvivaConnector;
    testConnector(spec,
      (player: THEOplayer) => {
        connector = new ConvivaConnector(player, {}, {
          customerKey: 'testCustomerKey',
          gatewayUrl: 'testGgatewayUrl',
        });
      },
      () => {
        connector.setContentInfo({ 'customKey': 'customValue' });
        connector.setAdInfo({ 'customKey': 'customValue' });
        connector.reportPlaybackEvent('customEvent', { 'customKey': 'customValue' });
        connector.reportPlaybackFailed('customErrorMessage');
        connector.stopAndStartNewSession({ 'customKey': 'customValue' });
      },
      () => {
        connector.destroy();
      });
  });

  spec.describe(`Setup Nielsen connector`, function() {
    let connector: NielsenConnector;
    testConnector(spec,
      (player: THEOplayer) => {
        connector = new NielsenConnector(player, 'testApiString', 'testInstanceName', {});
      },
      () => {
        connector.updateMetadata({ 'customKey': 'customValue' });
      },
      () => {
        connector.destroy();
      });
  });

  spec.describe(`Setup Adobe connector`, function() {
    let connector: AdobeConnector;
    testConnector(spec,
      (player: THEOplayer) => {
        connector = new AdobeConnector(player, 'uri', 'ecid', 'sid', 'trackingUrl');
      },
      () => {
        connector.stopAndStartNewSession({
          qoeData: { 'customKey': 'customValue' },
          customMetadata: { 'customKey': 'customValue' },
        });
      },
      () => {
        connector.destroy();
      });
  });

  spec.describe(`Setup Comscore connector`, function() {
    let connector: ComscoreConnector;
    const metadata: ComscoreMetadata = {
      mediaType: ComscoreMediaType.live,
      uniqueId: 'uniqueId',
      length: 0,
      stationTitle: 'stationTitle',
      programTitle: 'programTitle',
      episodeTitle: 'episodeTitle',
      genreName: 'genreName',
      classifyAsAudioStream: false,
    };
    const config: ComscoreConfiguration = {
      publisherId: 'publisherId',
      applicationName: 'applicationName',
      userConsent: ComscoreUserConsent.granted,
    };

    testConnector(spec,
      (player: THEOplayer) => {
        connector = new ComscoreConnector(player, metadata, config);
      },
      () => {
        connector.update(metadata);
      },
      () => {
        connector.destroy();
      });
  });
}
