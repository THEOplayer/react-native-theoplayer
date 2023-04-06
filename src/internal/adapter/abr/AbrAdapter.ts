import type { ABRConfiguration, ABRStrategy, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class AbrAdapter implements ABRConfiguration {
  private readonly _view: THEOplayerView;
  private _strategy: ABRStrategy | undefined;
  private _targetBuffer: number | undefined;

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

  private updateConfig() {
    NativeModules.PlayerModule.setABRConfig(this._view.nativeHandle, {
      targetBuffer: this._targetBuffer,
      strategy: this._strategy,
    });
  }
}
