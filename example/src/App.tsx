import * as React from 'react';

import { VideoPlayer } from './components/videoplayer/VideoPlayer';
import type { PlayerConfiguration } from 'react-native-theoplayer';

const playerConfig: PlayerConfiguration = {
  license: undefined, // Get your THEOplayer license from https://portal.theoplayer.com/
  chromeless: true,
  cast: {
    chromecast: {
      appID: 'CC1AD845'
    },
    strategy: 'auto'
  }
};

export default function App() {
  return <VideoPlayer config={playerConfig} />;
}
