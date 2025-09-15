// THEOplayerRCTTHEOadsEventHandler.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif

let EVENT_TYPE_ADD_INTERSTITIAL: String = "addinterstitial"
let EVENT_TYPE_INTERSTITIAL_BEGIN: String = "interstitialbegin"
let EVENT_TYPE_INTERSTITIAL_END: String = "interstitialend"
let EVENT_TYPE_INTERSTITIAL_UPDATE: String = "interstitialupdate"
let EVENT_TYPE_INTERSTITIAL_ERROR: String = "interstitialerror"

let THEOADS_EVENT_PROP_TYPE: String = "type"
let THEOADS_EVENT_PROP_INTERSTITIAL: String = "interstitial"
let THEOADS_EVENT_PROP_MESSAGE: String = "message"

class THEOplayerRCTTHEOadsEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?

    // MARK: Events
    var onNativeTHEOadsEvent: RCTDirectEventBlock?

    // MARK: THEOAds Listeners
    private var addInterstitialListener: EventListener?
    private var interstitialBeginListener: EventListener?
    private var interstitialEndListener: EventListener?
    private var interstitialUpdateListener: EventListener?
    private var interstitialErrorListener: EventListener?

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

#if canImport(THEOplayerTHEOadsIntegration)
        // ADD_INTERSTITIAL
        self.addInterstitialListener = player.ads.theoAds?.addEventListener(type: THEOadsEventTypes.ADD_INTERSTITIAL) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AddInterstitial event from THEOplayer.ads.theoAds") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                forwardedTHEOadsEvent([
                    THEOADS_EVENT_PROP_TYPE: EVENT_TYPE_ADD_INTERSTITIAL,
                    THEOADS_EVENT_PROP_INTERSTITIAL: THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(event.interstitial)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddInterstitial listener attached to THEOplayer.ads.theoAds") }
        
        // INTERSTITIAL_BEGIN
        self.interstitialBeginListener = player.ads.theoAds?.addEventListener(type: THEOadsEventTypes.INTERSTITIAL_BEGIN) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received InterstitialBegin event from THEOplayer.ads.theoAds") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                forwardedTHEOadsEvent([
                    THEOADS_EVENT_PROP_TYPE: EVENT_TYPE_INTERSTITIAL_BEGIN,
                    THEOADS_EVENT_PROP_INTERSTITIAL: THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(event.interstitial)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialBegin listener attached to THEOplayer.ads.theoAds") }
        
        // INTERSTITIAL_END
        self.interstitialEndListener = player.ads.theoAds?.addEventListener(type: THEOadsEventTypes.INTERSTITIAL_END) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received InterstitialEnd event from THEOplayer.ads.theoAds") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                forwardedTHEOadsEvent([
                    THEOADS_EVENT_PROP_TYPE: EVENT_TYPE_INTERSTITIAL_END,
                    THEOADS_EVENT_PROP_INTERSTITIAL: THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(event.interstitial)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialEnd listener attached to THEOplayer.ads.theoAds") }
        
        // INTERSTITIAL_UPDATE
        self.interstitialUpdateListener = player.ads.theoAds?.addEventListener(type: THEOadsEventTypes.INTERSTITIAL_UPDATE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received InterstitialUpdate event from THEOplayer.ads.theoAds") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                forwardedTHEOadsEvent([
                    THEOADS_EVENT_PROP_TYPE: EVENT_TYPE_INTERSTITIAL_UPDATE,
                    THEOADS_EVENT_PROP_INTERSTITIAL: THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(event.interstitial)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialUpdate listener attached to THEOplayer.ads.theoAds") }
        
        // INTERSTITIAL_ERROR
        self.interstitialErrorListener = player.ads.theoAds?.addEventListener(type: THEOadsEventTypes.INTERSTITIAL_ERROR) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received InterstitialError event from THEOplayer.ads.theoAds") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                var interstitialData: [String: Any] = [:]
                interstitialData[THEOADS_EVENT_PROP_TYPE] = EVENT_TYPE_INTERSTITIAL_ERROR
                interstitialData[THEOADS_EVENT_PROP_INTERSTITIAL] = THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(event.interstitial)
                if let errorMessage = event.message {
                    interstitialData[THEOADS_EVENT_PROP_MESSAGE] = errorMessage
                }
                forwardedTHEOadsEvent(interstitialData)
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialError listener attached to THEOplayer.ads.theoAds") }
        
#endif
    }

    private func dettachListeners() {
        guard let player = self.player else {
            return
        }

#if canImport(THEOplayerTHEOadsIntegration)
        // ADD_INTERSTITIAL
        if let addInterstitialListener = self.addInterstitialListener {
            player.ads.theoAds?.removeEventListener(
                type: THEOadsEventTypes.ADD_INTERSTITIAL,
                listener: addInterstitialListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddInterstitial listener detached from THEOplayer.ads.theoAds") }
        }
        
        // INTERSTITIAL_BEGIN
        if let interstitialBeginListener = self.interstitialBeginListener {
            player.ads.theoAds?.removeEventListener(
                type: THEOadsEventTypes.INTERSTITIAL_BEGIN,
                listener: interstitialBeginListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialBegin listener detached from THEOplayer.ads.theoAds") }
        }
        
        // INTERSTITIAL_END
        if let interstitialEndListener = self.interstitialEndListener {
            player.ads.theoAds?.removeEventListener(
                type: THEOadsEventTypes.INTERSTITIAL_END,
                listener: interstitialEndListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialEnd listener detached from THEOplayer.ads.theoAds") }
        }
        
        // INTERSTITIAL_UPDATE
        if let interstitialUpdateListener = self.interstitialUpdateListener {
            player.ads.theoAds?.removeEventListener(
                type: THEOadsEventTypes.INTERSTITIAL_UPDATE,
                listener: interstitialUpdateListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialUpdate listener detached from THEOplayer.ads.theoAds") }
        }
        
        // INTERSTITIAL_ERROR
        if let interstitialErrorListener = self.interstitialErrorListener {
            player.ads.theoAds?.removeEventListener(
                type: THEOadsEventTypes.INTERSTITIAL_ERROR,
                listener: interstitialErrorListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] InterstitialError listener detached from THEOplayer.ads.theoAds") }
        }
#endif

    }
}
