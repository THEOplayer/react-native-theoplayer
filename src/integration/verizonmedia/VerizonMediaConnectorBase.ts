import type { SourceDescription } from 'react-native-theoplayer';
import type { VerizonMediaPreplayResponse } from './source/VerizonMediaPreplayResponse';

export interface VerizonMediaConnectorBase {
  setSource(source: SourceDescription): void;

  setOnSourceReadyListener(listener: (source: SourceDescription) => void): void;

  setOnPreplayResponseListener(listener: (response: VerizonMediaPreplayResponse) => void): void;
}
