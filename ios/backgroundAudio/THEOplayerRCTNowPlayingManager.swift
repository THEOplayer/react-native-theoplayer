// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTNowPlayingManager {
    // MARK: Members
    private weak var player: THEOplayer?
    private var nowPlayingInfo = [String : Any]()
    
    // MARK: player Listeners
    private var durationChangeListener: EventListener?
    private var playingListener: EventListener?
    private var pauseListener: EventListener?
    private var rateChangeListener: EventListener?
    private var seekedListener: EventListener?
    private var sourceChangeListener: EventListener?
    
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
    
    func updateNowPlaying() {
        // Reset any existing playing info
        self.nowPlayingInfo = [:]
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        
        // Gather new playing info
        if let player = self.player,
           let sourceDescription = player.source,
           let metadata = sourceDescription.metadata {
            let artWorkUrlString = self.getArtWorkUrlStringFromSourceDescription(sourceDescription)
            DispatchQueue.global().async {
                self.nowPlayingInfo = [String : Any]()
                self.updatePlaybackState()
                self.updateTitle(metadata.title)
                self.updateSubtitle(metadata.metadataKeys?["subtitle"] as? String)
                self.updateDuration(player.duration)
                self.updateMediaType() // video
                self.updateArtWork(artWorkUrlString)
                self.updatePlaybackRate(player.playbackRate)
                self.updateServiceIdentifier(metadata.metadataKeys?["nowPlayingServiceIdentifier"] as? String)
                self.updateContentIdentifier(metadata.metadataKeys?["nowPlayingContentIdentifier"] as? String)
                self.updateCurrentTime { [weak self] in
                    if let welf = self {
                        MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                        if DEBUG_NOWINFO { print("[NATIVE] NowPlayingInfoCenter Updated.") }
                    }
                }
            }
        }
    }
    
    private func getArtWorkUrlStringFromSourceDescription(_ sourceDescription: SourceDescription) -> String? {
        if let posterUrlString = sourceDescription.poster?.absoluteString {
            return posterUrlString
        }
        
        if let metadata = sourceDescription.metadata,
           let displayIconUrlString = metadata.metadataKeys?["displayIconUri"] as? String {
            return displayIconUrlString
        }
        
        return nil
    }
    
    private func updateTitle(_ metadataTitle: String?) {
        if let title = metadataTitle {
            self.nowPlayingInfo[MPMediaItemPropertyTitle] = title
        }
    }
    
    private func updateSubtitle(_ metadataSubtitle: String?) {
        if let subtitle = metadataSubtitle {
            self.nowPlayingInfo[MPMediaItemPropertyArtist] = subtitle
        }
    }
    
    private func updateDuration(_ playerDuration: Double?) {
        if let duration = playerDuration {
            self.nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = duration.isInfinite
            if (!duration.isInfinite) {
                self.nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
            }
        }
    }
    
    private func updateServiceIdentifier(_ serviceId: String?) {
        if let id = serviceId {
            self.nowPlayingInfo[MPNowPlayingInfoPropertyServiceIdentifier] = id
        }
    }
    
    private func updateContentIdentifier(_ contentId: String?) {
        if let id = contentId {
            self.nowPlayingInfo[MPNowPlayingInfoPropertyExternalContentIdentifier] = id
        }
    }
    
    private func updateMediaType() {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyMediaType] = NSNumber(value: 2)
    }
    
    private func updatePlaybackState() {
        if #available(iOS 13.0, tvOS 13.0, *) {
            if let player = self.player {
                MPNowPlayingInfoCenter.default().playbackState = player.paused ? MPNowPlayingPlaybackState.paused : MPNowPlayingPlaybackState.playing
            }
        }
    }
    
    private func updateArtWork(_ urlString: String?) {
        if let artUrlString = urlString,
           let artUrl = URL(string: artUrlString),
           let displayIconData = try? Data(contentsOf: artUrl),
           let displayIcon = UIImage(data: displayIconData) {
            self.nowPlayingInfo[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: displayIcon.size) { size in
                return displayIcon
            }
        }
    }
    
    private func updatePlaybackRate(_ playerPlaybackRate: Double) {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = NSNumber(value: playerPlaybackRate)
    }
    
    private func updateCurrentTime(completion: (() -> Void)?) {
        if let player = self.player {
            player.requestCurrentTime(completionHandler: { [weak self] time, error in
                if let welf = self,
                   let currentTime = time {
                    welf.nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = NSNumber(value: currentTime)
                    DispatchQueue.main.async {
                        completion?()
                    }
                }
            })
        }
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self] event in
            if let welf = self,
               let duration = player.duration {
                welf.nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = duration.isInfinite
                if (!duration.isInfinite) {
                    welf.nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
                    MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                    if DEBUG_NOWINFO { print("[NATIVE] DURATION_CHANGE: Duration updated on NowPlayingInfoCenter.") }
                }
            }
        }
        
        // PLAYING
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING) { [weak self] event in
            self?.updatePlaybackState()
            self?.updateCurrentTime { [weak self] in
                if let welf = self {
                    MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                    if DEBUG_NOWINFO { print("[NATIVE] PLAYING: PlaybackState and time updated on NowPlayingInfoCenter.") }
                }
            }
        }
        
        // PAUSE
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE) { [weak self] event in
            self?.updatePlaybackState()
            self?.updateCurrentTime { [weak self] in
                if let welf = self {
                    MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                    if DEBUG_NOWINFO { print("[NATIVE] PAUSED: PlaybackState and time updated on NowPlayingInfoCenter.") }
                }
            }
        }
                                          
        
        // RATE_CHANGE
        self.rateChangeListener = player.addEventListener(type: PlayerEventTypes.RATE_CHANGE) { [weak self] event in
            if let welf = self {
                welf.nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = NSNumber(value: player.playbackRate)
                MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                if DEBUG_NOWINFO { print("[NATIVE] RATE_CHANGE: PlaybackRate updated on NowPlayingInfoCenter.") }
            }
        }
        
        // SEEKED
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED) { [weak self] event in
            self?.updateCurrentTime { [weak self] in
                if let welf = self {
                    MPNowPlayingInfoCenter.default().nowPlayingInfo = welf.nowPlayingInfo
                    if DEBUG_NOWINFO { print("[NATIVE] SEEKED: Time updated on NowPlayingInfoCenter.") }
                }
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            self?.updateNowPlaying()
            if DEBUG_NOWINFO { print("[NATIVE] SOURCE_CHANGE: Full update on NowPlayingInfoCenter.") }
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
        
        // PLAYING
        if let playingListener = self.playingListener {
            player.removeEventListener(type: PlayerEventTypes.PLAYING, listener: playingListener)
        }
        
        // PAUSE
        if let pauseListener = self.pauseListener {
            player.removeEventListener(type: PlayerEventTypes.PAUSE, listener: pauseListener)
        }
        
        // RATE_CHANGE
        if let rateChangeListener = self.rateChangeListener {
            player.removeEventListener(type: PlayerEventTypes.RATE_CHANGE, listener: rateChangeListener)
        }
        
        // SEEKED
        if let seekedListener = self.seekedListener {
            player.removeEventListener(type: PlayerEventTypes.SEEKED, listener: seekedListener)
        }
        
        // SOURCE_CHANGE
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
        }
    }
}