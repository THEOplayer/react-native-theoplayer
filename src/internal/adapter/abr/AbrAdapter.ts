import type { ABRConfiguration, ABRStrategy, Resolution, THEOplayerView } from 'react-native-theoplayer';
import { getNativeModule } from '../../utils/ModuleUtils';

const NativePlayerModule = getNativeModule('Player');

export class AbrAdapter implements ABRConfiguration {
  private readonly _view: THEOplayerView;
  private _strategy: ABRStrategy | undefined;
  private _targetBuffer: number | undefined;
  private _preferredPeakBitRate: number | undefined;
  private _preferredMaximumResolution: Resolution | undefined;

  constructor(view: THEOplayerView) {
    this._view = view;
  }

  get strategy(): ABRStrategy | undefined {
    return this._strategy;
  }

  set strategy(strategy: ABRStrategy | undefined) {
    this._strategy = strategy;
    this.updateConfig();
  }

  get targetBuffer(): number | undefined {
    return this._targetBuffer;
  }

  set targetBuffer(targetBuffer: number | undefined) {
    this._targetBuffer = targetBuffer;
    this.updateConfig();
  }

  get preferredPeakBitRate(): number | undefined {
    return this._preferredPeakBitRate;
  }

  set preferredPeakBitRate(preferredPeakBitRate: number | undefined) {
    this._preferredPeakBitRate = preferredPeakBitRate;
    this.updateConfig();
  }

  get preferredMaximumResolution(): Resolution | undefined {
    return this._preferredMaximumResolution;
  }

  set preferredMaximumResolution(preferredMaximumResolution: Resolution | undefined) {
    this._preferredMaximumResolution = preferredMaximumResolution;
    this.updateConfig();
  }

  private updateConfig() {
    NativePlayerModule.setABRConfig(this._view.nativeHandle, {
      targetBuffer: this._targetBuffer,
      strategy: this._strategy,
      preferredPeakBitRate: this._preferredPeakBitRate,
      preferredMaximumResolution: this._preferredMaximumResolution,
    });
  }
}
