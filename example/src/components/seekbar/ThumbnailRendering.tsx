// default thumbnail size (width).
import { Dimensions, View } from 'react-native';
import { filterThumbnailTracks } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { ThumbnailView } from './thumbnail/ThumbnailView';
import React, { useContext } from 'react';

export const THUMBNAIL_SIZE = 0.19 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
// carousel mode
export type ThumbnailMode = 'single' | 'carousel';
export const THUMBNAIL_MODE: ThumbnailMode = 'carousel';

export interface SeekBarPosition {
  currentProgress: number;

  currentProgressPercentage: number;

  duration: number;

  isScrubbing: boolean;

  seekBarWidth: number;
}

function renderThumbnailCarousel(seekBarPosition: SeekBarPosition) {
  const player = useContext(PlayerContext).player;
  const thumbnailTrack = filterThumbnailTracks(player.textTracks);
  if (!thumbnailTrack) {
    return;
  }
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        // TODO: Improve layout
        <View style={{ position: 'absolute', top: -(THUMBNAIL_SIZE * 0.75), left: 0, right: 0 }}>
          <ThumbnailView
            visible={seekBarPosition.isScrubbing}
            containerStyle={context.style.seekBar.thumbnail.containerCarousel}
            thumbnailStyleCurrent={[context.style.seekBar.thumbnail.currentCarousel, { borderColor: context.style.colors.primary }]}
            thumbnailStyleCarousel={context.style.seekBar.thumbnail.carousel}
            thumbnailTrack={thumbnailTrack}
            time={seekBarPosition.currentProgress}
            duration={seekBarPosition.duration}
            size={THUMBNAIL_SIZE}
            carouselCount={2}
            // Optionally scale down the thumbnails when further from currentTime.
            // carouselThumbnailScale={(index: number) => 1.0 - Math.abs(index) * 0.15}
          />
        </View>
      )}
    </PlayerContext.Consumer>
  );
}

function renderSingleThumbnail(seekBarPosition: SeekBarPosition) {
  const player = useContext(PlayerContext).player;
  const thumbnailTrack = filterThumbnailTracks(player.textTracks);
  if (!thumbnailTrack) {
    return;
  }
  return (
    <PlayerContext.Consumer>
      {(styleContext: UiContext) => (
        <View style={{ position: 'absolute', top: -(THUMBNAIL_SIZE * 0.75), left: 0, right: 0 }}>
          <ThumbnailView
            visible={seekBarPosition.isScrubbing}
            containerStyle={styleContext.style.seekBar.thumbnail.containerSingle}
            thumbnailStyleCurrent={styleContext.style.seekBar.thumbnail.currentSingle}
            thumbnailTrack={thumbnailTrack}
            duration={seekBarPosition.duration}
            time={seekBarPosition.currentProgress}
            size={THUMBNAIL_SIZE}
            showTimeLabel={false}
            offset={Math.min(
              seekBarPosition.seekBarWidth - THUMBNAIL_SIZE,
              Math.max(0, seekBarPosition.currentProgressPercentage * seekBarPosition.seekBarWidth - 0.5 * THUMBNAIL_SIZE),
            )}
          />
        </View>
      )}
    </PlayerContext.Consumer>
  );
}
