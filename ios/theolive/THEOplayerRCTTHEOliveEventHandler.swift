// THEOplayerRCTTHEOliveEventHandler.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let EVENT_TYPE_DISTRIBUTION_LOAD_START: String = "distributionloadstart"
let EVENT_TYPE_DISTRIBUTION_LOADED: String = "distributionloaded"
let EVENT_TYPE_DISTRIBUTION_OFFLINE: String = "distributionoffline"
let EVENT_TYPE_ENDPOINT_LOADED: String = "endpointloaded"
let EVENT_TYPE_INTENT_TO_FALLBACK: String = "intenttofallback"

let THEOLIVE_EVENT_PROP_TYPE: String = "type"
let THEOLIVE_EVENT_PROP_DISTRIBUTION_ID: String = "distributionId"
let THEOLIVE_EVENT_PROP_DISTRIBUTION: String = "distribution"
let THEOLIVE_EVENT_PROP_ENDPOINT: String = "endpoint"
let THEOLIVE_EVENT_PROP_REASON: String = "reason"

class THEOplayerRCTTHEOliveEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?

    // MARK: Events
    var onNativeTHEOliveEvent: RCTDirectEventBlock?

    // MARK: THEOlive Listeners
    private var distributionLoadStartListener: EventListener?
    private var distributionLoadedListener: EventListener?
    private var distributionOfflineListener: EventListener?
    private var endPointLoadedListener: EventListener?
    private var intentToFallbackListener: EventListener?

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

#if canImport(THEOplayerTHEOliveIntegration)
        // DISTRIBUTION_LOAD_START
        self.distributionLoadStartListener = player.theoLive?.addEventListener(type: THEOliveEventTypes.DISTRIBUTION_LOAD_START) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received DistributionLoadStart event from THEOlive") }
            if let forwardedTHEOliveEvent = self?.onNativeTHEOliveEvent {
                forwardedTHEOliveEvent([
                    THEOLIVE_EVENT_PROP_TYPE: EVENT_TYPE_DISTRIBUTION_LOAD_START,
                    THEOLIVE_EVENT_PROP_DISTRIBUTION_ID: event.distributionId
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionLoadStart listener attached to THEOplayer.theolive") }


        // DISTRIBUTION_LOADED
        self.distributionLoadedListener = player.theoLive?.addEventListener(type: THEOliveEventTypes.DISTRIBUTION_LOADED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received DistributionLoaded event from THEOlive") }
            if let forwardedTHEOliveEvent = self?.onNativeTHEOliveEvent {
                forwardedTHEOliveEvent([
                    THEOLIVE_EVENT_PROP_TYPE: EVENT_TYPE_DISTRIBUTION_LOADED,
                    THEOLIVE_EVENT_PROP_DISTRIBUTION: THEOplayerRCTTHEOliveEventAdapter.fromDistribution(distribution: event.distribution)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionOffline listener attached to THEOplayer.theolive") }


        // DISTRIBUTION_OFFLINE
        self.distributionOfflineListener = player.theoLive?.addEventListener(type: THEOliveEventTypes.DISTRIBUTION_OFFLINE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received DistributionOffline event from THEOlive") }
            if let forwardedTHEOliveEvent = self?.onNativeTHEOliveEvent {
                forwardedTHEOliveEvent([
                    THEOLIVE_EVENT_PROP_TYPE: EVENT_TYPE_DISTRIBUTION_OFFLINE,
                    THEOLIVE_EVENT_PROP_DISTRIBUTION_ID: event.distributionId
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionOffline listener attached to THEOplayer.theolive") }
        
        // ENDPOINT_LOADED
        self.endPointLoadedListener = player.theoLive?.addEventListener(type: THEOliveEventTypes.ENDPOINT_LOADED) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received EndPointLoaded event from THEOlive") }
            if let forwardedTHEOliveEvent = self?.onNativeTHEOliveEvent {
                forwardedTHEOliveEvent([
                    THEOLIVE_EVENT_PROP_TYPE: EVENT_TYPE_ENDPOINT_LOADED,
                    THEOLIVE_EVENT_PROP_ENDPOINT: THEOplayerRCTTHEOliveEventAdapter.fromEndpoint(endpoint: event.endpoint)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] EndPointLoaded listener attached to THEOplayer.theolive") }

        // INTENT_TO_FALLBACK
        self.intentToFallbackListener = player.theoLive?.addEventListener(type: THEOliveEventTypes.INTENT_TO_FALLBACK) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received IntentToFallback event from THEOlive") }
            if let forwardedTHEOliveEvent = self?.onNativeTHEOliveEvent {
                forwardedTHEOliveEvent([
                    THEOLIVE_EVENT_PROP_TYPE: EVENT_TYPE_INTENT_TO_FALLBACK,
                    THEOLIVE_EVENT_PROP_REASON: THEOplayerRCTTHEOliveEventAdapter.fromReason(reason: event.reason)
                ])
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] IntentToFallback listener attached to THEOplayer.theolive") }
#endif
    }

    private func dettachListeners() {
        guard let player = self.player else {
            return
        }

#if canImport(THEOplayerTHEOliveIntegration)
        // DISTRIBUTION_LOAD_START
        if let distributionLoadStartListener = self.distributionLoadStartListener {
            player.theoLive?.removeEventListener(
                type: THEOliveEventTypes.DISTRIBUTION_LOAD_START,
                listener: distributionLoadStartListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionLoadStart listener detached from THEOplayer.theolive") }
        }

        // DISTRIBUTION_LOADED
        if let distributionLoadedListener = self.distributionLoadedListener {
            player.theoLive?.removeEventListener(
                type: THEOliveEventTypes.DISTRIBUTION_LOADED,
                listener: distributionLoadedListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionLoaded listener detached from THEOplayer.theolive") }
        }

        // DISTRIBUTION_OFFLINE
        if let distributionOfflineListener = self.distributionOfflineListener {
            player.theoLive?.removeEventListener(
                type: THEOliveEventTypes.DISTRIBUTION_OFFLINE,
                listener: distributionOfflineListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] DistributionOffline listener detached from THEOplayer.theolive") }
        }
        
        // ENDPOINT_LOADED
        if let endPointLoadedListener = self.endPointLoadedListener {
            player.theoLive?.removeEventListener(
                type: THEOliveEventTypes.ENDPOINT_LOADED,
                listener: endPointLoadedListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] EndPointLoaded listener detached from THEOplayer.theolive") }
        }
        
        // INTENT_TO_FALLBACK
        if let intentToFallbackListener = self.intentToFallbackListener {
            player.theoLive?.removeEventListener(
                type: THEOliveEventTypes.INTENT_TO_FALLBACK,
                listener: intentToFallbackListener
            )
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] IntentToFallback listener detached from THEOplayer.theolive") }
        }
        
#endif

    }
}
