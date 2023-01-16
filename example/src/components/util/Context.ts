import React from 'react';
import type { THEOplayerInternal } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';

export interface PlayerWithStyle {
  player: THEOplayerInternal;
  style: VideoPlayerStyle;
}

export const PlayerContext = React.createContext<PlayerWithStyle>({ player: undefined as unknown as THEOplayerInternal, style: defaultPlayerStyle });
