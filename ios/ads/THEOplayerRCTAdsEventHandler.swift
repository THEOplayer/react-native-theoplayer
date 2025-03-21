// THEOplayerRCTViewAdEventHandler.swift

import Foundation
import THEOplayerSDK

let AD_EVENT_PROP_TYPE: String = "type"
let AD_EVENT_PROP_AD: String = "ad"

let EVENT_TYPE_AD_BEGIN: String = "adbegin"
let EVENT_TYPE_AD_END: String = "adend"
let EVENT_TYPE_ADBREAK_BEGIN: String = "adbreakbegin"
let EVENT_TYPE_ADBREAK_END: String = "adbreakend"
let EVENT_TYPE_AD_ERROR: String = "aderror"
let EVENT_TYPE_AD_FIRST_QUARTILE: String = "adfirstquartile"
let EVENT_TYPE_AD_THIRD_QUARTILE: String = "adthirdquartile"
let EVENT_TYPE_AD_MIDPOINT: String = "admidpoint"
let EVENT_TYPE_AD_LOADED: String = "adloaded"
let EVENT_TYPE_AD_TAPPED: String = "adtapped"
let EVENT_TYPE_AD_CLICKED: String = "adclicked"

class THEOplayerRCTAdsEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?

    // MARK: Events
    var onNativeAdEvent: RCTDirectEventBlock?

    // MARK: Ad Listeners
    private var adBeginListener: EventListener?
    private var adEndListener: EventListener?
    private var adBreakBeginListener: EventListener?
    private var adBreakEndListener: EventListener?
    private var adErrorListener: EventListener?
    private var adFirstQuartileListener: EventListener?
    private var adMidpointListener: EventListener?
    private var adThirdQuartileListener: EventListener?
    private var adLoadedListener: EventListener?
    private var adTappedListener: EventListener?
    private var adClickedListener: EventListener?

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

#if canImport(THEOplayerGoogleIMAIntegration)
        // AD_BEGIN
        self.adBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BEGIN) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_BEGIN event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_BEGIN,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBegin listener attached to THEOplayer.ads") }

        // AD_END
        self.adEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_END) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_END event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_END,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdEnd listener attached to THEOplayer.ads") }

        // AD_BREAK_BEGIN
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_BREAK_BEGIN event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let adBreak = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_ADBREAK_BEGIN,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBreakBegin listener attached to THEOplayer.ads") }

        // AD_BREAK_END
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_BREAK_END event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let adBreak = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_ADBREAK_END,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBreakEnd listener attached to THEOplayer.ads") }

        // AD_ERROR
        self.adErrorListener = player.ads.addEventListener(type: AdsEventTypes.AD_ERROR) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_ERROR event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_ERROR,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdError listener attached to THEOplayer.ads") }

        // AD_FIRST_QUARTILE
        self.adFirstQuartileListener = player.ads.addEventListener(type: AdsEventTypes.AD_FIRST_QUARTILE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_FIRST_QUARTILE event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_FIRST_QUARTILE,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdFirstQuartile listener attached to THEOplayer.ads") }

        // AD_MIDPOINT
        self.adMidpointListener = player.ads.addEventListener(type: AdsEventTypes.AD_MIDPOINT) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_MIDPOINT event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_MIDPOINT,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdMidpoint listener attached to THEOplayer.ads") }

        // AD_THIRD_QUARTILE
        self.adThirdQuartileListener = player.ads.addEventListener(type: AdsEventTypes.AD_THIRD_QUARTILE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_THIRD_QUARTILE event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_THIRD_QUARTILE,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdThirdQuartile listener attached to THEOplayer.ads") }

        // AD_LOADED
        self.adLoadedListener = player.ads.addEventListener(type: AdsEventTypes.AD_LOADED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_LOADED event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_LOADED,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdLoaded listener attached to THEOplayer.ads") }

        // AD_TAPPED
        self.adTappedListener = player.ads.addEventListener(type: AdsEventTypes.AD_TAPPED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_TAPPED event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_TAPPED,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdTapped listener attached to THEOplayer.ads") }

        // AD_CLICKED
        self.adClickedListener = player.ads.addEventListener(type: AdsEventTypes.AD_CLICKED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received AD_CLICKED event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_CLICKED,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAdapter.fromAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdClicked listener attached to THEOplayer.ads") }
#endif
    }

    private func dettachListeners() {
        guard let player = self.player else {
            return
        }

#if canImport(THEOplayerGoogleIMAIntegration)
        // AD_BEGIN
        if let adBeginListener = self.adBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BEGIN, listener: adBeginListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBegin listener detached from THEOplayer.ads") }
        }

        // AD_END
        if let adEndListener = self.adEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_END, listener: adEndListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdEnd listener detached from THEOplayer.ads") }
        }

        // AD_BREAK_BEGIN
        if let adBreakBeginListener = self.adBreakBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBreakBegin listener detached from THEOplayer.ads") }
        }

        // AD_BREAK_END
        if let adBreakEndListener = self.adBreakEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_END, listener: adBreakEndListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdBreakEnd listener detached from THEOplayer.ads") }
        }

        // AD_ERROR
        if let adErrorListener = self.adErrorListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_ERROR, listener: adErrorListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] AdError listener detached from THEOplayer.ads") }
        }

        // AD_FIRST_QUARTILE
        if let adFirstQuartileListener = self.adFirstQuartileListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_FIRST_QUARTILE, listener: adFirstQuartileListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adFirstQuartileListener listener detached from THEOplayer.ads") }
        }

        // AD_MIDPOINT
        if let adMidpointListener = self.adMidpointListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_MIDPOINT, listener: adMidpointListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adMidpointListener listener detached from THEOplayer.ads") }
        }

        // AD_THIRD_QUARTILE
        if let adThirdQuartileListener = self.adThirdQuartileListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_THIRD_QUARTILE, listener: adThirdQuartileListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adThirdQuartileListener listener detached from THEOplayer.ads") }
        }

        // AD_LOADED
        if let adLoadedListener = self.adLoadedListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_LOADED, listener: adLoadedListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adLoadedListener listener detached from THEOplayer.ads") }
        }

        // AD_TAPPED
        if let adTappedListener = self.adTappedListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_TAPPED, listener: adTappedListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adTapped listener detached from THEOplayer.ads") }
        }

        // AD_CLICKED
        if let adClickedListener = self.adClickedListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_CLICKED, listener: adClickedListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] adClicked listener detached from THEOplayer.ads") }
        }
#endif

    }
}
