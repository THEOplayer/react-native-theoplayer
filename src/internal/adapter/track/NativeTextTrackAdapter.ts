import type { TextTrack, THEOplayer } from 'react-native-theoplayer';
import type { TextTrackMode } from "react-native-theoplayer";
import type { TextTrackCue, TextTrackKind, TextTrackType } from "react-native-theoplayer";
import { NativeModules, Platform } from "react-native";

export class NativeTextTrackAdapter implements TextTrack {

    private _timeOffset: number | undefined = undefined;
    private _maxCueDuration: number | undefined = undefined;

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
        if (Platform.OS !== 'ios') {
            NativeModules.TextTrackModule.setTimeOffset(this._player.nativeHandle, this._nativeTextTrack.uid, offset);
        }
    }

    get maxCueDuration(): number | undefined {
        return this._maxCueDuration;
    }

    set maxCueDuration(max: number | undefined) {
        this._maxCueDuration = max;
        if (Platform.OS !== 'ios') {
            NativeModules.TextTrackModule.setMaxCueDuration(this._player.nativeHandle, this._nativeTextTrack.uid, max);
        }
    }
}
