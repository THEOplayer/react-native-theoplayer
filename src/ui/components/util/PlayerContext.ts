import React from 'react';
import type { THEOplayer } from 'react-native-theoplayer';
import type { THEOplayerTheme } from '../../THEOplayerTheme';
import { DEFAULT_THEOPLAYER_THEME } from '../../THEOplayerTheme';
import type { UiControls } from '../uicontroller/UiControls';

export interface UiContext {
  readonly player: THEOplayer;
  readonly style: THEOplayerTheme;
  readonly ui: UiControls;
}

export const PlayerContext = React.createContext<UiContext>({
  player: undefined as unknown as THEOplayer,
  style: DEFAULT_THEOPLAYER_THEME,
  ui: undefined as unknown as UiControls,
});
