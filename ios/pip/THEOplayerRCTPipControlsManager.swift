// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import AVKit
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTPipControlsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    private var isLive: Bool = false
    private var inAd: Bool = false
    private var pipConfig = PipConfig()
    
    // MARK: player Listeners
    private var durationChangeListener: EventListener?
    private var sourceChangeListener: EventListener?
    private var adBreakBeginListener: EventListener?
    private var adBreakEndListener: EventListener?
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
    }
    
    // MARK: - player en controller setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player;
        self.isLive = false
        self.inAd = false
        
        // attach listeners
        self.attachListeners()
    }
    
    func setPipConfig(_ newPipConfig: PipConfig) {
        self.pipConfig = newPipConfig
        self.updatePipControls()
    }
    
    func willStartPip() {
        if let player = self.player,
           let duration = player.duration {
            self.isLive = duration.isInfinite
#if canImport(THEOplayerGoogleIMAIntegration)
            self.inAd = player.ads.playing
            self.updatePipControls()
#else
            self.updatePipControls()
#endif
        }
    }
    
    func updatePipControls() {
        if let player = self.player,
           let pip = player.pip {
            pip.configure(configuration: self.newPipConfiguration())
            if DEBUG_PIPCONTROLS { PrintUtils.printLog(logText: "[NATIVE] Pip controls updated for \(self.isLive ? "LIVE" : "VOD"), \(self.inAd ? "AD IS PLAYING" : "NO AD PLAYING")") }
            if DEBUG_PIPCONTROLS { PrintUtils.printLog(logText: "requiresLinearPlayback = \(self.isLive || self.inAd)") }
            if DEBUG_PIPCONTROLS { PrintUtils.printLog(logText: "canStartPictureInPictureAutomaticallyFromInline = \(self.pipConfig.canStartPictureInPictureAutomaticallyFromInline)") }
            if DEBUG_PIPCONTROLS { PrintUtils.printLog(logText: "retainPresentationModeOnSourceChange = \(self.pipConfig.retainPresentationModeOnSourceChange)") }
        }
    }
    
    func newPipConfiguration() -> PiPConfiguration {
        let builder = PiPConfigurationBuilder()
        builder.retainPresentationModeOnSourceChange = false
        builder.requiresLinearPlayback = self.isLive || self.inAd
#if os(iOS)
        builder.nativePictureInPicture = true
        builder.canStartPictureInPictureAutomaticallyFromInline = self.pipConfig.canStartPictureInPictureAutomaticallyFromInline
        builder.retainPresentationModeOnSourceChange = self.pipConfig.retainPresentationModeOnSourceChange
#endif
        return builder.build()
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if let duration = event.duration {
                self?.isLive = duration.isInfinite
                self?.updatePipControls()
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            self?.isLive = false
            self?.inAd = false
            self?.updatePipControls()
        }
        
#if canImport(THEOplayerGoogleIMAIntegration)
        
        // ADBREAK_BEGIN
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN) { [weak self] event in
            self?.inAd = true
        }
        
        // ADBREAK_END
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END) { [weak self] event in
            self?.inAd = false
        }
        
#endif
        
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        if let durationChangeListener = self.durationChangeListener {
            player.removeEventListener(type: PlayerEventTypes.DURATION_CHANGE, listener: durationChangeListener)
        }
        
        // SOURCE_CHANGE
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
        }
        
#if canImport(THEOplayerGoogleIMAIntegration)
        
        // ADBREAK_BEGIN
        if let adBreakBeginListener = self.adBreakBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
        }
        
        // ADBREAK_END
        if let adBreakEndListener = self.adBreakEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_END, listener: adBreakEndListener)
        }
        
#endif
        
    }
    
}
