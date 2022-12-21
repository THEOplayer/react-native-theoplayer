import React from 'react';
import type { THEOplayerInternal } from 'react-native-theoplayer';

export const PlayerContext = React.createContext<THEOplayerInternal>(undefined as unknown as THEOplayerInternal);
