// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import AVKit
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTPipControlsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    private var _nativePictureInPictureController: Any?
    private var isLive: Bool = false
    private var inAd: Bool = false
    
    @available(tvOS 14.0, *)
    private weak var nativePictureInPictureController: AVPictureInPictureController? {
        get {
            return _nativePictureInPictureController as? AVPictureInPictureController
        } set {
            _nativePictureInPictureController = newValue
        }
    }
    
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
    
    @available(tvOS 14.0, *)
    func setNativePictureInPictureController(_ nativePictureInPictureController: AVPictureInPictureController?) {
        self.nativePictureInPictureController = nativePictureInPictureController;
        if self.nativePictureInPictureController != nil,
           let player = self.player,
           let duration = player.duration {
            self.isLive = duration.isInfinite
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(GoogleIMAIntegration)
            player.ads.requestPlaying(completionHandler: { adIsPlaying, error in
                self.inAd = adIsPlaying ?? false
                self.updatePipControls()
            })
#else
            self.updatePipControls()
#endif
        }
    }

    @available(tvOS 14.0, *)
    private func updatePipControls() {
        if let controller = self.nativePictureInPictureController {
            if #available(iOS 14.0, *) {
                controller.requiresLinearPlayback = self.isLive || self.inAd
                if DEBUG_PIPCONTROLS { print("[NATIVE] Pip controls updated for \(self.isLive ? "LIVE" : "VOD") (\(self.inAd ? "AD IS PLAYING" : "NO AD PLAYING")).") }
            }
        }
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if let duration = event.duration {
                self?.isLive = duration.isInfinite
                if #available(iOS 14.0, tvOS 14.0, *) {
                    self?.updatePipControls()
                }
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            self?.isLive = false
            self?.inAd = false
            if #available(iOS 14.0, tvOS 14.0, *) {
                self?.updatePipControls()
            }
        }
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(GoogleIMAIntegration)
        
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
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(GoogleIMAIntegration)
        
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
