import { THEOplayer } from 'react-native-theoplayer';

export function logPlayerBuffer(player: THEOplayer): string {
  let buffer = '[ ';
  for (let i = 0; i < player.buffered.length; i++) {
    buffer += `${player.buffered[i].start} - ${player.buffered[i].end} ${i === player.buffered.length - 1 ? '' : ', '}`;
  }
  buffer += ']';
  return buffer;
}
