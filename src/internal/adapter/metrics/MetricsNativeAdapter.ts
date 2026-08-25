import type { MetricsAPI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeMetricsModule = NativeModules.THEORCTMetricsModule;

export class MetricsNativeAdapter implements MetricsAPI {
  constructor(private readonly _view: THEOplayerView) {}

  currentBandwidthEstimate(): Promise<number> {
    return NativeMetricsModule.currentBandwidthEstimate(this._view.nativeHandle);
  }
}
