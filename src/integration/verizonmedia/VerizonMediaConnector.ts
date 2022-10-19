import type { Source, SourceDescription } from 'react-native-theoplayer';
import { VerizonMediaSourceTransformer } from './VerizonMediaSourceTransformer';
import type { VerizonMediaConnectorBase } from './VerizonMediaConnectorBase';
import { isArray } from '../../internal/utils/TypeUtils';
import type { VerizonMediaPreplayResponse } from './source/VerizonMediaPreplayResponse';
import type { VerizonMediaSource } from './source/VerizonMediaSource';

export class VerizonMediaConnector implements VerizonMediaConnectorBase {
  private _verizonMediaSourceTransformer: VerizonMediaSourceTransformer;
  private _sourceReadyListener: ((source: SourceDescription) => void) | undefined = undefined;
  private _onPreplayResponseListener: ((response: VerizonMediaPreplayResponse) => void) | undefined = undefined;

  constructor() {
    this._verizonMediaSourceTransformer = new VerizonMediaSourceTransformer();
  }

  setSource(sourceDescription: SourceDescription): void {
    void this.internalSetSource(sourceDescription);
  }

  private async internalSetSource(sourceDescription: SourceDescription): Promise<void> {
    if (sourceDescription.sources === undefined) {
      return;
    }
    const sources: Source[] = [];
    const allSources = isArray(sourceDescription.sources) ? sourceDescription.sources : [sourceDescription.sources];

    for (const source of allSources) {
      if (isVerizonMediaSource(source)) {
        const verizonMediaSourceTransformerResponse = await this._verizonMediaSourceTransformer.transform_(source);
        if (verizonMediaSourceTransformerResponse) {
          if (this._onPreplayResponseListener && verizonMediaSourceTransformerResponse.preplayResponse) {
            this._onPreplayResponseListener(verizonMediaSourceTransformerResponse.preplayResponse);
          }
          sources.push(verizonMediaSourceTransformerResponse.source);
        }
      } else {
        sources.push(source);
      }
    }
    const newSourceDescription: SourceDescription = { ...sourceDescription, sources };
    if (this._sourceReadyListener) {
      this._sourceReadyListener(newSourceDescription);
    }
  }

  setOnSourceReadyListener(listener: (source: SourceDescription) => void): void {
    this._sourceReadyListener = listener;
  }

  setOnPreplayResponseListener(listener: (response: VerizonMediaPreplayResponse) => void): void {
    this._onPreplayResponseListener = listener;
  }
}

function isVerizonMediaSource(source: Source): source is VerizonMediaSource {
  return source.integration === 'verizon-media';
}
