import React from 'react';
import type { THEOplayerInternal } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';
import { AnimationController } from './AnimationController';

export interface PlayerWithStyle {
  player: THEOplayerInternal;
  style: VideoPlayerStyle;
  animation: AnimationController;
}

export const PlayerContext = React.createContext<PlayerWithStyle>({
  player: undefined as unknown as THEOplayerInternal,
  style: defaultPlayerStyle,
  animation: new AnimationController(),
});
