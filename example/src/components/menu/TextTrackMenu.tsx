import { MenuButton } from './menubutton/MenuButton';
import { MenuItem } from './modalmenu/MenuItem';
import React, { PureComponent } from 'react';
import type { TextTrack } from 'react-native-theoplayer';
import { LoadedMetadataEvent, PlayerEventType, TextTrackListEvent, TrackListEventType } from 'react-native-theoplayer';
import { getTrackLabel } from './TrackUtils';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { SubtitleSvg } from '../button/svg/SubtitleSvg';

function stringFromTextTrackListEvent(type: TrackListEventType): string {
  switch (type) {
    case TrackListEventType.ADD_TRACK:
      return 'AddTrack';
    case TrackListEventType.REMOVE_TRACK:
      return 'RemoveTrack';
    case TrackListEventType.CHANGE_TRACK:
      return 'ChangeTrack';
  }
}

export interface TextTrackMenuState {
  textTracks: TextTrack[];
  selectedTextTrack: number | undefined;
}

/**
 * Retain renderable tracks.
 * https://html.spec.whatwg.org/multipage/embedded-content.html#text-track-showing
 */
export function filterRenderableTracks(textTracks: TextTrack[] | undefined): TextTrack[] | undefined {
  return textTracks && textTracks.filter((textTrack) => textTrack.kind === 'subtitles' || textTrack.kind === 'captions');
}

const TAG = 'TextTrackMenu';

export class TextTrackMenu extends PureComponent<unknown, TextTrackMenuState> {
  constructor(props: unknown) {
    super(props);
    this.state = { textTracks: [], selectedTextTrack: undefined };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
  }

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this.setState({
      textTracks: event.textTracks,
    });
  };

  private onTextTrackListEvent = (event: TextTrackListEvent) => {
    const player = (this.context as UiContext).player;
    this.setState({ textTracks: player.textTracks });
    console.log(TAG, `onTextTrackListEvent: ${stringFromTextTrackListEvent(event.subType)} track`, event.track.uid);
  };

  private onSelectTextTrack = (index: number) => {
    const { textTracks } = this.state;
    const player = (this.context as UiContext).player;
    const uid = textTracks && index >= 0 && index < textTracks.length ? textTracks[index].uid : undefined;
    player.selectedTextTrack = uid;
    console.log('selected', uid);
    this.setState({ selectedTextTrack: uid });
  };

  render() {
    const { textTracks, selectedTextTrack } = this.state;
    const selectableTextTracks = filterRenderableTracks(textTracks);
    if (!selectableTextTracks || selectableTextTracks.length === 0) {
      return <></>;
    }

    return (
      <MenuButton
        title={'Subtitles'}
        svg={<SubtitleSvg />}
        data={[...selectableTextTracks, null].map((textTrack) => (textTrack ? new MenuItem(getTrackLabel(textTrack)) : new MenuItem('None')))}
        onItemSelected={this.onSelectTextTrack}
        selectedItem={
          selectedTextTrack !== undefined ? textTracks.findIndex((textTrack) => textTrack.uid === selectedTextTrack) : selectableTextTracks.length
        }
        keyExtractor={(index: number) => `sub${index}`}
      />
    );
  }
}

TextTrackMenu.contextType = PlayerContext;
