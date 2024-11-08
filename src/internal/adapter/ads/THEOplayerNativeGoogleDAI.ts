import type { GoogleDAI, THEOplayerView } from 'react-native-theoplayer';
import { getNativeModule } from '../../utils/ModuleUtils';

const NativeAdsModule = getNativeModule('Ads');

export class THEOplayerNativeGoogleDAI implements GoogleDAI {
  public constructor(private readonly _player: THEOplayerView) {}

  get snapback(): Promise<boolean> {
    return NativeAdsModule.daiSnapback(this._player.nativeHandle);
  }

  setSnapback(enabled: boolean): void {
    NativeAdsModule.daiSetSnapback(this._player.nativeHandle, enabled);
  }

  contentTimeForStreamTime(time: number): Promise<number> {
    return NativeAdsModule.daiContentTimeForStreamTime(this._player.nativeHandle, time);
  }

  streamTimeForContentTime(time: number): Promise<number> {
    return NativeAdsModule.daiStreamTimeForContentTime(this._player.nativeHandle, time);
  }
}
