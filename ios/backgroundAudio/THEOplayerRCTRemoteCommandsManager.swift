// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

let DEFAULT_SKIP_INTERVAL: UInt = 15

class THEOplayerRCTRemoteCommandsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    private var isLive: Bool = false
    private var inAd: Bool = false
    private var backgroundaudioConfig = BackgroundAudioConfig()
    
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
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player;
        self.initRemoteCommands()
        
        // attach listeners
        self.attachListeners()
    }
    
    func setBackGroundAudioConfig(_ newBackgroundAudioConfig: BackgroundAudioConfig) {
        self.backgroundaudioConfig = newBackgroundAudioConfig
        self.updateRemoteCommands()
    }
    
    private func initRemoteCommands() {
        self.isLive = false
        self.inAd = false
        let commandCenter = MPRemoteCommandCenter.shared()
        
        commandCenter.playCommand.isEnabled = true
        commandCenter.pauseCommand.isEnabled = true
        commandCenter.togglePlayPauseCommand.isEnabled = true
        commandCenter.stopCommand.isEnabled = true
        commandCenter.changePlaybackPositionCommand.isEnabled = true
        
        // PLAY
        commandCenter.playCommand.addTarget(self, action: #selector(onPlayCommand(_:)))
        // PAUSE
        commandCenter.pauseCommand.addTarget(self, action: #selector(onPauseCommand(_:)))
        // PLAY/PAUSE
        commandCenter.togglePlayPauseCommand.addTarget(self, action: #selector(onTogglePlayPauseCommand(_:)))
        // STOP
        commandCenter.stopCommand.addTarget(self, action: #selector(onStopCommand(_:)))
        // SCRUBBER
        commandCenter.changePlaybackPositionCommand.addTarget(self, action: #selector(onScrubCommand(_:)))
        // ADD SEEK FORWARD
        commandCenter.skipForwardCommand.preferredIntervals = [NSNumber(value: DEFAULT_SKIP_INTERVAL)]
        commandCenter.skipForwardCommand.addTarget(self, action: #selector(onSkipForwardCommand(_:)))
        // ADD SEEK BACKWARD
        commandCenter.skipBackwardCommand.preferredIntervals = [NSNumber(value: DEFAULT_SKIP_INTERVAL)]
        commandCenter.skipBackwardCommand.addTarget(self, action: #selector(onSkipBackwardCommand(_:)))
        
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands initialised.") }
    }
    
    func updateRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        // update the enabled state to have correct visual representation in the lockscreen
        commandCenter.playCommand.isEnabled = !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.pauseCommand.isEnabled = !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.togglePlayPauseCommand.isEnabled = !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.stopCommand.isEnabled = !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.changePlaybackPositionCommand.isEnabled = !self.isLive && !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.skipForwardCommand.isEnabled = !self.isLive && !self.inAd && self.backgroundaudioConfig.enabled
        commandCenter.skipBackwardCommand.isEnabled = !self.isLive && !self.inAd && self.backgroundaudioConfig.enabled
        
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands updated for \(self.isLive ? "LIVE" : "VOD") (\(self.inAd ? "AD IS PLAYING" : "NO AD PLAYING"), \(self.backgroundaudioConfig.enabled ? "BGAUDIO ENABLED" : "BGAUDIO DISABLED") ).") }
    }
    
    @objc private func onPlayCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd,
           player.paused {
            player.play()
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command not handled.") }
        }
        return .success
    }
    
    @objc private func onPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd,
           !player.paused {
            player.pause()
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Pause command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Pause command not handled.") }
        }
        return .success
    }
    
    @objc private func onTogglePlayPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd {
            if player.paused {
                player.play()
            } else {
                player.pause()
            }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggle play/pause command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggle play/pause command not handled.") }
        }
        return .success
    }
    
    @objc private func onStopCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd {
            if !player.paused {
                player.pause()
            }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Stop command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Stop command not handled.") }
        }
        return .success
    }
    
    @objc private func onScrubCommand(_ event: MPChangePlaybackPositionCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.isLive,
           !self.inAd {
            player.setCurrentTime(event.positionTime)
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Scrub command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Scrub command not handled.") }
        }
        return .success
    }
    
    @objc private func onSkipForwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.isLive,
           !self.inAd {
            player.requestCurrentTime(completionHandler: { time, error in
                if let currentTime = time {
                    player.setCurrentTime(currentTime + event.interval)
                }
            })
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command not handled.") }
        }
        return .success
    }
    
    @objc private func onSkipBackwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player ,
           !self.isLive,
           !self.inAd {
            player.requestCurrentTime(completionHandler: { time, error in
                if let currentTime = time {
                    player.setCurrentTime(currentTime - event.interval)
                }
            })
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command not handled.") }
        }
        return .success
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if let duration = event.duration {
                self?.isLive = duration.isInfinite
                self?.updateRemoteCommands()
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            self?.isLive = false
            self?.inAd = false
            self?.updateRemoteCommands()
        }
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
        
        // ADBREAK_BEGIN
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN) { [weak self] event in
            self?.inAd = true
            self?.updateRemoteCommands()
        }
        
        // ADBREAK_END
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END) { [weak self] event in
            self?.inAd = false
            self?.updateRemoteCommands()
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
        
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
        
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
