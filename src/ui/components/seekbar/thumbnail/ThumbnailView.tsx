import React, { PureComponent } from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import type { TextTrackCue } from 'react-native-theoplayer';
import { isThumbnailTrack, TextTrack } from 'react-native-theoplayer';
import type { Thumbnail } from './Thumbnail';
import { isTileMapThumbnail } from './Thumbnail';
import { URL as URLPolyfill } from 'react-native-url-polyfill';
import { StaticTimeLabel } from '../../timelabel/StaticTimeLabel';

const SPRITE_REGEX = /^([^#]*)#xywh=(\d+),(\d+),(\d+),(\d+)\s*$/;
const TAG = 'ThumbnailView';

interface ThumbnailViewState {
  imageWidth: number;
  imageHeight: number;
  renderWidth: number;
  renderHeight: number;
}

export interface ThumbnailViewProps {
  /**
   * Thumbnail track. A valid thumbnail track should have properties:
   * <br/> - `'kind'` equals `'metadata'`.
   * <br/> - `'label'` equals `'thumbnails'`.
   */
  thumbnailTrack: TextTrack;

  /**
   * Current time.
   */
  time: number;

  /**
   * Stream duration
   */
  duration: number;

  /**
   * Whether to show a time label.
   */
  showTimeLabel: boolean;

  /**
   * Used to set the width of the rendered thumbnail. The height will be calculated according to the image's aspect ratio.
   */
  size: number;

  /**
   * Optional style applied to the time label.
   */
  timeLabelStyle?: StyleProp<ViewStyle>;
}

export const DEFAULT_THUMBNAIL_VIEW_STYLE: ThumbnailStyle = {
  containerThumbnail: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  thumbnail: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
};

export interface ThumbnailStyle {
  containerThumbnail: ViewStyle;
  thumbnail: ViewStyle;
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

  private renderThumbnail = (thumbnail: Thumbnail, index: number) => {
    const { imageWidth, imageHeight, renderWidth, renderHeight } = this.state;
    const { size } = this.props;
    const scale = 1.0;

    if (isTileMapThumbnail(thumbnail)) {
      const ratio = thumbnail.tileWidth == 0 ? 0 : (scale * size) / thumbnail.tileWidth;
      return (
        <View key={index} style={[DEFAULT_THUMBNAIL_VIEW_STYLE.thumbnail, { width: scale * renderWidth, height: scale * renderHeight }]}>
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
      );
    } else {
      return (
        <View key={index} style={[DEFAULT_THUMBNAIL_VIEW_STYLE.thumbnail, { width: scale * renderWidth, height: scale * renderHeight }]}>
          <Image
            resizeMode={'contain'}
            style={{ width: scale * size, height: scale * renderHeight }}
            source={{ uri: thumbnail.url }}
            onError={this.onImageLoadError}
            onLoad={this.onImageLoad(thumbnail)}
          />
        </View>
      );
    }
  };

  render() {
    const { time, duration, thumbnailTrack, showTimeLabel, timeLabelStyle } = this.props;
    if (!thumbnailTrack || !thumbnailTrack.cues || thumbnailTrack.cues.length === 0) {
      // No thumbnails to render.
      return <></>;
    }

    const nowCueIndex = this.getCueIndexAtTime(time);
    if (nowCueIndex === undefined) {
      // No thumbnail for current time
      return <></>;
    }

    const current = this.getThumbnailImageForCue(thumbnailTrack.cues[nowCueIndex]);
    if (current === null) {
      // No thumbnail for current time
      return <></>;
    }
    const { renderHeight } = this.state;
    return (
      <View style={{ flexDirection: 'column' }}>
        {showTimeLabel && (
          <StaticTimeLabel
            style={[
              {
                marginLeft: 20,
                height: 20,
                alignSelf: 'center',
              },
              timeLabelStyle,
            ]}
            time={time}
            duration={duration}
            showDuration={false}
          />
        )}
        <View style={[DEFAULT_THUMBNAIL_VIEW_STYLE.containerThumbnail, { height: renderHeight }]}>{this.renderThumbnail(current, 0)}</View>
      </View>
    );
  }
}
