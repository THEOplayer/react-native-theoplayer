import type { ChromelessPlayer, TextTrack as WebTextTrack, AddTrackEvent as WebAddTrackEvent, RemoveTrackEvent as WebRemoveTrackEvent } from "theoplayer";
import { WebTextTrackAdapter } from "./WebTextTrackAdapter";
import { addTrack, removeTrack } from "react-native-theoplayer";

export class WebTextTrackListAdapter {

    private _textTracks: WebTextTrackAdapter[] = [];

    constructor(private _player: ChromelessPlayer) {
        this._player.textTracks.addEventListener('addtrack', (event: WebAddTrackEvent) => {
            this._textTracks = addTrack(this._textTracks, new WebTextTrackAdapter(event.track as WebTextTrack));
        });
        this._player.textTracks.addEventListener('removetrack', (event: WebRemoveTrackEvent) => {
            this._textTracks = removeTrack(this._textTracks, event.track as unknown as WebTextTrackAdapter);
        });
    }

    get textTracks():  WebTextTrackAdapter[] {
        return this._textTracks;
    }
}
