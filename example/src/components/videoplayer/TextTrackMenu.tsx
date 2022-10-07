import { MenuButton } from '../menubutton/MenuButton';
import { SubtitlesIcon } from '../../res/images';
import { MenuItem } from '../modalmenu/MenuItem';
import React from 'react';
import type { TextTrack } from 'react-native-theoplayer';
import { getTrackLabel } from './TrackUtils';

export interface TextTrackMenuProps {
  textTracks: TextTrack[];
  selectedTextTrack: number | undefined;
  onSelectTextTrack?: (uid: number | undefined) => void;
}

/**
 * Retain renderable tracks.
 * https://html.spec.whatwg.org/multipage/embedded-content.html#text-track-showing
 */
export function filterRenderableTracks(textTracks: TextTrack[] | undefined): TextTrack[] | undefined {
  return textTracks && textTracks.filter((textTrack) => textTrack.kind === 'subtitles' || textTrack.kind === 'captions');
}

export function TextTrackMenu(props: TextTrackMenuProps) {
  const { textTracks, selectedTextTrack } = props;
  const selectableTextTracks = filterRenderableTracks(textTracks);
  if (!selectableTextTracks || selectableTextTracks.length === 0) {
    return <></>;
  }

  const selectTextTrack = (index: number) => {
    const { textTracks, onSelectTextTrack } = props;
    if (onSelectTextTrack) {
      const uid = textTracks && index >= 0 && index < textTracks.length ? textTracks[index].uid : undefined;
      onSelectTextTrack(uid);
    }
  };

  return (
    <MenuButton
      title={'Subtitles'}
      icon={SubtitlesIcon}
      data={[...selectableTextTracks, null].map((textTrack) => (textTrack ? new MenuItem(getTrackLabel(textTrack)) : new MenuItem('None')))}
      onItemSelected={selectTextTrack}
      selectedItem={selectedTextTrack !== undefined ? textTracks.findIndex((textTrack) => textTrack.uid === selectedTextTrack) : textTracks.length}
      keyExtractor={(index: number) => `sub${index}`}
    />
  );
}
