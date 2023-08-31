// THEOplayerRCTTextTrackEventHandler.swift

import Foundation
import THEOplayerSDK

class THEOplayerRCTTextTrackEventHandler {
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
    private var enterCueListeners: [Int:EventListener] = [:]
    private var exitCueListeners: [Int:EventListener] = [:]
    
    
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
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ADD_TRACK event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.ADD_TRACK.rawValue
                ])
                // start listening for cue events on this track and keep listener for later removal
                welf.addCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.ADD_CUE, listener: welf.addCueListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
                welf.removeCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.REMOVE_CUE, listener: welf.removeCueListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
                welf.enterCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.ENTER_CUE, listener: welf.enterCueListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] EnterCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
                welf.exitCueListeners[textTrack.uid] = textTrack.addEventListener(type: TextTrackEventTypes.EXIT_CUE, listener: welf.exitCueListener(_:))
                if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ExitCue listener attached to THEOplayer textTrack with uid \(textTrack.uid)") }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener attached to THEOplayer textTrack list") }
        
        // REMOVE_TRACK
        self.removeTrackListener = player.textTracks.addEventListener(type: TextTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedTextTrackListEvent = welf.onNativeTextTrackListEvent,
               let textTrack = event.track as? TextTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received REMOVE_TRACK event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.REMOVE_TRACK.rawValue
                ])
                // stop listening for cue events on this track
                if let addCueListener = welf.addCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.ADD_CUE, listener: addCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let removeCueListener = welf.removeCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.REMOVE_CUE, listener: removeCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let enterCueListener = welf.enterCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.ENTER_CUE, listener: enterCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] EnterCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let exitCueListener = welf.exitCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.EXIT_CUE, listener: exitCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ExitCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener attached to THEOplayer textTrack list") }
        
        // CHANGE
        self.changeTrackListener = player.textTracks.addEventListener(type: TextTrackListEventTypes.CHANGE) { [weak self] event in
            guard let welf = self else { return }
            if let forwardedTextTrackListEvent = welf.onNativeTextTrackListEvent,
               let textTrack = event.track as? TextTrack {
                if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received CHANGE event from THEOplayer textTrack list: trackUid = \(textTrack.uid)") }
                // trigger tracklist event
                forwardedTextTrackListEvent([
                    "track" : THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackInfo(textTrack: textTrack),
                    "type" : TrackListEventType.CHANGE_TRACK.rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener attached to THEOplayer textTrack list") }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // ADD_TRACK
        if let addTrackListener = self.addTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.ADD_TRACK, listener: addTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddTrack listener dettached from THEOplayer textTrack list") }
        }
        
        // REMOVE_TRACK
        if let removeTrackListener = self.removeTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.REMOVE_TRACK, listener: removeTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveTrack listener dettached from THEOplayer textTrack list") }
        }
        
        // CHANGE
        if let changeTrackListener = self.changeTrackListener {
            player.textTracks.removeEventListener(type: TextTrackListEventTypes.CHANGE, listener: changeTrackListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ChangeTrack listener dettached from THEOplayer textTrack list") }
        }
        
        // ADD_CUE, REMOVE_CUE, ENTER_CUE, EXIT_CUE
        let textTrackCount = player.textTracks.count
        if textTrackCount > 0 {
            for i in 0..<textTrackCount {
                let textTrack = player.textTracks[i]
                // stop listening for cue events on this track
                if let addCueListener = self.addCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.ADD_CUE, listener: addCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let removeCueListener = self.removeCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.REMOVE_CUE, listener: removeCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] RemoveCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let enterCueListener = self.enterCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.ENTER_CUE, listener: enterCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] EnterCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
                if let exitCueListener = self.exitCueListeners.removeValue(forKey: textTrack.uid) {
                    textTrack.removeEventListener(type: TextTrackEventTypes.EXIT_CUE, listener: exitCueListener)
                    if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] ExitCue listener removed from THEOplayer textTrack with uid \(textTrack.uid)") }
                }
            }
        }
    }
    
    // MARK: - dynamic textTrack Listeners
    private func addCueListener(_ event: AddCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ADD_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.ADD_CUE.rawValue,
                "cue": THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
    
    private func removeCueListener(_ event: RemoveCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received REMOVE_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.REMOVE_CUE.rawValue,
                "cue": THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
    
    private func enterCueListener(_ event: EnterCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received ENTER_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.ENTER_CUE.rawValue,
                "cue": THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
    
    private func exitCueListener(_ event: ExitCueEvent) {
        if let forwardedTextTrackEvent = self.onNativeTextTrackEvent,
           let textTrack = event.cue.track {
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received EXIT_CUE event from textTrack: trackUid = \(textTrack.uid), cueUid = \(event.cue.uid)") }
            forwardedTextTrackEvent([
                "trackUid" : textTrack.uid,
                "type": TrackCueEventType.EXIT_CUE.rawValue,
                "cue": THEOplayerRCTTrackMetadataAggregator.aggregatedTextTrackCueInfo(textTrackCue: event.cue)
            ])
        }
    }
}
