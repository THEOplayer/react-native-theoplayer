import React from 'react';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';
import { AnimationController } from './AnimationController';

export interface PlayerWithStyle {
  player: THEOplayer;
  style: VideoPlayerStyle;
  animation: AnimationController;
}

export const PlayerContext = React.createContext<PlayerWithStyle>({
  player: undefined as unknown as THEOplayer,
  style: defaultPlayerStyle,
  animation: new AnimationController(),
});
