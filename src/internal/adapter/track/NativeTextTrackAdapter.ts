import type { TextTrack, THEOplayer } from 'react-native-theoplayer';
import type { TextTrackMode } from "react-native-theoplayer";
import type { TextTrackCue, TextTrackKind, TextTrackType } from "react-native-theoplayer";

export class NativeTextTrackAdapter implements TextTrack {

    private _timeOffset: number | undefined = undefined;

    // @ts-ignore
    constructor(private _nativeTextTrack: TextTrack, private _player: THEOplayer) {
    }

    get mode(): TextTrackMode {
        return this._nativeTextTrack.mode;
    }

    set mode(_mode: TextTrackMode) {
        // TODO
        // NativeModules.TextTrackModule.setMode(this._player.nativeHandle, mode);
    }

    get cues(): TextTrackCue[] | null {
        return this._nativeTextTrack.cues;
    }

    get forced(): boolean {
        return this._nativeTextTrack.forced;
    }

    get id(): string {
        return this._nativeTextTrack.id;
    }

    get kind(): TextTrackKind {
        return this._nativeTextTrack.kind;
    }

    get label(): string {
        return this._nativeTextTrack.label;
    }

    get language(): string {
        return this._nativeTextTrack.language;
    }

    get src(): string {
        return this._nativeTextTrack.src;
    }

    get type(): TextTrackType {
        return this._nativeTextTrack.type;
    }

    get uid(): number {
        return this._nativeTextTrack.uid;
    }

    get timeOffset(): number | undefined {
        return this._timeOffset;
    }

    set timeOffset(offset: number | undefined) {
        this._timeOffset = offset;
        // TODO
        // NativeModules.TextTrackModule.setTimeOffsety(this._player.nativeHandle, offset);
    }
}
