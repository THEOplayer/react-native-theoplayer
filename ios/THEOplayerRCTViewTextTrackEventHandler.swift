// THEOplayerRCTViewTextTrackEventHandler.swift

import Foundation
import THEOplayerSDK

class THEOplayerRCTViewTextTrackEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
        
    // MARK: Events
    var onNativeTextTrackListEvent: RCTDirectEventBlock?
    var onNativeTextTrackEvent: RCTDirectEventBlock?
   
    // MARK: textTrackList Listeners
    private var addTrackListener: EventListener?
    private var removeTrackListener: EventListener?
    private var changeTrackListener: EventListener?
    
    // MARK: textTrack listeners (attached dynamically to new texttracks)
    private var addCueListeners: [Int:EventListener] = [:]
    private var removeCueListeners: [Int:EventListener] = [:]
    
    
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
    
    // MARK: - attach/dettach textTrackList Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // ADD_TRACK
        self.addTrackListener = player.textTracks.addEventListener(type: TextTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedTextTrackListEvent = welf.onNativeTextTrackListEvent,
               let textTrack = event.track as? TextTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received ADD_TRACK event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.ADD_TRACK
                ])
                // start listening for cue events on this track and keep listener for later removal
                welf.addCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.ADD_CUE, listener: welf.addCueListener(_:))
                if DEBUG_EVENTHANDLER { print("[NATIVE] AddCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
                welf.removeCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.REMOVE_CUE, listener: welf.removeCueListener(_:))
                if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener attached to THEOplayer textTrack list") }
        
        // REMOVE_TRACK
        self.removeTrackListener = player.textTracks.addEventListener(type: TextTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedTextTrackListEvent = welf.onNativeTextTrackListEvent,
               let textTrack = event.track as? TextTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received REMOVE_TRACK event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.REMOVE_TRACK
                ])
                // stop listening for cue events on this track
                if let addCueListener = welf.addCueListeners[textTrack.uid],
                   let removeCueListener = welf.removeCueListeners[textTrack.uid]{
                    textTrack.removeEventListener(type: TextTrackEventTypes.ADD_CUE, listener: addCueListener)
                    if DEBUG_EVENTHANDLER { print("[NATIVE] AddCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                    textTrack.removeEventListener(type: TextTrackEventTypes.REMOVE_CUE, listener: removeCueListener)
                    if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener attached to THEOplayer textTrack list") }
        
        // CHANGE
        self.changeTrackListener = player.textTracks.addEventListener(type: TextTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedTextTrackListEvent = welf.onNativeTextTrackListEvent,
               let textTrack = event.track as? TextTrack {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received CHANGE event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.CHANGE_TRACK
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener attached to THEOplayer textTrack list") }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // ADD_TRACK
        if let addTrackListener = self.addTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.ADD_TRACK, listener: addTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AddTrack listener dettached from THEOplayer textTrack list") }
        }
        
        // REMOVE_TRACK
        if let removeTrackListener = self.removeTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.REMOVE_TRACK, listener: removeTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] RemoveTrack listener dettached from THEOplayer textTrack list") }
        }
        
        // CHANGE
        if let changeTrackListener = self.changeTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.CHANGE, listener: changeTrackListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] ChangeTrack listener dettached from THEOplayer textTrack list") }
        }
    }
    
    // MARK: - dynamic textTrack Listeners
    private func addCueListener(_ event: AddCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received ADD_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.ADD_CUE,
                "cue": THEOplayerRCTMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
    
    private func removeCueListener(_ event: RemoveCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received REMOVE_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.REMOVE_CUE,
                "cue": THEOplayerRCTMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
}
