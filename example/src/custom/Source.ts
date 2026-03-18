import type { SourceDescription } from 'react-native-theoplayer';

export interface Source {
  name: string;
  os: string[];
  needsLicense: boolean;
  source: SourceDescription;
}
