// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

let DEFAULT_SKIP_INTERVAL: UInt = 15

class THEOplayerRCTRemoteCommandsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    
    // MARK: player Listeners
    private var durationChangeListener: EventListener?
    private var sourceChangeListener: EventListener?
    
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
    
    private func initRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        commandCenter.playCommand.isEnabled = true
        commandCenter.pauseCommand.isEnabled = true
        commandCenter.togglePlayPauseCommand.isEnabled = true
        commandCenter.stopCommand.isEnabled = true
        
        // PLAY
        commandCenter.playCommand.addTarget(self, action: #selector(onPlayCommand(_:)))
        // PAUSE
        commandCenter.pauseCommand.addTarget(self, action: #selector(onPauseCommand(_:)))
        // PLAY/PAUSE
        commandCenter.togglePlayPauseCommand.addTarget(self, action: #selector(onTogglePlayPauseCommand(_:)))
        // STOP
        commandCenter.stopCommand.addTarget(self, action: #selector(onStopCommand(_:)))
        
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Remote commands initialised.") }
    }
    
    private func updateRemoteCommands(isLive: Bool = false) {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        // enable triackplay commands only for non-linear playback
        commandCenter.skipForwardCommand.isEnabled = !isLive
        commandCenter.skipBackwardCommand.isEnabled = !isLive
        
        if isLive {
            // REMOVE SKIP FORWARD
            commandCenter.skipForwardCommand.removeTarget(self)
            // REMOVE SKIP BACKWARD
            commandCenter.skipBackwardCommand.removeTarget(self)
            
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Remote commands updated to linear playback") }
        } else {
            // ADD SEEK FORWARD
            commandCenter.skipForwardCommand.preferredIntervals = [NSNumber(value: DEFAULT_SKIP_INTERVAL)]
            commandCenter.skipForwardCommand.addTarget(self, action: #selector(onSkipForwardCommand(_:)))
            // ADD SEEK BACKWARD
            commandCenter.skipBackwardCommand.preferredIntervals = [NSNumber(value: DEFAULT_SKIP_INTERVAL)]
            commandCenter.skipBackwardCommand.addTarget(self, action: #selector(onSkipBackwardCommand(_:)))
            
            
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Remote commands updated to non-linear playback") }
        }
    }
    
    @objc private func onPlayCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           player.paused {
            player.play()
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Play command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Play command Failed.") }
        return .commandFailed
    }
    
    @objc private func onPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player,
           !player.paused {
            player.pause()
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Pause command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Pause command Failed.") }
        return .commandFailed
    }
    
    @objc private func onTogglePlayPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player {
            if player.paused {
                player.play()
            } else {
                player.pause()
            }
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Toggle play/pause command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Toggle play/pause command Failed.") }
        return .commandFailed
    }
    
    @objc private func onStopCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player {
            if !player.paused {
                player.pause()
            }
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Stop command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Stop command Failed.") }
        return .commandFailed
    }
    
    @objc private func onSkipForwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player {
            player.requestCurrentTime(completionHandler: { time, error in
                if let currentTime = time {
                    player.setCurrentTime(currentTime + event.interval)
                }
            })
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Skip forward command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Skip forward command Failed.") }
        return .commandFailed
    }
    
    @objc private func onSkipBackwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        if let player = self.player {
            player.requestCurrentTime(completionHandler: { time, error in
                if let currentTime = time {
                    player.setCurrentTime(currentTime - event.interval)
                }
            })
            if DEBUG_REMOTECOMMANDS { print("[NATIVE] Skip backward command triggered.") }
            return .success
        }
        if DEBUG_REMOTECOMMANDS { print("[NATIVE] Skip backward command Failed.") }
        return .commandFailed
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if let duration = event.duration {
                self?.updateRemoteCommands(isLive: duration.isInfinite)
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            self?.updateRemoteCommands()
        }
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
    }
    
}
