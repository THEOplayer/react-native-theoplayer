import type { TextTrack, TextTrackCue } from 'react-native-theoplayer';
import type { TextTrack as WebTextTrack } from 'theoplayer';
import type { TextTrackKind, TextTrackMode, TextTrackType } from "react-native-theoplayer";
import { fromNativeCue } from "../web/TrackUtils";
import type { Event as WebEvent, TextTrackCue as WebTextTrackCue } from "theoplayer";

export class WebTextTrackAdapter implements TextTrack {

    private _timeOffset: number | undefined = undefined;
    private _maxCueDuration: number | undefined = undefined;

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
        this._timeOffset = offset;
        this._webTextTrack.cues?.forEach(cue => this.applyOffset(cue));
        this.updateOnAddTextTrackCueListener();
    }

    get maxCueDuration(): number | undefined {
        return this._maxCueDuration;
    }

    set maxCueDuration(max: number | undefined) {
        this._maxCueDuration = max;
        this._webTextTrack.cues?.forEach(cue => this.applyMaxCueDuration(cue));
        this.updateOnAddTextTrackCueListener();
    }

    private updateOnAddTextTrackCueListener() {
        // Optionally remove existing listener
        this._webTextTrack.removeEventListener('addcue', this.onAddTextTrackCue);
        if (this._timeOffset !== undefined || this._maxCueDuration !== undefined) {
            this._webTextTrack.addEventListener('addcue', this.onAddTextTrackCue);
        }
    }

    private onAddTextTrackCue = (event: WebEvent<'addcue'>) => {
        const {cue} = event as unknown as { cue: WebTextTrackCue };
        if (cue) {
            // Optionally offset the cue times
            this.applyOffset(cue);

            // Optionally apply the maximum cue duration
            this.applyMaxCueDuration(cue);
        }
    };

    private applyOffset(cue: WebTextTrackCue) {
        // Optionally offset the cue times
        if (this._timeOffset !== undefined) {
            cue.startTime += 1e-3 * this._timeOffset;
            cue.endTime += 1e-3 * this._timeOffset;
        }
    }

    private applyMaxCueDuration(cue: WebTextTrackCue) {
        if (this._maxCueDuration !== undefined) {
            cue.endTime = Math.min(cue.endTime, cue.startTime + 1e-3 * this._maxCueDuration);
        }
    }
}
