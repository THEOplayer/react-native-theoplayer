// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTRemoteCommandsManager: NSObject {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: THEOplayerRCTView?
    private var isLive: Bool = false
    private var inAd: Bool = false
    private var hasSource: Bool = false
    private var commandsRegistered: Bool = false
    
    // MARK: player Listeners
    private var durationChangeListener: EventListener?
    private var sourceChangeListener: EventListener?
    private var adBreakBeginListener: EventListener?
    private var adBreakEndListener: EventListener?
    
    // MARK: computed
    private var mediaSessionEnabled: Bool {
        self.view?.mediaControlConfig.mediaSessionEnabled ?? DEFAULT_MEDIA_SESSION_ENABLED
    }
    private var seekToLiveOnResume: Bool {
        self.view?.mediaControlConfig.seekToLiveOnResume ?? DEFAULT_SEEK_TO_LIVE_ON_RESUME
    }
    private var skipForwardInterval: NSNumber {
        NSNumber(value: self.view?.mediaControlConfig.skipForwardInterval ?? DEFAULT_SKIP_INTERVAL)
    }
    private var skipBackwardInterval: NSNumber {
        NSNumber(value: self.view?.mediaControlConfig.skipBackwardInterval ?? DEFAULT_SKIP_INTERVAL)
    }
    private var allowLivePlayPause: Bool {
        self.view?.mediaControlConfig.allowLivePlayPause ?? DEFAULT_ALLOW_LIVE_PLAY_PAUSE
    }
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
        // remove our targets from the shared command center
        self.removeCommandTargets()
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer, view: THEOplayerRCTView?) {
        self.player = player;
        self.view = view;
        self.initRemoteCommands()
        
        // attach listeners
        self.attachListeners()
    }
    
    private func initRemoteCommands() {
        self.isLive = false
        self.inAd = false
        self.hasSource = false
        // Register/deregister targets and apply the correct enabled state based on the current config.
        // Note: MPRemoteCommandCenter is a process-wide singleton shared by all player instances, so we
        // must not touch its state here for a player that doesn't own the media session.
        self.updateRemoteCommands()
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands initialised.") }
    }

    private func addCommandTargets() {
        guard !self.commandsRegistered else { return }
        let commandCenter = MPRemoteCommandCenter.shared()
        // NOTE: play/pause/togglePlayPause are (re)registered separately via reclaimPlayPauseCommands(),
        // because the THEOplayer SDK adds its own play/pause targets to every player instance and we must
        // strip those to keep remote play/pause scoped to the active player only.
        // STOP
        commandCenter.stopCommand.addTarget(self, action: #selector(onStopCommand(_:)))
        // SCRUBBER
        commandCenter.changePlaybackPositionCommand.addTarget(self, action: #selector(onScrubCommand(_:)))
        // SEEK FORWARD
        commandCenter.skipForwardCommand.addTarget(self, action: #selector(onSkipForwardCommand(_:)))
        // SEEK BACKWARD
        commandCenter.skipBackwardCommand.addTarget(self, action: #selector(onSkipBackwardCommand(_:)))
        // NEXT TRACK
        commandCenter.nextTrackCommand.addTarget(self, action: #selector(onNextTrackCommand(_:)))
        // PREVIOUS TRACK
        commandCenter.previousTrackCommand.addTarget(self, action: #selector(onPreviousTrackCommand(_:)))
        self.commandsRegistered = true
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote command targets added.") }
    }

    /// Take exclusive ownership of the play/pause/togglePlayPause remote commands.
    ///
    /// The THEOplayer SDK registers its own play/pause handlers on the shared MPRemoteCommandCenter for
    /// EVERY player instance at creation (via initAudioSession -> setupRemoteTransportControls). With
    /// multiple players this makes a single remote play/pause control all instances. We therefore remove
    /// all targets (SDK's and any stale ones) and re-add only this active player's handlers.
    private func reclaimPlayPauseCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        commandCenter.playCommand.removeTarget(nil)
        commandCenter.pauseCommand.removeTarget(nil)
        commandCenter.togglePlayPauseCommand.removeTarget(nil)
        commandCenter.playCommand.addTarget(self, action: #selector(onPlayCommand(_:)))
        commandCenter.pauseCommand.addTarget(self, action: #selector(onPauseCommand(_:)))
        commandCenter.togglePlayPauseCommand.addTarget(self, action: #selector(onTogglePlayPauseCommand(_:)))
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Reclaimed play/pause commands from SDK for active player.") }
    }

    private func removeCommandTargets() {
        guard self.commandsRegistered else { return }
        let commandCenter = MPRemoteCommandCenter.shared()
        commandCenter.playCommand.removeTarget(self)
        commandCenter.pauseCommand.removeTarget(self)
        commandCenter.togglePlayPauseCommand.removeTarget(self)
        commandCenter.stopCommand.removeTarget(self)
        commandCenter.changePlaybackPositionCommand.removeTarget(self)
        commandCenter.skipForwardCommand.removeTarget(self)
        commandCenter.skipBackwardCommand.removeTarget(self)
        commandCenter.nextTrackCommand.removeTarget(self)
        commandCenter.previousTrackCommand.removeTarget(self)
        self.commandsRegistered = false
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote command targets removed.") }
    }
    
    private func hasActionHandler(for action: MediaControlAction) -> Bool {
        return self.view?.mediaControlManager.hasMediaControlActionHandler(for: action) ?? false
    }
    
    private func executeAction(for action: MediaControlAction) -> Bool {
        return self.view?.mediaControlManager.executeMediaControlAction(action: action) ?? false
    }
    
    func updateRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        // Only the player that owns the media session may participate. When disabled, withdraw this
        // player's command handlers entirely and leave the shared command center untouched so we don't
        // respond to remote commands nor clobber the active player's command state.
        guard self.mediaSessionEnabled else {
            self.removeCommandTargets()
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands disabled: withdrew from shared command center.") }
            return
        }
        
        // Ensure this player's command handlers are registered on the shared command center.
        self.addCommandTargets()
        // Take play/pause ownership away from the SDK's per-instance handlers so remote play/pause only
        // affects this (active) player.
        self.reclaimPlayPauseCommands()
        
        let playPauseControlsEnabled = self.hasSource && !self.inAd && (!self.isLive || self.allowLivePlayPause)
        let positionControlEnabled = self.hasSource && !self.inAd && !self.isLive
        let seekControlEnabled = self.hasSource && !self.inAd && !self.isLive && !self.hasActionHandler(for: .SKIP_TO_NEXT) && !self.hasActionHandler(for: .SKIP_TO_PREVIOUS)
        let trackControlEnabled = self.hasActionHandler(for: .SKIP_TO_NEXT) && self.hasActionHandler(for: .SKIP_TO_PREVIOUS)
        
        // update the enabled state to have correct visual representation in the lockscreen
        commandCenter.pauseCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.playCommand.isEnabled = playPauseControlsEnabled
        commandCenter.togglePlayPauseCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.stopCommand.isEnabled =  playPauseControlsEnabled
        commandCenter.changePlaybackPositionCommand.isEnabled =  positionControlEnabled
        commandCenter.skipForwardCommand.isEnabled = seekControlEnabled
        commandCenter.skipBackwardCommand.isEnabled = seekControlEnabled
        commandCenter.nextTrackCommand.isEnabled = trackControlEnabled
        commandCenter.previousTrackCommand.isEnabled = trackControlEnabled
        
        // set configured skip forward/backward intervals
        commandCenter.skipForwardCommand.preferredIntervals = [self.skipForwardInterval]
        commandCenter.skipBackwardCommand.preferredIntervals = [self.skipBackwardInterval]
        
        if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Remote commands updated for \(self.isLive ? "LIVE" : "VOD") (ALLOWLIVEPLAYPAUSE: \(self.view?.mediaControlConfig.allowLivePlayPause ?? false)) (\(self.inAd ? "AD IS PLAYING" : "NO AD PLAYING")).") }
    }
    
    @objc private func onPlayCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.inAd {
            if self.isLive && self.seekToLiveOnResume {
                if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Seek to live.") }
                player.currentTime = .infinity
            }
            if !self.executeAction(for: .PLAY) {
                if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Executing default Play action.") }
                player.play()
            }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Play command not handled.") }
        }
        return .success
    }
    
    @objc private func onPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.inAd {
            if !self.executeAction(for: .PAUSE) {
                if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Executing default Pause action.") }
                player.pause()
            }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Pause command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Pause command not handled.") }
        }
        return .success
    }
    
    @objc private func onTogglePlayPauseCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.inAd {
                if player.paused {
                    if !self.executeAction(for: .PLAY) {
                        if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Executing default Toogle play action.") }
                        if self.isLive && self.seekToLiveOnResume {
                            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Seek to live.") }
                            player.currentTime = .infinity
                        }
                        player.play()
                    }
                    if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggled to playing.") }
                } else {
                    if !self.executeAction(for: .PAUSE) {
                        if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Executing default Toogle pause action.") }
                        player.pause()
                    }
                    if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggled to paused.") }
                }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggle play/pause command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Toggle play/pause command not handled.") }
        }
        return .success
    }
    
    @objc private func onStopCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.inAd {
            if !player.paused {
                if !self.executeAction(for: .PAUSE) {
                    if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Executing default Pause action.") }
                    player.pause()
                }
            }
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Stop command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Stop command not handled.") }
        }
        return .success
    }
    
    @objc private func onScrubCommand(_ event: MPChangePlaybackPositionCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
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
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.isLive,
           !self.inAd {
            player.currentTime = player.currentTime + event.interval
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip forward command not handled.") }
        }
        return .success
    }
    
    @objc private func onSkipBackwardCommand(_ event: MPSkipIntervalCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if let player = self.player,
           !self.isLive,
           !self.inAd {
            player.currentTime = player.currentTime - event.interval
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] Skip backward command not handled.") }
        }
        return .success
    }
    
    @objc private func onPreviousTrackCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if self.executeAction(for: .SKIP_TO_PREVIOUS) {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] previous track command handled.") }
        } else {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] previous track command not handled.") }
        }
        return .success
    }
    
    @objc private func onNextTrackCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
        guard self.mediaSessionEnabled else { return .commandFailed }
        if self.executeAction(for: .SKIP_TO_NEXT) {
            if DEBUG_REMOTECOMMANDS { PrintUtils.printLog(logText: "[NATIVE] next track command handled.") }
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
