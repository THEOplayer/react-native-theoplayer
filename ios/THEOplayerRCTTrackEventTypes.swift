// THEOplayerRCTTrackEventTypes.swift

enum MediaTrackType: Int {
    case AUDIO = 0
    case VIDEO = 1
}

enum TrackListEventType: Int {
    case ADD_TRACK = 0
    case REMOVE_TRACK = 1
    case CHANGE_TRACK = 2
}

enum TrackCueEventType: Int {
    case ADD_CUE = 0
    case REMOVE_CUE = 1
}
