// THEOplayerRCTSideloadedMetadataTrackEventHandler.swift

import Foundation
import THEOplayerSDK


class THEOplayerRCTSideloadedMetadataTrackEventHandler {
    private var loadedMetadataTracksInfo: [[String:Any]] = []
    // MARK: Events
    var onNativeTextTrackListEvent: RCTDirectEventBlock?
    var onNativeTextTrackEvent: RCTDirectEventBlock?
    
    func setLoadedMetadataTracksInfo(_ metadataTracksInfo: [[String:Any]]) {
        self.loadedMetadataTracksInfo = metadataTracksInfo
        self.triggerAddMetadataTrackEvent(metadataTracksInfo)
    }
    
    func triggerAddMetadataTrackEvent(_ metadataTrackInfo: [[String:Any]]) {
        for trackInfo in metadataTrackInfo {
            if let addTrackEvent = self.onNativeTextTrackListEvent {
                addTrackEvent([
                    "track" : trackInfo,
                    "type" : TrackListEventType.ADD_TRACK.rawValue
                ])
            }
        }
    }
}
