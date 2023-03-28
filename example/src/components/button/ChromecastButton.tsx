import type { CastState } from 'react-native-theoplayer';

export function isConnected(state: CastState | undefined): boolean {
  return state === 'connecting' || state === 'connected';
}
