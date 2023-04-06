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
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
        // AD_BEGIN
        self.adBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BEGIN) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_BEGIN event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_BEGIN,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdBegin listener attached to THEOplayer.ads") }
        
        // AD_END
        self.adEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_END) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_END event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_END,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdEnd listener attached to THEOplayer.ads") }
        
        // AD_BREAK_BEGIN
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_BREAK_BEGIN event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let adBreak = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_ADBREAK_BEGIN,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adBreak)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdBreakBegin listener attached to THEOplayer.ads") }
        
        // AD_BREAK_END
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_BREAK_END event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let adBreak = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_ADBREAK_END,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adBreak)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdBreakEnd listener attached to THEOplayer.ads") }
        
        // AD_ERROR
        self.adErrorListener = player.ads.addEventListener(type: AdsEventTypes.AD_ERROR) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_ERROR event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_ERROR,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdError listener attached to THEOplayer.ads") }
        
        // AD_FIRST_QUARTILE
        self.adFirstQuartileListener = player.ads.addEventListener(type: AdsEventTypes.AD_FIRST_QUARTILE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_FIRST_QUARTILE event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_FIRST_QUARTILE,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdFirstQuartile listener attached to THEOplayer.ads") }
    
        // AD_MIDPOINT
        self.adMidpointListener = player.ads.addEventListener(type: AdsEventTypes.AD_MIDPOINT) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_MIDPOINT event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_MIDPOINT,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdMidpoint listener attached to THEOplayer.ads") }
    
        // AD_THIRD_QUARTILE
        self.adThirdQuartileListener = player.ads.addEventListener(type: AdsEventTypes.AD_THIRD_QUARTILE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_THIRD_QUARTILE event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_THIRD_QUARTILE,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdThirdQuartile listener attached to THEOplayer.ads") }
    
        // AD_LOADED
        self.adLoadedListener = player.ads.addEventListener(type: AdsEventTypes.AD_LOADED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { print("[NATIVE] Received AD_LOADED event from THEOplayer Ads") }
            if let forwardedAdEvent = self?.onNativeAdEvent,
               let ad = event.ad {
                forwardedAdEvent([
                    AD_EVENT_PROP_TYPE: EVENT_TYPE_AD_LOADED,
                    AD_EVENT_PROP_AD: THEOplayerRCTAdAggregator.aggregateAd(ad: ad)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { print("[NATIVE] AdThirdQuartile listener attached to THEOplayer.ads") }
#endif
        
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
        // AD_BEGIN
        if let adBeginListener = self.adBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BEGIN, listener: adBeginListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AdBegin listener dettached from THEOplayer.ads") }
        }
        
        // AD_END
        if let adEndListener = self.adEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_END, listener: adEndListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AdEnd listener dettached from THEOplayer.ads") }
        }
        
        // AD_BREAK_BEGIN
        if let adBreakBeginListener = self.adBreakBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AdBreakBegin listener dettached from THEOplayer.ads") }
        }
        
        // AD_BREAK_END
        if let adBreakEndListener = self.adBreakEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_END, listener: adBreakEndListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AdBreakEnd listener dettached from THEOplayer.ads") }
        }
        
        // AD_ERROR
        if let adErrorListener = self.adErrorListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_ERROR, listener: adErrorListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] AdError listener dettached from THEOplayer.ads") }
        }
        
        // AD_FIRST_QUARTILE
        if let adFirstQuartileListener = self.adFirstQuartileListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_FIRST_QUARTILE, listener: adFirstQuartileListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] adFirstQuartileListener listener dettached from THEOplayer.ads") }
        }
        
        // AD_MIDPOINT
        if let adMidpointListener = self.adMidpointListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_MIDPOINT, listener: adMidpointListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] adMidpointListener listener dettached from THEOplayer.ads") }
        }
        
        // AD_THIRD_QUARTILE
        if let adThirdQuartileListener = self.adThirdQuartileListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_THIRD_QUARTILE, listener: adThirdQuartileListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] adThirdQuartileListener listener dettached from THEOplayer.ads") }
        }
        
        // AD_LOADED
        if let adLoadedListener = self.adLoadedListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_LOADED, listener: adLoadedListener)
            if DEBUG_EVENTHANDLER { print("[NATIVE] adLoadedListener listener dettached from THEOplayer.ads") }
        }
#endif

    }
}
