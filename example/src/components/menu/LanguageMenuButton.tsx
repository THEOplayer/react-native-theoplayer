import React, { PureComponent } from 'react';
import type { MediaTrack } from 'react-native-theoplayer';
import { PlayerEventType, TextTrack } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { LanguageSvg } from '../button/svg/LanguageSvg';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuRadioButton } from './common/MenuRadioButton';
import { MenuButton } from './common/MenuButton';
import { filterRenderableTracks, getTrackLabel } from '../util/TrackUtils';
import { MenuView } from './common/MenuView';

export interface LanguageMenuButtonState {
  audioTracks: MediaTrack[];
  textTracks: TextTrack[];
}

export class LanguageMenuButton extends PureComponent<unknown, LanguageMenuButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { audioTracks: [], textTracks: [] };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListChanged);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
    player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListChanged);
  }

  private onTextTrackListChanged = () => {
    this.setState({ textTracks: (this.context as UiContext).player.textTracks });
  };

  private onTrackListChanged = () => {
    this.setState({ audioTracks: (this.context as UiContext).player.audioTracks });
  };

  render() {
    const { audioTracks, textTracks } = this.state;

    const selectableTextTracks = filterRenderableTracks(textTracks);

    if (audioTracks.length < 2 && selectableTextTracks.length === 0) {
      return <></>;
    }

    const context = this.context as UiContext;

    console.log(audioTracks, selectableTextTracks);

    return (
      <MenuButton
        svg={<LanguageSvg />}
        menu={
          <LanguageMenuView
            audioTracks={context.player.audioTracks}
            textTracks={context.player.textTracks}
            selectedAudioTrack={context.player.selectedAudioTrack}
            selectedTextTrack={context.player.selectedTextTrack}
          />
        }
      />
    );
  }
}

export interface LanguageMenuViewState extends LanguageMenuButtonState {
  selectedAudioTrack: number | undefined;
  selectedTextTrack: number | undefined;
}

export class LanguageMenuView extends PureComponent<LanguageMenuViewState, LanguageMenuViewState> {
  constructor(props: LanguageMenuViewState) {
    super(props);
    this.state = {
      audioTracks: props.audioTracks,
      textTracks: props.textTracks,
      selectedAudioTrack: props.selectedAudioTrack,
      selectedTextTrack: props.selectedTextTrack,
    };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    // The track lists might change while the menu is open, so we need to monitor them.
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListChanged);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onTrackListChanged);
    player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListChanged);
  }

  private onTextTrackListChanged = () => {
    const player = (this.context as UiContext).player;
    this.setState({
      textTracks: player.textTracks,
      selectedTextTrack: player.selectedTextTrack,
    });
  };

  private onSelectTextTrack = (index: number) => {
    const { textTracks } = this.state;
    if (index >= 0 && index < textTracks.length) {
      const context = this.context as UiContext;
      const uid = index >= 0 && index < textTracks.length ? textTracks[index].uid : undefined;
      context.player.selectedTextTrack = uid;
      this.setState({ selectedTextTrack: uid });
    }
  };

  private onTrackListChanged = () => {
    const player = (this.context as UiContext).player;
    this.setState({
      audioTracks: player.audioTracks,
      selectedAudioTrack: player.selectedAudioTrack,
    });
  };

  private selectAudioTrack = (index: number) => {
    const { audioTracks } = this.state;
    if (index >= 0 && index < audioTracks.length) {
      const context = this.context as UiContext;
      const uid = audioTracks[index].uid;
      context.player.selectedAudioTrack = uid;
      this.setState({ selectedAudioTrack: uid });
    }
  };

  render() {
    const { audioTracks, textTracks, selectedAudioTrack, selectedTextTrack } = this.state;
    const selectableTextTracks = filterRenderableTracks(textTracks);

    return (
      <MenuView
        menu={
          <>
            {audioTracks.length > 1 && (
              <ScrollableMenu
                title={'Audio'}
                items={audioTracks.map((track, id) => (
                  <MenuRadioButton
                    key={id}
                    label={getTrackLabel(track)}
                    id={id}
                    onSelect={this.selectAudioTrack}
                    selected={track.uid === selectedAudioTrack}></MenuRadioButton>
                ))}
              />
            )}
            {selectableTextTracks.length > 0 && (
              <ScrollableMenu
                title={'Subtitles'}
                items={selectableTextTracks.map((track, id) => (
                  <MenuRadioButton
                    key={id}
                    label={getTrackLabel(track)}
                    id={id}
                    onSelect={this.onSelectTextTrack}
                    selected={track.uid === selectedTextTrack}></MenuRadioButton>
                ))}
              />
            )}
          </>
        }
      />
    );
  }
}

LanguageMenuButton.contextType = PlayerContext;
LanguageMenuView.contextType = PlayerContext;
