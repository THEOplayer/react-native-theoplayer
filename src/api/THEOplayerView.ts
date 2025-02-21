import type { StyleProp, ViewStyle } from 'react-native';
import type { PlayerConfiguration } from './config/PlayerConfiguration';
import type { THEOplayer } from './player/THEOplayer';
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

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
   * The style applied to the optional Poster component.
   *
   * @defaultValue A style that enforces aspectRatio 16:9.
   *
   * @remarks
   * <br/> - This property only applies to iOS & Android platforms.
   */
  posterStyle?: StyleProp<ImageStyle> | undefined;

  /**
   * Callback for when the internal THEOplayer is ready.
   */
  onPlayerReady?: (player: THEOplayer) => void;

  /**
   * Callback for when the internal THEOplayer will be destroyed.
   */
  onPlayerDestroy?: (player: THEOplayer) => void;
}
