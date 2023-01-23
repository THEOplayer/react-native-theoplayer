import type { ABRConfiguration, ABRStrategy, THEOplayerView } from 'react-native-theoplayer';

export class AbrAdapter implements ABRConfiguration {
  private readonly _view: THEOplayerView;

  constructor(view: THEOplayerView) {
    this._view = view;
  }

  get strategy(): ABRStrategy | undefined {
    return this._view.state.abrConfig?.strategy;
  }

  set strategy(strategy: ABRStrategy | undefined) {
    this._view.setState({ abrConfig: { ...this._view.state.abrConfig, strategy } });
  }

  get targetBuffer(): number | undefined {
    return this._view.state.abrConfig?.targetBuffer;
  }

  set targetBuffer(targetBuffer: number | undefined) {
    this._view.setState({ abrConfig: { ...this._view.state.abrConfig, targetBuffer } });
  }
}
