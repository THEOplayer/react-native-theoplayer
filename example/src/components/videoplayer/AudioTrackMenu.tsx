import { MenuButton } from '../menubutton/MenuButton';
import { AudioIcon } from '../../res/images';
import { MenuItem } from '../modalmenu/MenuItem';
import React from 'react';
import type { MediaTrack } from 'react-native-theoplayer';
import { getTrackLabel } from './TrackUtils';

export interface AudioTrackMenuProps {
  audioTracks: MediaTrack[];
  selectedAudioTrack: number | undefined;
  onSelectAudioTrack?: (uid: number | undefined) => void;
}

export function AudioTrackMenu(props: AudioTrackMenuProps) {
  const { audioTracks, selectedAudioTrack } = props;

  if (!audioTracks || audioTracks.length === 0) {
    return <></>;
  }

  const selectAudioTrack = (index: number) => {
    const { audioTracks, onSelectAudioTrack } = props;
    if (onSelectAudioTrack) {
      if (audioTracks && index >= 0 && index < audioTracks.length) {
        onSelectAudioTrack(audioTracks[index].uid);
      }
    }
  };

  return (
    <MenuButton
      title={'Language'}
      icon={AudioIcon}
      data={audioTracks.map((audioTrack) => new MenuItem(getTrackLabel(audioTrack)))}
      onItemSelected={selectAudioTrack}
      minimumItems={2}
      selectedItem={audioTracks.findIndex((audioTrack) => audioTrack.uid === selectedAudioTrack)}
      keyExtractor={(index: number) => `lng${index}`}
    />
  );
}
