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
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received DistributionLoadStart event from THEOlive") }
            if let forwardedTHEOadsEvent = self?.onNativeTHEOadsEvent {
                forwardedTHEOadsEvent([
                    THEOADS_EVENT_PROP_TYPE: EVENT_TYPE_ADD_INTERSTITIAL,
                    THEOADS_EVENT_PROP_INTERSTITIAL: THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(interstitial: event.interstitial)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AddInterstitial listener attached to THEOplayer.ads.theoAds") }
        
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
        
#endif

    }
}
