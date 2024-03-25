import * as React from 'react';
import {THEOplayer} from "react-native-theoplayer";
import {useFocusEffect} from "@react-navigation/native";
import {useRef} from "react";

const LOG_TAG = "[EXAMPLE - USEPLAYERFOCUS]";

export const usePlayerFocus = (player: THEOplayer | undefined) => {
  const wasPlaying = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (player !== undefined && wasPlaying.current) {
        console.log(LOG_TAG, 'FOCUS: player.play');
        player.play();
      }

      return () => {
        if (player !== undefined && !player.paused) {
          wasPlaying.current = true;
          console.log(LOG_TAG, 'UNFOCUS: player.pause');
          player.pause();
        }
      };

    }, [player])
  );
};
