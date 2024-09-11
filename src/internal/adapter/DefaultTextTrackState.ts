import {
  addTextTrackCue,
  addTrack,
  findTextTrackByUid,
  type LoadedMetadataEvent,
  PlayerEventType,
  removeTextTrackCue,
  removeTrack,
  TextTrack,
  type TextTrackEvent,
  TextTrackEventType,
  type TextTrackListEvent,
  TextTrackMode,
  THEOplayer,
  TrackListEventType,
} from 'react-native-theoplayer';
import { TextTrackState } from './NativePlayerState';

export class DefaultTextTrackState implements TextTrackState {
  private _textTracks: TextTrack[] = [];
  private _selectedTextTrack: number | undefined;

  constructor(private _player: THEOplayer) {
    _player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    _player.addEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrack);
    _player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackList);
  }

  destroy() {
    this._player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this._player.removeEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrack);
    this._player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackList);
  }

  get textTracks(): TextTrack[] {
    return this._textTracks;
  }

  set textTracks(tracks: TextTrack[]) {
    this._textTracks = tracks;
  }

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this._textTracks = event.textTracks;
    this._selectedTextTrack = event.selectedTextTrack;
  };

  private onTextTrack = (event: TextTrackEvent) => {
    const { subType, cue, trackUid } = event;
    const track = findTextTrackByUid(this.textTracks, trackUid);
    switch (subType) {
      case TextTrackEventType.ADD_CUE:
        addTextTrackCue(track, cue);
        break;
      case TextTrackEventType.REMOVE_CUE:
        removeTextTrackCue(track, cue);
        break;
    }
  };

  private onTextTrackList = (event: TextTrackListEvent) => {
    const { subType, track } = event;
    switch (subType) {
      case TrackListEventType.ADD_TRACK:
        this._textTracks = addTrack(this._textTracks, track);
        break;
      case TrackListEventType.REMOVE_TRACK:
        this._textTracks = removeTrack(this._textTracks, track);
        break;
      case TrackListEventType.CHANGE_TRACK:
        this._textTracks = removeTrack(this._textTracks, track);
        this._textTracks = addTrack(this._textTracks, track);
        break;
    }
  };

  get selectedTextTrack(): number | undefined {
    return this._selectedTextTrack;
  }

  set selectedTextTrack(trackUid: number | undefined) {
    if (!this.hasValidSource()) {
      return;
    }
    this._selectedTextTrack = trackUid;
    this.textTracks.forEach((track) => {
      if (track.uid === trackUid) {
        track.mode = TextTrackMode.showing;
      } else if (track.mode === TextTrackMode.showing) {
        track.mode = TextTrackMode.disabled;
      }
    });
  }

  private hasValidSource(): boolean {
    return this._player?.source !== undefined;
  }
}
