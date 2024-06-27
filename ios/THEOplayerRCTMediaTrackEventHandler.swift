// THEOplayerRCTMediaTrackEventHandler.swift

import Foundation
import THEOplayerSDK

class THEOplayerRCTMediaTrackEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
        
    // MARK: Events
    var onNativeMediaTrackListEvent: RCTDirectEventBlock?
    var onNativeMediaTrackEvent: RCTDirectEventBlock?       // currently not in use on iOS THEOplayerSDK
   
    // MARK: mediaTrackList Listeners
    private var audioAddTrackListener: EventListener?
    private var audioRemoveTrackListener: EventListener?
    private var audioChangeTrackListener: EventListener?
    private var videoAddTrackListener: EventListener?
    private var videoRemoveTrackListener: EventListener?
    private var videoChangeTrackListener: EventListener?
    
    // MARK: mediaTrack listeners (attached dynamically to new mediatracks)
    private var videoQualityChangeListeners: [Int:EventListener] = [:]
    private var audioQualityChangeListeners: [Int:EventListener] = [:]
    
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player;
        
        // attach listeners
        self.attachListeners()
    }
    
    // MARK: - attach/dettach mediaTrackList Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // AUDIO ADD_TRACK
        self.audioAddTrackListener = player.audioTracks.addEventListener(type: AudioTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let audioTrack = event.track as? AudioTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ADD_TRACK event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.ADD_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
                
                // start listening for qualityChange events on this track
                welf.audioQualityChangeListeners[audioTrack.uid] = audioTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: welf.addAudioQualityChangeListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] QualityChange listener attached to THEOplayer audioTrack with uid \(audioTrack.uid)") }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener attached to THEOplayer audioTrack list") }
        
        // AUDIO REMOVE_TRACK
        self.audioRemoveTrackListener = player.audioTracks.addEventListener(type: AudioTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let audioTrack = event.track as? AudioTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received REMOVE_TRACK event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.REMOVE_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
                
                // stop listening for qualityChange events on this track
                if let audioQualityChangeListener = welf.audioQualityChangeListeners.removeValue(forKey: audioTrack.uid) {
                    audioTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: audioQualityChangeListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ActiveQuality listener removed from THEOplayer audioTrack with uid \(audioTrack.uid)") }
                }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener attached to THEOplayer audioTrack list") }
        
        // AUDIO CHANGE
        self.audioChangeTrackListener = player.audioTracks.addEventListener(type: AudioTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let audioTrack = event.track as? AudioTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received CHANGE event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.CHANGE_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener attached to THEOplayer audioTrack list") }
        
        // VIDEO ADD_TRACK
        self.videoAddTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ADD_TRACK event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.ADD_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
                
                // start listening for qualityChange events on this track
                welf.videoQualityChangeListeners[videoTrack.uid] = videoTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: welf.addVideoQualityChangeListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] QualityChange listener attached to THEOplayer videoTrack with uid \(videoTrack.uid)") }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener attached to THEOplayer videoTrack list") }
        
        // VIDEO REMOVE_TRACK
        self.videoRemoveTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received REMOVE_TRACK event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.REMOVE_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
                
                // stop listening for qualityChange events on this track
                if let videoQualityChangeListener = welf.videoQualityChangeListeners.removeValue(forKey: videoTrack.uid) {
                    videoTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: videoQualityChangeListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ActiveQuality listener removed from THEOplayer videoTrack with uid \(videoTrack.uid)") }
                }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener attached to THEOplayer videoTrack list") }
        
        // VIDEO CHANGE
        self.videoChangeTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received CHANGE event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.CHANGE_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener attached to THEOplayer audioTrack list") }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // AUDIO ADD_TRACK
        if let audioAddTrackListener = self.audioAddTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.ADD_TRACK, listener: audioAddTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // AUDIO REMOVE_TRACK
        if let audioRemoveTrackListener = self.audioRemoveTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.REMOVE_TRACK, listener: audioRemoveTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // AUDIO CHANGE
        if let audioChangeTrackListener = self.audioChangeTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.CHANGE, listener: audioChangeTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // VIDEO ADD_TRACK
        if let videoAddTrackListener = self.videoAddTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.ADD_TRACK, listener: videoAddTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener dettached from THEOplayer videoTrack list") }
        }
        
        // VIDEO REMOVE_TRACK
        if let videoRemoveTrackListener = self.videoRemoveTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK, listener: videoRemoveTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener dettached from THEOplayer videoTrack list") }
        }
        
        // VIDEO CHANGE
        if let videoChangeTrackListener = self.videoChangeTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.CHANGE, listener: videoChangeTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener dettached from THEOplayer videoTrack list") }
        }
        
        // QUALITY CHANGE - AUDIO
        let audioTrackCount = player.audioTracks.count
        if audioTrackCount > 0 {
            for i in 0..<audioTrackCount {
                let audioTrack = player.audioTracks[i]
                // stop listening for quality change events on this track
                if let audioQualityChangeListener = self.audioQualityChangeListeners.removeValue(forKey: audioTrack.uid) {
                    audioTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: audioQualityChangeListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ActiveQuality listener removed from THEOplayer audioTrack with uid \(audioTrack.uid)") }
                }
            }
        }
        
        // QUALITY CHANGE - VIDEO
        let videoTrackCount = player.videoTracks.count
        if videoTrackCount > 0 {
            for i in 0..<videoTrackCount {
                let videoTrack = player.videoTracks[i]
                // stop listening for quality change events on this track
                if let videoQualityChangeListener = self.videoQualityChangeListeners.removeValue(forKey: videoTrack.uid) {
                    videoTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: videoQualityChangeListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ActiveQuality listener removed from THEOplayer videoTrack with uid \(videoTrack.uid)") }
                }
            }
        }
    }
    
    // MARK: - dynamic mediaTrack Listeners
    private func addVideoQualityChangeListener(_ event: ActiveQualityChangedEvent) {
        if let forwardedMediaTrackEvent = self.onNativeMediaTrackEvent,
           let player = self.player,
           let track = self.activeTrack(tracks: player.videoTracks) {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ACTIVE_QUALITY_CHANGED event for videoTrack") }
            let identifier = String(track.activeQualityBandwidth)
            let label = self.labelFromBandWidth(track.activeQualityBandwidth)
            forwardedMediaTrackEvent([
                "trackUid" : track.uid,
                "type" : MediaTrackEventType.ACTIVE_QUALITY_CHANGED.rawValue,
                "trackType": MediaTrackType.VIDEO.rawValue,
                "qualities": [
                    "bandwidth": track.activeQualityBandwidth,
                    "codecs": "",
                    "id": identifier,
                    "uid": identifier,
                    "name": label,
                    "label": label,
                    "available": true
                ]
            ])
        }
    }
    
    private func addAudioQualityChangeListener(_ event: ActiveQualityChangedEvent) {
        if let forwardedMediaTrackEvent = self.onNativeMediaTrackEvent,
           let player = self.player,
           let track = self.activeTrack(tracks: player.audioTracks) {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ACTIVE_QUALITY_CHANGED event for audioTrack") }
            let identifier = String(track.activeQualityBandwidth)
            let label = self.labelFromBandWidth(track.activeQualityBandwidth)
            
            forwardedMediaTrackEvent([
                "trackUid" : track.uid,
                "type" : MediaTrackEventType.ACTIVE_QUALITY_CHANGED.rawValue,
                "trackType": MediaTrackType.AUDIO.rawValue,
                "qualities": [
                    "bandwidth": track.activeQualityBandwidth,
                    "codecs": "",
                    "id": identifier,
                    "uid": identifier,
                    "name": label,
                    "label": label,
                    "available": true
                ]
            ])
        }
    }

    // MARK: - Helpers
    private func activeTrack(tracks: THEOplayerSDK.MediaTrackList) -> MediaTrack? {
        guard tracks.count > 0 else {
            return nil;
        }
        var track: MediaTrack?
        for i in 0...tracks.count-1 {
           track = tracks.get(i)
            if (track != nil && track!.enabled) {
                return track
            }
        }
        return nil;
    }
    
    private func labelFromBandWidth(_ bandWidth: Int) -> String {
        if bandWidth > 1000000 {
            return "\(Double(bandWidth / 1000) / 1000) Mbps"
        } else if bandWidth > 1000 {
            return "\(bandWidth / 1000) kbps"
        } else {
            return "No Label"
        }
    }
}
