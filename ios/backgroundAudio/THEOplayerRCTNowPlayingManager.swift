// THEOplayerRCTNowPlayingManager.swift

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
        self.detachListeners()

        // update elapsed time on close
        if let player = self.player {
            updateCurrentTime(player.currentTime)
            self.processNowPlayingToInfoCenter()
        }
        
        // clear nowPlayingInfo
        self.nowPlayingInfo = [:]
        self.clearNowPlayingOnInfoCenter()
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
        self.clearNowPlayingOnInfoCenter()
        
        // Gather new playing info
        if let player = self.player,
           let sourceDescription = player.source,
           let metadata = sourceDescription.metadata {
            let artWorkUrlString = self.getArtWorkUrlStringFromSourceDescription(sourceDescription)
            self.updatePlaybackState()
            self.nowPlayingInfo = [String : Any]()
            self.updateTitle(metadata.title)
            self.updateArtist(metadata.metadataKeys?["artist"] as? String)
            self.updateAlbum(metadata.metadataKeys?["album"] as? String)
            self.updateSubtitle(metadata.metadataKeys?["subtitle"] as? String)
            self.updateDuration(player.duration)
            self.updateMediaType() // video
            self.updatePlaybackRate(player.playbackRate)
            self.updateServiceIdentifier(metadata.metadataKeys?["nowPlayingServiceIdentifier"] as? String)
            self.updateContentIdentifier(metadata.metadataKeys?["nowPlayingContentIdentifier"] as? String)
            self.updateCurrentTime(player.currentTime)
            self.updateArtWork(artWorkUrlString) { [weak self] in
                self?.processNowPlayingToInfoCenter()
            }
        }
    }
    
    private func processNowPlayingToInfoCenter() {
        let nowPlayingInfo = self.nowPlayingInfo
        DispatchQueue.main.async {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        }
    }

    private func clearNowPlayingOnInfoCenter() {
        DispatchQueue.main.async {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        }
    }
    
    private func processPlaybackStateToInfoCenter(paused: Bool) {
        if #available(iOS 13.0, tvOS 13.0, *) {
            DispatchQueue.main.async {
                MPNowPlayingInfoCenter.default().playbackState = paused ? MPNowPlayingPlaybackState.paused : MPNowPlayingPlaybackState.playing
            }
        }
    }
    
    private func getArtWorkUrlStringFromSourceDescription(_ sourceDescription: SourceDescription) -> String? {
        if let metadata = sourceDescription.metadata,
           let displayIconUrlString = metadata.metadataKeys?["displayIconUri"] as? String {
            return displayIconUrlString
        }
        if let posterUrlString = sourceDescription.poster?.absoluteString {
            return posterUrlString
        }
        
        return nil
    }
    
    private func updateTitle(_ metadataTitle: String?) {
        if let title = metadataTitle {
            self.nowPlayingInfo[MPMediaItemPropertyTitle] = title
        }
    }
    
    private func updateArtist(_ metadataArtist: String?) {
        if let artist = metadataArtist {
            self.nowPlayingInfo[MPMediaItemPropertyArtist] = artist
        }
    }
    
    private func updateAlbum(_ metadataAlbum: String?) {
        if let album = metadataAlbum {
            self.nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album
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
                self.processPlaybackStateToInfoCenter(paused: player.paused)
            }
        }
    }
    
    private func updateArtWork(_ urlString: String?, completion: (() -> Void)?) {
        if let artUrlString = urlString,
           let artUrl = URL(string: artUrlString) {
            let dataTask = URLSession.shared.dataTask(with: artUrl) { [weak self] (data, _, _) in
                if let displayIconData = data,
                   let displayIcon = UIImage(data: displayIconData) {
                    self?.nowPlayingInfo[MPMediaItemPropertyArtwork] = MPMediaItemArtwork(boundsSize: displayIcon.size) { size in
                        return displayIcon
                    }
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] Artwork updated in nowPlayingInfo.") }
                } else {
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] Failed to update artwork in nowPlayingInfo.") }
                }
                completion?()
            }
            dataTask.resume()
        } else {
            completion?()
        }
    }
    
    private func updatePlaybackRate(_ playerPlaybackRate: Double) {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = NSNumber(value: playerPlaybackRate)
    }
    
    private func updateCurrentTime(_ currentTime: Double) {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = NSNumber(value: currentTime)
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self, weak player] event in
            if let welf = self,
               let wplayer = player,
               let duration = wplayer.duration {
                welf.nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = duration.isInfinite
                if (!duration.isInfinite) {
                    welf.nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] DURATION_CHANGE: Updating duration on NowPlayingInfoCenter...") }
                    welf.processNowPlayingToInfoCenter()
                }
            }
        }
        
        // PLAYING
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING) { [weak self, weak player] event in
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updatePlaybackState()
                welf.updateCurrentTime(wplayer.currentTime)
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] PLAYING: Updating playbackState and time on NowPlayingInfoCenter...") }
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // PAUSE
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE) { [weak self, weak player] event in
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(0)
                welf.updatePlaybackState()
                welf.updateCurrentTime(wplayer.currentTime)
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] PAUSED: Updating PlaybackState and time on NowPlayingInfoCenter...") }
                welf.processNowPlayingToInfoCenter()
            }
        }
                                          
        
        // RATE_CHANGE
        self.rateChangeListener = player.addEventListener(type: PlayerEventTypes.RATE_CHANGE) { [weak self, weak player] event in
            if let welf = self,
               let wplayer = player {
                welf.nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = NSNumber(value: wplayer.playbackRate)
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] RATE_CHANGE: Updating playbackRate on NowPlayingInfoCenter...") }
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // SEEKED
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED) { [weak self, weak player] event in
            if let welf = self,
               let wplayer = player {
                welf.updateCurrentTime(wplayer.currentTime)
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] SEEKED: Time updated on NowPlayingInfoCenter.") }
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE] SOURCE_CHANGE: Full update on NowPlayingInfoCenter.") }
            self?.updateNowPlaying()
        }
    }
    
    private func detachListeners() {
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
