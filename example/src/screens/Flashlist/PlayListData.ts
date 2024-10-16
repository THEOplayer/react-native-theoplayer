import { SourceDescription, THEOplayer } from 'react-native-theoplayer';
import { Source } from '../../custom/Source';
import { SOURCES } from '../../custom/SourceMenuButton';

export interface PlayListData {
  index: number;
  name: string;
  source: SourceDescription;
  bookmark: number;
  playerRef: THEOplayer | undefined;
  playerId: number;
  viewable: boolean;
}

export function generateMockPlaylist(n: number): PlayListData[] {
  const entries = new Array(n);
  const flashlistSources: Source[] = (SOURCES as Source[]).filter((source) => source.name.startsWith('HLS - VOD - CLEAR'));
  for (let i = 0; i < n; i++) {
    const source: Source = flashlistSources[i % flashlistSources.length];
    entries[i] = {
      index: i,
      name: source.name,
      bookmark: 0,
      source: source.source,
      playerId: -1,
      playerRef: undefined,
      viewable: false,
    };
  }
  return entries;
}

export class PlayerIdGenerator {
  private static current = -1;
  static generate = () => {
    PlayerIdGenerator.current++;
    return PlayerIdGenerator.current;
  };
}
