import type { VideoQuality } from 'react-native-theoplayer';
import { findMediaTrackByUid, MediaTrack, PlayerEventType } from 'react-native-theoplayer';
import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { getVideoQualityLabel } from '../util/TrackUtils';
import { MenuButton } from './common/MenuButton';
import { SettingsSvg } from '../button/svg/SettingsSvg';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuRadioButton } from './common/MenuRadioButton';

export const SettingsMenuButton = () => {
  if (Platform.OS === 'ios') {
    return <></>;
  }
  const createMenu = () => {
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <SettingsMenuView
            videoTracks={context.player.videoTracks}
            selectedVideoTrack={context.player.selectedVideoTrack}
            targetVideoTrackQuality={context.player.targetVideoQuality}
          />
        )}
      </PlayerContext.Consumer>
    );
  };

  return <MenuButton svg={<SettingsSvg />} menuConstructor={createMenu} />;
};

export interface VideoQualityMenuState {
  videoTracks: MediaTrack[];
  selectedVideoTrack: number | undefined;
  targetVideoTrackQuality: number | number[] | undefined;
}

export class SettingsMenuView extends PureComponent<VideoQualityMenuState, VideoQualityMenuState> {
  constructor(props: VideoQualityMenuState) {
    super(props);
    this.state = {
      videoTracks: props.videoTracks,
      selectedVideoTrack: props.selectedVideoTrack,
      targetVideoTrackQuality: props.targetVideoTrackQuality,
    };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
  }

  private onTrackListChanged = () => {
    const player = (this.context as UiContext).player;
    this.setState({
      videoTracks: player.videoTracks,
      selectedVideoTrack: player.selectedVideoTrack,
      targetVideoTrackQuality: player.targetVideoQuality,
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
    let uid: number | undefined = undefined;
    if (qualityIndex !== undefined && qualityIndex > 0) {
      // The first quality in the list is "auto". The rest are selectable qualities.
      uid = qualities[qualityIndex - 1].uid;
    }
    const player = (this.context as UiContext).player;
    player.targetVideoQuality = uid;
    this.setState({ targetVideoTrackQuality: uid });
  };

  render() {
    const { videoTracks, selectedVideoTrack, targetVideoTrackQuality } = this.state;
    const availableVideoQualities = findMediaTrackByUid(videoTracks, selectedVideoTrack)?.qualities || [];
    availableVideoQualities.sort((q1, q2) => q2.bandwidth - q1.bandwidth);

    return (
      <MenuView
        menu={
          <ScrollableMenu
            title={'Video quality'}
            items={[undefined, ...availableVideoQualities].map((track, id) => (
              <MenuRadioButton
                key={id}
                label={getVideoQualityLabel(track as VideoQuality)}
                uid={id}
                onSelect={this.selectTargetVideoQuality}
                selected={
                  (track === undefined && targetVideoTrackQuality === undefined) || (track !== undefined && track.uid === targetVideoTrackQuality)
                }></MenuRadioButton>
            ))}
          />
        }
      />
    );
  }
}

SettingsMenuView.contextType = PlayerContext;