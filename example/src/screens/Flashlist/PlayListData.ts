import { SourceDescription, THEOplayer } from 'react-native-theoplayer';

export interface PlayListData {
  index: number;
  name: string;
  source: SourceDescription;
  bookmark: number;
  playerRef: THEOplayer | undefined;
  playerId: number;
  viewable: boolean;
}
