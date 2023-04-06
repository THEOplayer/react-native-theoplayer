import { Dimensions, View } from 'react-native';
import { filterThumbnailTracks } from 'react-native-theoplayer';
import { PlayerContext } from '../../util/PlayerContext';
import { ThumbnailView } from './ThumbnailView';
import React, { useContext } from 'react';

export interface ThumbnailViewProps {
  seekableStart: number;
  seekableEnd: number;
  currentTime: number;
  seekBarWidth: number;
}

export function SingleThumbnailView(props: ThumbnailViewProps) {
  const player = useContext(PlayerContext).player;
  const thumbnailTrack = filterThumbnailTracks(player.textTracks);
  if (!thumbnailTrack) {
    return <></>;
  }
  const window = Dimensions.get('window');
  const thumbnailSize = 0.35 * Math.min(window.height, window.width);

  const { seekableStart, seekableEnd, currentTime, seekBarWidth } = props;
  const percentageOffset = (currentTime - seekableStart) / (seekableEnd - seekableStart);
  const marginHorizontal = 10;

  return (
    <View
      style={{
        position: 'absolute',
        top: -(thumbnailSize * 0.6),
        left: Math.max(0, Math.min(seekBarWidth - thumbnailSize - marginHorizontal, percentageOffset * seekBarWidth - 0.5 * thumbnailSize)),
        marginHorizontal,
      }}>
      <ThumbnailView thumbnailTrack={thumbnailTrack} duration={player.duration} time={currentTime} size={thumbnailSize} showTimeLabel={false} />
    </View>
  );
}
