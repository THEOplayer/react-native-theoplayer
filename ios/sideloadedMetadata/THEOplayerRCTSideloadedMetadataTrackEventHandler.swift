// THEOplayerRCTSideloadedMetadataTrackEventHandler.swift

import Foundation
import THEOplayerSDK


class THEOplayerRCTSideloadedMetadataTrackEventHandler {
    private var loadedMetadataAndChapterTracksInfo: [[String:Any]] = []
    // MARK: Events
    var onNativeTextTrackListEvent: RCTDirectEventBlock?
    var onNativeTextTrackEvent: RCTDirectEventBlock?
    
    func setLoadedMetadataAndChapterTracksInfo(_ tracksInfo: [[String:Any]]) {
        self.loadedMetadataAndChapterTracksInfo = tracksInfo
        self.triggerAddMetadataOrChapterTrackEvent(tracksInfo)
    }
    
    func triggerAddMetadataOrChapterTrackEvent(_ trackInfo: [[String:Any]]) {
        for trackInfo in trackInfo {
            if let addTrackEvent = self.onNativeTextTrackListEvent {
                addTrackEvent([
                    "track" : trackInfo,
                    "type" : TrackListEventType.ADD_TRACK.rawValue
                ])
            }
        }
    }
}
