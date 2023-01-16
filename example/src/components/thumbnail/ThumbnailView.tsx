import React, { PureComponent } from 'react';
import { Image, View } from 'react-native';
import type { TextTrackCue } from 'react-native-theoplayer';
import { isThumbnailTrack } from 'react-native-theoplayer';
import type { ThumbnailViewProps } from './ThumbnailViewProps';
import type { Thumbnail } from './Thumbnail';
import { isTileMapThumbnail } from './Thumbnail';
import { URL as URLPolyfill } from 'react-native-url-polyfill';
import { TimeLabel } from '../timelabel/TimeLabel';
import { PlayerContext, PlayerWithStyle } from '../util/Context';

const SPRITE_REGEX = /^([^#]*)#xywh=(\d+),(\d+),(\d+),(\d+)\s*$/;
const TAG = 'ThumbnailView';

interface ThumbnailViewState {
  imageWidth: number;
  imageHeight: number;
  renderWidth: number;
  renderHeight: number;
}

export class ThumbnailView extends PureComponent<ThumbnailViewProps, ThumbnailViewState> {
  static defaultProps = {
    showTimeLabel: true,
  };

  constructor(props: ThumbnailViewProps) {
    super(props);
    const { size } = props;
    this.state = { imageWidth: size, imageHeight: size, renderWidth: size, renderHeight: 1 };
  }

  private getCueIndexAtTime(time: number): number | undefined {
    const { thumbnailTrack } = this.props;

    // Ignore if it's an invalid track or not a thumbnail track.
    if (!isThumbnailTrack(thumbnailTrack)) {
      console.warn(TAG, 'Invalid thumbnail track');
      return undefined;
    }

    // Ignore if the track does not have cues
    if (thumbnailTrack.cues == null || thumbnailTrack.cues.length == 0) {
      return undefined;
    }

    const cues = thumbnailTrack.cues;
    let cueIndex = 0;
    for (const [index, cue] of cues.entries()) {
      if (cue.startTime <= time) {
        cueIndex = index;
      } else if (time >= cue.endTime) {
        return cueIndex;
      }
    }
    return cueIndex;
  }

  private resolveThumbnailUrl(thumbnail: string): string {
    const { thumbnailTrack } = this.props;
    // NOTE: TextTrack.src is supported in Android SDK as of 3.5+
    if (thumbnailTrack && thumbnailTrack.src) {
      return new URLPolyfill(thumbnail, thumbnailTrack.src).href;
    } else {
      return thumbnail;
    }
  }

  private getThumbnailImageForCue(cue: TextTrackCue): Thumbnail | null {
    const thumbnailContent = cue && cue.content;
    if (!thumbnailContent) {
      // Cue does not contain any thumbnail info.
      return null;
    }
    const spriteMatch = thumbnailContent.match(SPRITE_REGEX);
    if (spriteMatch) {
      // The thumbnail is part of a tile.
      const [, url, x, y, w, h] = spriteMatch;
      return {
        tileX: +x,
        tileY: +y,
        tileWidth: +w,
        tileHeight: +h,
        url: this.resolveThumbnailUrl(url),
      };
    } else {
      // The thumbnail is a separate image.
      return {
        url: this.resolveThumbnailUrl(thumbnailContent),
      };
    }
  }

  private onTileImageLoad = (thumbnail: Thumbnail) => () => {
    const { size } = this.props;
    const { tileWidth, tileHeight } = thumbnail;
    if (tileWidth && tileHeight) {
      Image.getSize(thumbnail.url, (width: number, height: number) => {
        this.setState({
          imageWidth: width,
          imageHeight: height,
          renderWidth: size,
          renderHeight: (tileHeight * size) / tileWidth,
        });
      });
    }
  };

  private onImageLoadError = (event: any) => {
    console.error(TAG, 'Failed to load thumbnail url:', event.nativeEvent.error);
  };

  private onImageLoad = (thumbnail: Thumbnail) => () => {
    const { size } = this.props;
    Image.getSize(thumbnail.url, (width: number, height: number) => {
      this.setState({
        imageWidth: width,
        imageHeight: height,
        renderWidth: size,
        renderHeight: (height * size) / width,
      });
    });
  };

  private renderPlaceHolderThumbnail = (index: number) => {
    const { size, thumbnailStyleCurrent, thumbnailStyleCarousel } = this.props;
    const style = index === 0 ? thumbnailStyleCurrent : thumbnailStyleCarousel;
    return (
      <PlayerContext.Consumer>
        {(context: PlayerWithStyle) => <View key={`th${index}`} style={[context.style.videoPlayer.thumbnail, { width: size, height: 1 }, style]} />}
      </PlayerContext.Consumer>
    );
  };

  private renderThumbnail = (thumbnail: Thumbnail, index: number) => {
    const { imageWidth, imageHeight, renderWidth, renderHeight } = this.state;
    const { size, carouselThumbnailScale, thumbnailStyleCurrent, thumbnailStyleCarousel } = this.props;
    const scale = carouselThumbnailScale ? carouselThumbnailScale(index) : 1.0;
    const style = index === 0 ? thumbnailStyleCurrent : thumbnailStyleCarousel;

    if (isTileMapThumbnail(thumbnail)) {
      const ratio = thumbnail.tileWidth == 0 ? 0 : (scale * size) / thumbnail.tileWidth;
      return (
        <PlayerContext.Consumer>
          {(context: PlayerWithStyle) => (
            <View
              key={`th${index}`}
              style={[context.style.videoPlayer.thumbnail, { width: scale * renderWidth, height: scale * renderHeight }, style]}>
              <Image
                resizeMode={'cover'}
                style={{
                  position: 'absolute',
                  top: -ratio * thumbnail.tileY,
                  left: -ratio * thumbnail.tileX,
                  width: ratio * imageWidth,
                  height: ratio * imageHeight,
                }}
                source={{ uri: thumbnail.url }}
                onError={this.onImageLoadError}
                onLoad={this.onTileImageLoad(thumbnail)}
              />
            </View>
          )}
        </PlayerContext.Consumer>
      );
    } else {
      return (
        <PlayerContext.Consumer>
          {(context: PlayerWithStyle) => (
            <View
              key={`th${index}`}
              style={[context.style.videoPlayer.thumbnail, { width: scale * renderWidth, height: scale * renderHeight }, style]}>
              <Image
                resizeMode={'contain'}
                style={{ width: scale * size, height: scale * renderHeight }}
                source={{ uri: thumbnail.url }}
                onError={this.onImageLoadError}
                onLoad={this.onImageLoad(thumbnail)}
              />
            </View>
          )}
        </PlayerContext.Consumer>
      );
    }
  };

  render() {
    const { time, duration, thumbnailTrack, carouselCount, offset, containerStyle, visible, showTimeLabel, timeLabelStyle } = this.props;
    if (!visible || !thumbnailTrack || !thumbnailTrack.cues || thumbnailTrack.cues.length === 0) {
      // No thumbnails to render.
      return <></>;
    }

    const nowCueIndex = this.getCueIndexAtTime(time);
    if (nowCueIndex === undefined) {
      // No thumbnail for current time
      return <></>;
    }

    const carouselThumbCount = carouselCount ?? 0;
    const before = [];
    const after = [];
    for (let i = 0; i < carouselThumbCount; i++) {
      const beforeIndex = nowCueIndex - carouselThumbCount + i;
      before.push(beforeIndex >= 0 ? this.getThumbnailImageForCue(thumbnailTrack.cues[beforeIndex]) : null);
      const afterIndex = nowCueIndex + i + 1;
      after.push(afterIndex < thumbnailTrack.cues.length ? this.getThumbnailImageForCue(thumbnailTrack.cues[afterIndex]) : null);
    }
    const current = this.getThumbnailImageForCue(thumbnailTrack.cues[nowCueIndex]);
    const { renderHeight } = this.state;
    return (
      <PlayerContext.Consumer>
        {(context: PlayerWithStyle) => (
          <View style={{ flexDirection: 'column' }}>
            {showTimeLabel && (
              <TimeLabel
                style={[context.style.videoPlayer.timeLabelContainer, timeLabelStyle]}
                currentTime={time}
                duration={duration}
                showDuration={false}
                isLive={false}
              />
            )}
            <View style={[context.style.videoPlayer.containerThumbnail, { height: renderHeight, marginLeft: offset ?? 0 }, containerStyle]}>
              {[...before, current, ...after].map((thumbnail, index) => {
                return thumbnail
                  ? this.renderThumbnail(thumbnail, carouselThumbCount - index)
                  : this.renderPlaceHolderThumbnail(carouselThumbCount - index);
              })}
            </View>
          </View>
        )}
      </PlayerContext.Consumer>
    );
  }
}
