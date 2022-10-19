import type { Source } from 'react-native-theoplayer';
import { VerizonMediaPreplayClient } from './VerizonMediaPreplayClient';
import type { VerizonMediaSource } from './source/VerizonMediaSource';
import type { VerizonMediaPreplayResponse } from './source/VerizonMediaPreplayResponse';

export type VerizonMediaSourceTransformerResponse = { source: Source; preplayResponse: VerizonMediaPreplayResponse };

export class VerizonMediaSourceTransformer {
  private _preplayClient: VerizonMediaPreplayClient;

  constructor() {
    this._preplayClient = new VerizonMediaPreplayClient();
  }

  async transform_(source: VerizonMediaSource): Promise<VerizonMediaSourceTransformerResponse | undefined> {
    try {
      const preplayResponse = await this._preplayClient.fetch_(source);

      const transformedSource: Source = {
        src: preplayResponse.playURL,
        timeServer: source.timeServer,
        lowLatency: source.lowLatency,
        dash: source.dash,
        hls: source.hls,
        integration: source.integration,
      };

      return { source: transformedSource, preplayResponse };
    } catch (error) {
      console.warn('Unable to transform Verizon Media source', error);
      return undefined;
    }
  }
}
