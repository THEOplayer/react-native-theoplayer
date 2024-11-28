import type { THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { Omid, OmidFriendlyObstruction } from '../../../api/ads/Omid';

const NativeAdsModule = NativeModules.THEORCTAdsModule;

export class THEOplayerNativeOmid implements Omid {
  public constructor(private readonly _player: THEOplayerView) {}

  addFriendlyObstruction(obstruction: OmidFriendlyObstruction): void {
    NativeAdsModule.addFriendlyObstruction(this._player.nativeHandle, {
      view: obstruction.viewNodeHandle,
      purpose: obstruction.purpose,
      reason: obstruction.reason,
    });
  }

  removeAllFriendlyObstructions(): void {
    NativeAdsModule.removeAllFriendlyObstructions(this._player.nativeHandle);
  }
}
