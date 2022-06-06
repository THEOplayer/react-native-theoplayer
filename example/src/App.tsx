import * as React from 'react';

import { VideoPlayer } from './components/videoplayer/VideoPlayer';
import type { PlayerConfiguration } from 'react-native-theoplayer';
import { Platform } from 'react-native';

const playerConfig: PlayerConfiguration = {
  license: Platform.select({
    android: undefined, // insert Android THEOplayer license here
    ios: undefined, // insert iOS THEOplayer license here
    web: undefined, // insert Web THEOplayer license here
  }),
  chromeless: true,
};

export default function App() {
  return <VideoPlayer config={playerConfig} />;
}
