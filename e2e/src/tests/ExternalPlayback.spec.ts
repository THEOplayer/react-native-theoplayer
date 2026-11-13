import { NativeModules } from 'react-native';
import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { getTestPlayer, preparePlayerWithSource, waitForPlayerEventType } from '../utils/Actions';
import { plainSources } from '../utils/SourceUtils';

const nativeAllowsExternalPlayback = (player: THEOplayer): Promise<boolean> =>
  NativeModules.THEORCTPlayerModule.getAllowsExternalPlayback(player.nativeHandle);

export default function (spec: TestScope) {
  const platform = spec.platform();

  spec.describeIf.each(plainSources(platform))(platform === 'ios', 'External playback with a $description', (testSource) => {
    spec.it('preserves the flag when setting a source and applies changes during playback.', async () => {
      const player = await getTestPlayer(spec);
      expect(player.allowsExternalPlayback).toBeTruthy();
      expect(await nativeAllowsExternalPlayback(player)).toBeTruthy();

      await toggleExternalPlayback(player, false);
      await preparePlayerWithSource(spec, testSource.source);
      expect(player.allowsExternalPlayback).toBeFalsy();
      expect(await nativeAllowsExternalPlayback(player)).toBeFalsy();

      for (const enable of [true, false]) {
        await toggleExternalPlayback(player, enable);
        await waitForPlayerEventType(player, PlayerEventType.TIME_UPDATE);
        expect(await nativeAllowsExternalPlayback(player)).toBe(enable);
      }
    });
  });

  spec.describeIf(platform !== 'ios', 'External playback on unsupported platforms', () => {
    spec.it('ignores assignments and returns the default value.', async () => {
      const player = await getTestPlayer(spec);
      expect(player.allowsExternalPlayback).toBeTruthy();
      player.allowsExternalPlayback = false;
      expect(player.allowsExternalPlayback).toBeTruthy();
      player.allowsExternalPlayback = true;
      expect(player.allowsExternalPlayback).toBeTruthy();
    });
  });
}

async function toggleExternalPlayback(player: THEOplayer, enable: boolean) {
  player.allowsExternalPlayback = enable;
  expect(player.allowsExternalPlayback).toBe(enable);
  expect(await nativeAllowsExternalPlayback(player)).toBe(enable);
}
