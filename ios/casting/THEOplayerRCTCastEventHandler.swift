// THEOplayerRCTViewCastEventHandler.swift

import Foundation
import THEOplayerSDK

let CAST_EVENT_PROP_TYPE: String = "type"
let CAST_EVENT_PROP_STATE: String = "state"
let CAST_EVENT_PROP_ERROR: String = "error"
let CAST_EVENT_PROP_ERROR_CODE: String = "errorCode"
let CAST_EVENT_PROP_ERROR_DESCRIPTION: String = "description"

let EVENT_TYPE_CHROMECAST_STATE_CHANGE: String = "chromecaststatechange"
let EVENT_TYPE_CHROMECAST_ERROR: String = "chromecasterror"
let EVENT_TYPE_AIRPLAY_STATE_CHANGE: String = "airplaystatechange"

class THEOplayerRCTCastEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
        
    // MARK: Events
    var onNativeCastEvent: RCTDirectEventBlock?
    
    // MARK: Cast Listeners
    private var chromecastStateChangeListener: EventListener?
    private var chromecastErrorListener: EventListener?
    private var airplayStateChangeListener: EventListener?
    
    
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
    
    // MARK: - attach/dettach Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
#if os(iOS) && (CHROMECAST || canImport(GoogleCastIntegration))
        // CHROMECAST STATE_CHANGE
        self.chromecastStateChangeListener = player.cast?.chromecast?.addEventListener(type: ChromecastEventTypes.STATE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received Chromecast STATE_CHANGE event from THEOplayer cast.chromecast") }
            if let forwardedCastEvent = self?.onNativeCastEvent {
                let newCastState = event.state._rawValue
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] New Chromecast state: \(newCastState)") }
                forwardedCastEvent([
                    CAST_EVENT_PROP_TYPE: EVENT_TYPE_CHROMECAST_STATE_CHANGE,
                    CAST_EVENT_PROP_STATE: newCastState
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] Chromecast StateChange listener attached to THEOplayer cast.chromecast") }
        
        // CHROMECAST ERROR
        self.chromecastErrorListener = player.cast?.chromecast?.addEventListener(type: ChromecastEventTypes.ERROR) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received Chromecast ERROR event from THEOplayer cast.chromecast") }
            if let forwardedCastEvent = self?.onNativeCastEvent {
                let error = event.error
                forwardedCastEvent([
                    CAST_EVENT_PROP_TYPE: EVENT_TYPE_CHROMECAST_ERROR,
                    CAST_EVENT_PROP_ERROR: [
                        CAST_EVENT_PROP_ERROR_CODE: error.errorCode._rawValue,
                        CAST_EVENT_PROP_ERROR_DESCRIPTION: error.description ?? ""
                    ]
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] Chromecast Error listener attached to THEOplayer cast.chromecast") }
#endif
        
#if os(iOS)
        // AIRPLAY STATE_CHANGE
        self.airplayStateChangeListener = player.cast?.airPlay?.addEventListener(type: AirPlayEventTypes.STATE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received Airplay STATE_CHANGE event from THEOplayer cast.airplay") }
            if let forwardedCastEvent = self?.onNativeCastEvent,
               let castState = event.state {
                if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] New Airplay state: \(castState)") }
                forwardedCastEvent([
                    CAST_EVENT_PROP_TYPE: EVENT_TYPE_AIRPLAY_STATE_CHANGE,
                    CAST_EVENT_PROP_STATE: castState._rawValue
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] Airplay StateChange listener attached to THEOplayer cast.airplay") }
#endif
    }

    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }

#if os(iOS) && (CHROMECAST || canImport(GoogleCastIntegration))
        // CHROMECAST STATE_CHANGE
        if let chromecastStateChangeListener = self.chromecastStateChangeListener {
            player.cast?.chromecast?.removeEventListener(type: ChromecastEventTypes.STATE_CHANGE, listener: chromecastStateChangeListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] Chromecast StateChange listener dettached from THEOplayer cast.chromecast") }
        }
        if let chromecastErrorListener = self.chromecastErrorListener {
            player.cast?.chromecast?.removeEventListener(type: ChromecastEventTypes.ERROR, listener: chromecastErrorListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] Chromecast Error listener dettached from THEOplayer cast.chromecast") }
        }
#endif
        
#if os(iOS)
        // AIRPLAY STATE_CHANGE
        if let airplayStateChangeListener = self.airplayStateChangeListener {
            player.cast?.airPlay?.removeEventListener(type: AirPlayEventTypes.STATE_CHANGE, listener: airplayStateChangeListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] Airplay StateChange listener dettached from THEOplayer cast.airplay") }
        }
#endif
    }
}
