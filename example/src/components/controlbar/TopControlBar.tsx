import React from 'react';
import styles from '../videoplayer/VideoPlayerUI.style';
import { View } from 'react-native';

export const TopControlBar = (props: React.PropsWithChildren<unknown>) => {
  return <View style={styles.topContainer}>{props.children}</View>;
};
