import React from 'react';
import styles from '../videoplayer/VideoPlayerUI.style';
import { Platform, View } from 'react-native';

export const TopControlBar = (props: React.PropsWithChildren<unknown>) => {
  if (Platform.isTV) {
    return <></>;
  }
  return <View style={styles.topContainer}>{props.children}</View>;
};
