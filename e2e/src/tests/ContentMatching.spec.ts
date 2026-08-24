import { Platform } from 'react-native';
import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { preparePlayerWithSource, waitForPlayerEventType } from '../utils/Actions';
import { plainSources } from '../utils/SourceUtils';
import { Log } from '../utils/Log';

export default function (spec: TestScope) {
  const platform = spec.platform();
  const sources = plainSources(platform);
  // Content matching only exists on tvOS: React Native reports 'ios' for it,
  // so the tv flag tells it apart from iOS.
  const isTvOS = platform === 'ios' && Platform.isTV;

  spec.describeIf.each(sources)(isTvOS, 'Toggle content matching during play-out of a $description', (testSource) => {
    spec.it('keeps the flag in sync with the player and continues play-out.', async () => {
      const player = await preparePlayerWithSource(spec, testSource.source);
      expect(player.manageContentMatching).toBeFalsy();

      await toggleContentMatching(player, true);
      await toggleContentMatching(player, false);
    });
  });
}

async function toggleContentMatching(player: THEOplayer, enable: boolean) {
  Log.debug(`Setting manageContentMatching to ${enable}`);
  player.manageContentMatching = enable;
  expect(player.manageContentMatching).toBe(enable);

  // A display mode switch can interrupt play-out, so verify the player keeps
  // producing time updates afterwards.
  await waitForPlayerEventType(player, PlayerEventType.TIME_UPDATE);
  expect(player.manageContentMatching).toBe(enable);
}
