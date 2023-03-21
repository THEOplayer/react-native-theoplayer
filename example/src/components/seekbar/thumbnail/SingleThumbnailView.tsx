// default thumbnail size (width).
import { Dimensions, View } from 'react-native';
import { filterThumbnailTracks } from 'react-native-theoplayer';
import { PlayerContext } from '../../util/PlayerContext';
import { ThumbnailView } from './ThumbnailView';
import React, { useContext } from 'react';

export const THUMBNAIL_SIZE = 0.15 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

// TODO introduce additional thumbnail rendering modes.
export type ThumbnailMode = 'single' | 'carousel';
export const THUMBNAIL_MODE: ThumbnailMode = 'single';

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
  const { seekableStart, seekableEnd, currentTime, seekBarWidth } = props;
  const percentageOffset = (currentTime - seekableStart) / (seekableEnd - seekableStart);
  return (
    <View
      style={{
        position: 'absolute',
        top: -(THUMBNAIL_SIZE * 0.6),
        left: Math.max(0, Math.min(seekBarWidth - THUMBNAIL_SIZE, percentageOffset * seekBarWidth - 0.5 * THUMBNAIL_SIZE)),
        marginLeft: 10,
      }}>
      <ThumbnailView thumbnailTrack={thumbnailTrack} duration={player.duration} time={currentTime} size={THUMBNAIL_SIZE} showTimeLabel={false} />
    </View>
  );
}
