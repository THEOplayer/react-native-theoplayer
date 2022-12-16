import type { StyleProp, ViewStyle } from 'react-native';
import type { PlayerConfiguration } from './config/PlayerConfiguration';
import type { THEOplayerInternal } from './player/THEOplayerInternal';

export interface THEOplayerViewProps {
  /**
   * The player configuration with THEOplayer license.
   */
  config?: PlayerConfiguration;

  /**
   * The style applied to the player view.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Callback for when the internal THEOplayer is ready.
   */
  onReady?: (player: THEOplayerInternal) => void;
}
