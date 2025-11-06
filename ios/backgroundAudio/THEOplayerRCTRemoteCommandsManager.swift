// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTRemoteCommandsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    private var isLive: Bool = false
    private var inAd: Bool = false
    private var hasSource: Bool = false
    private var mediaControlConfig = MediaControlConfig()
    
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
    
    func setMediaControlConfig(_ newMediaControlConfig: MediaControlConfig) {
        self.mediaControlConfig = newMediaControlConfig
        self.updateRemoteCommands()
    }
    
    private func initRemoteCommands() {
        self.isLive = false
        self.inAd = false
        self.hasSource = false
        let commandCenter = MPRemoteCommandCenter.shared()
        
        commandCenter.playCommand.isEnabled = false
        commandCenter.pauseCommand.isEnabled = false
        commandCenter.togglePlayPauseCommand.isEnabled = false
        commandCenter.stopCommand.isEnabled = false
        commandCenter.changePlaybackPositionCommand.isEnabled = false
        commandCenter.skipForwardCommand.isEnabled = false
        commandCenter.skipBackwardCommand.isEnabled = false
        commandCenter.previousTrackCommand.isEnabled = false
        commandCenter.nextTrackCommand.isEnabled = false
        
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
        commandCenter.skipForwardCommand.preferredIntervals = [NSNumber(value: self.mediaControlConfig.skipForwardInterval)]
        commandCenter.skipForwardCommand.addTarget(self, action: #selector(onSkipForwardCommand(_:)))
        // ADD SEEK BACKWARD
        commandCenter.skipBackwardCommand.preferredIntervals = [NSNumber(value: self.mediaControlConfig.skipBackwardInterval)]
        commandCenter.skipBackwardCommand.addTarget(self, action: #selector(onSkipBackwardCommand(_:)))
        // ADD NEXT TRACK
        commandCenter.nextTrackCommand.addTarget(self, action: #selector(onNextTrackCommand(_:)))
        // ADD PREVIOUS TRACK
        commandCenter.previousTrackCommand.addTarget(self, action: #selector(onPreviousTrackCommand(_:)))
        
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands initialised.") }
    }
    
    func updateRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        let skipControlsEnabled = self.hasSource && !self.inAd && !self.isLive
        let playPauseControlsEnabled = self.hasSource && !self.inAd && (!self.isLive || mediaControlConfig.allowLivePlayPause)
        
        // update the enabled state to have correct visual representation in the lockscreen
        commandCenter.pauseCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.playCommand.isEnabled = playPauseControlsEnabled
        commandCenter.togglePlayPauseCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.stopCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.changePlaybackPositionCommand.isEnabled =  skipControlsEnabled
        commandCenter.skipForwardCommand.isEnabled =  skipControlsEnabled
        commandCenter.skipBackwardCommand.isEnabled =  skipControlsEnabled
        commandCenter.nextTrackCommand.isEnabled = skipControlsEnabled
        commandCenter.previousTrackCommand.isEnabled = skipControlsEnabled
        
        // set configured skip forward/backward intervals
        commandCenter.skipForwardCommand.preferredIntervals = [NSNumber(value: self.mediaControlConfig.skipForwardInterval)]
        commandCenter.skipBackwardCommand.preferredIntervals = [NSNumber(value: self.mediaControlConfig.skipBackwardInterval)]
        
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands updated for \(self.isLive ? "LIVE" : "VOD") (ALLOWLIVEPLAYPAUSE: \(mediaControlConfig.allowLivePlayPause)) (\(self.inAd ? "AD IS PLAYING" : "NO AD PLAYING")).") }
    }
    
    @objc private func onPlayCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd {
            if self.isLive && self.mediaControlConfig.seekToLiveOnResume {
                if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Seek to live.") }
                player.currentTime = .infinity
            }
            player.play()
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command not handled.") }
        }
        return .success
    }
    
    @objc private func onPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !self.inAd {
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
                if self.isLive && self.mediaControlConfig.seekToLiveOnResume {
                    if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Seek to live.") }
                    player.currentTime = .infinity
                }
                if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggled to playing.") }
                player.play()
            } else {
                if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggled to paused.") }
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
           !self.isLive || mediaControlConfig.enableControlsForLive,
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
           !self.isLive || mediaControlConfig.enableControlsForLive,
           !self.inAd {
            player.currentTime = player.currentTime + event.interval
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command not handled.") }
        }
        return .success
    }
    
    @objc private func onSkipBackwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player ,
           !self.isLive || mediaControlConfig.enableControlsForLive,
           !self.inAd {
            player.currentTime = player.currentTime - event.interval
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command not handled.") }
        }
        return .success
    }
    
    @objc private func onPreviousTrackCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           self.mediaControlConfig.convertSkipToSeek,
           !self.isLive || mediaControlConfig.enableControlsForLive,
           !self.inAd {
            player.currentTime = player.currentTime - Double(self.mediaControlConfig.skipBackwardInterval)
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] previous track command handled as skip backward command.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] previous track command not handled.") }
        }
        return .success
    }
    
    @objc private func onNextTrackCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           self.mediaControlConfig.convertSkipToSeek,
           !self.isLive || mediaControlConfig.enableControlsForLive,
           !self.inAd {
            player.currentTime = player.currentTime + Double(self.mediaControlConfig.skipForwardInterval)
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] next track command handled as skip forward command.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] next track command not handled.") }
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
            self?.hasSource = (event.source != nil)
            self?.updateRemoteCommands()
        }
        
#if canImport(THEOplayerGoogleIMAIntegration)
        
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
