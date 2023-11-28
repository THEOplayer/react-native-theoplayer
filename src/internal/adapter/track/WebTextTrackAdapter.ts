import type { TextTrack, TextTrackCue } from 'react-native-theoplayer';
import type { TextTrack as WebTextTrack } from 'theoplayer';
import type { TextTrackKind, TextTrackMode, TextTrackType } from "react-native-theoplayer";
import { fromNativeCue } from "../web/TrackUtils";
import type { Event as WebEvent } from "theoplayer";

export class WebTextTrackAdapter implements TextTrack {

  private _timeOffset: number | undefined = undefined;

  constructor(private _webTextTrack: WebTextTrack) {
  }

  get mode(): TextTrackMode {
    return this._webTextTrack.mode as TextTrackMode;
  }

  set mode(mode: TextTrackMode) {
    this._webTextTrack.mode = mode;
  }

  get cues(): TextTrackCue[] | null {
    return this._webTextTrack.cues ? this._webTextTrack.cues.map((cue) => fromNativeCue(cue)) : [];
  }

  get forced(): boolean {
    return this._webTextTrack.forced;
  }

  get id(): string {
    return this._webTextTrack.id;
  }

  get kind(): TextTrackKind {
    return this._webTextTrack.kind as TextTrackKind;
  }

  get label(): string {
    return this._webTextTrack.label;
  }

  get language(): string {
    return this._webTextTrack.language;
  }

  get src(): string {
    return this._webTextTrack.src;
  }

  get type(): TextTrackType {
    return this._webTextTrack.type as TextTrackType;
  }

  get uid(): number {
    return this._webTextTrack.uid;
  }

  get timeOffset(): number | undefined {
    return this._timeOffset;
  }

  set timeOffset(offset: number | undefined) {
    // Optionally remove existing listener
    this._webTextTrack.removeEventListener('addcue', this.onAddTextTrackCue);
    this._timeOffset = offset;
    if (offset !== undefined) {
      this._webTextTrack.addEventListener('addcue', this.onAddTextTrackCue);
    }
  }

  private onAddTextTrackCue = (event: WebEvent<'addcue'>) => {
    const {cue} = event as unknown as { cue: TextTrackCue };
    if (cue && this._timeOffset !== undefined) {
      cue.startTime += this._timeOffset;
      cue.endTime += this._timeOffset;
    }
  };
}
