// THEOplayerRCTViewMediaTrackEventHandler.swift

import Foundation
import THEOplayerSDK

class THEOplayerRCTViewMediaTrackEventHandler {
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
    private var audioChangeTrackListeners: [Int:EventListener] = [:]
    private var videoChangeTrackListeners: [Int:EventListener] = [:]
    
    
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
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received ADD_TRACK event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.ADD_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener attached to THEOplayer audioTrack list") }
        
        // AUDIO REMOVE_TRACK
        self.audioRemoveTrackListener = player.audioTracks.addEventListener(type: AudioTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let audioTrack = event.track as? AudioTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received REMOVE_TRACK event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.REMOVE_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener attached to THEOplayer audioTrack list") }
        
        // AUDIO CHANGE
        self.audioChangeTrackListener = player.audioTracks.addEventListener(type: AudioTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let audioTrack = event.track as? AudioTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received CHANGE event from THEOplayer audioTrack list: trackUid = \(audioTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedAudioTrackInfo(audioTrack: audioTrack),
                    "type" : TrackListEventType.CHANGE_TRACK.rawValue,
                    "trackType": MediaTrackType.AUDIO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener attached to THEOplayer audioTrack list") }
        
        // VIDEO ADD_TRACK
        self.videoAddTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received ADD_TRACK event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.ADD_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener attached to THEOplayer videoTrack list") }
        
        // VIDEO REMOVE_TRACK
        self.videoRemoveTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received REMOVE_TRACK event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.REMOVE_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener attached to THEOplayer videoTrack list") }
        
        // VIDEO CHANGE
        self.videoChangeTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedMediaTrackListEvent = welf.onNativeMediaTrackListEvent,
               let videoTrack = event.track as? VideoTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received CHANGE event from THEOplayer videoTrack list: trackUid = \(videoTrack.uid)") }
                // trigger tracklist event
                forwardedMediaTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedVideoTrackInfo(videoTrack: videoTrack),
                    "type" : TrackListEventType.CHANGE_TRACK.rawValue,
                    "trackType": MediaTrackType.VIDEO.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener attached to THEOplayer audioTrack list") }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // AUDIO ADD_TRACK
        if let audioAddTrackListener = self.audioAddTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.ADD_TRACK, listener: audioAddTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // AUDIO REMOVE_TRACK
        if let audioRemoveTrackListener = self.audioRemoveTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.REMOVE_TRACK, listener: audioRemoveTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // AUDIO CHANGE
        if let audioChangeTrackListener = self.audioChangeTrackListener {
            player.audioTracks.removeEventListener(type: AudioTrackListEventTypes.CHANGE, listener: audioChangeTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener dettached from THEOplayer audioTrack list") }
        }
        
        // VIDEO ADD_TRACK
        if let videoAddTrackListener = self.videoAddTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.ADD_TRACK, listener: videoAddTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener dettached from THEOplayer videoTrack list") }
        }
        
        // VIDEO REMOVE_TRACK
        if let videoRemoveTrackListener = self.videoRemoveTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK, listener: videoRemoveTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener dettached from THEOplayer videoTrack list") }
        }
        
        // VIDEO CHANGE
        if let videoChangeTrackListener = self.videoChangeTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.CHANGE, listener: videoChangeTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener dettached from THEOplayer videoTrack list") }
        }
    }
}
