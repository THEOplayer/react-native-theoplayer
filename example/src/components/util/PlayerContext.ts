import React from 'react';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';
import type { UiControls } from '../uicontroller/UiControls';

export interface UiContext {
  readonly player: THEOplayer;
  readonly style: VideoPlayerStyle;
  readonly ui: UiControls;
}

export const PlayerContext = React.createContext<UiContext>({
  player: undefined as unknown as THEOplayer,
  style: defaultPlayerStyle,
  ui: undefined as unknown as UiControls,
});
