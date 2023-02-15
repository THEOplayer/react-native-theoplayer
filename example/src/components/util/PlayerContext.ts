import React from 'react';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';
import type { UiControls } from '../uicontroller/UiControls';

export interface PlayerWithStyle {
  player: THEOplayer;
  style: VideoPlayerStyle;
  animation: UiControls;
}

export const PlayerContext = React.createContext<PlayerWithStyle>({
  player: undefined as unknown as THEOplayer,
  style: defaultPlayerStyle,
  animation: undefined as unknown as UiControls,
});
