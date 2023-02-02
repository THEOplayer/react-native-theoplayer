import { MenuButton } from './menubutton/MenuButton';
import { AudioIcon } from '../../res/images';
import { MenuItem } from './modalmenu/MenuItem';
import React, { PureComponent } from 'react';
import type { MediaTrack } from 'react-native-theoplayer';
import { LoadedMetadataEvent, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { getTrackLabel } from './TrackUtils';
import { PlayerContext } from '../util/PlayerContext';

export interface AudioQualityMenuState {
  audioTracks: MediaTrack[];
  selectedAudioTrack: number | undefined;
}

export class AudioTrackMenu extends PureComponent<unknown, AudioQualityMenuState> {
  constructor(props: unknown) {
    super(props);
    this.state = { audioTracks: [], selectedAudioTrack: undefined };
  }

  componentDidMount() {
    const player = this.context.player as THEOplayer;
    player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
  }

  componentWillUnmount() {
    const player = this.context.player as THEOplayer;
    player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
  }

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this.setState({
      audioTracks: event.audioTracks,
      selectedAudioTrack: event.selectedAudioTrack,
    });
  };

  private selectAudioTrack = (index: number) => {
    const { audioTracks } = this.state;
    if (audioTracks && index >= 0 && index < audioTracks.length) {
      const player = this.context.player as THEOplayer;
      const uid = audioTracks[index].uid;
      player.selectedAudioTrack = uid;
      this.setState({ selectedAudioTrack: uid });
    }
  };

  render() {
    const { audioTracks, selectedAudioTrack } = this.state;

    if (!audioTracks || audioTracks.length === 0) {
      return <></>;
    }

    return (
      <MenuButton
        title={'Language'}
        icon={AudioIcon}
        data={audioTracks.map((audioTrack) => new MenuItem(getTrackLabel(audioTrack)))}
        onItemSelected={this.selectAudioTrack}
        minimumItems={2}
        selectedItem={audioTracks.findIndex((audioTrack) => audioTrack.uid === selectedAudioTrack)}
        keyExtractor={(index: number) => `lng${index}`}
      />
    );
  }
}

AudioTrackMenu.contextType = PlayerContext;
