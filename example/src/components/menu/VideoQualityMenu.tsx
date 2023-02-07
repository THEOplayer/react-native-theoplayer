import { MenuItem } from './modalmenu/MenuItem';
import type { VideoQuality } from 'react-native-theoplayer';
import { findMediaTrackByUid, MediaTrack, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { MenuButton } from './menubutton/MenuButton';
import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { PlayerContext } from '../util/PlayerContext';
import { SettingsSvg } from '../button/svg/SettingsSvg';

export interface VideoQualityMenuState {
  videoTracks: MediaTrack[];
  selectedVideoTrack: number | undefined;
  targetVideoTrackQuality: number | number[] | undefined;
}

function getQualityLabel(quality: VideoQuality | undefined): string {
  if (!quality) {
    return 'auto';
  }
  if (quality.label && quality.label !== '') {
    return quality.label;
  }
  let label = '';
  if (quality.height) {
    label = quality.height + 'p';
  }
  if (!quality.bandwidth) {
    return label;
  }
  let bandwidth;
  if (quality.bandwidth > 1e7) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(0) + 'Mbps';
  } else if (quality.bandwidth > 1e6) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(1) + 'Mbps';
  } else {
    bandwidth = (quality.bandwidth / 1e3).toFixed(0) + 'kbps';
  }
  const isHD = quality.height ? quality.height >= 720 : false;
  return `${label} - ${bandwidth} ${isHD ? '(HD)' : ''}`;
}

export class VideoQualityMenu extends PureComponent<unknown, VideoQualityMenuState> {
  constructor(props: unknown) {
    super(props);
    this.state = { videoTracks: [], selectedVideoTrack: undefined, targetVideoTrackQuality: undefined };
  }

  componentDidMount() {
    const player = this.context.player as THEOplayer;
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
  }

  componentWillUnmount() {
    const player = this.context.player as THEOplayer;
    player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
  }

  private onTrackListChanged = () => {
    const player = this.context.player as THEOplayer;
    this.setState({
      videoTracks: player.videoTracks,
      selectedVideoTrack: player.selectedVideoTrack,
    });
  };

  private selectTargetVideoQuality = (qualityIndex: number | undefined) => {
    const { videoTracks, selectedVideoTrack } = this.state;
    if (!videoTracks || !selectedVideoTrack) {
      return;
    }
    const videoTrack = videoTracks.find((track) => track.uid === selectedVideoTrack);
    const qualities = videoTrack?.qualities;
    if (!qualities) {
      return;
    }
    let uid: number | number[] | undefined = undefined;
    if (qualityIndex && qualityIndex >= 0 && qualityIndex < qualities.length) {
      uid = qualities[qualityIndex].uid;
      console.log('found index', uid);
    }
    const player = this.context.player as THEOplayer;
    player.targetVideoQuality = uid;
    this.setState({ targetVideoTrackQuality: uid });
  };

  render() {
    const { videoTracks, selectedVideoTrack, targetVideoTrackQuality } = this.state;

    // Quality selection is not available on iOS.
    if (Platform.OS === 'ios') {
      return <></>;
    }

    const availableVideoQualities = findMediaTrackByUid(videoTracks, selectedVideoTrack)?.qualities || [];
    availableVideoQualities.sort((q1, q2) => q2.bandwidth - q1.bandwidth);

    if (!availableVideoQualities || availableVideoQualities.length === 0) {
      return <></>;
    }

    return (
      <MenuButton
        title={'Quality'}
        svg={<SettingsSvg />}
        data={[...availableVideoQualities, undefined].map((q) => new MenuItem(getQualityLabel(q as VideoQuality))).sort()}
        onItemSelected={this.selectTargetVideoQuality}
        minimumItems={3}
        selectedItem={
          targetVideoTrackQuality !== undefined
            ? availableVideoQualities.findIndex((quality) => quality.uid === targetVideoTrackQuality)
            : availableVideoQualities.length
        }
        keyExtractor={(index: number) => `vq${index}`}
      />
    );
  }
}

VideoQualityMenu.contextType = PlayerContext;
