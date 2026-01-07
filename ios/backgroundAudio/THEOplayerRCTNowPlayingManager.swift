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
        
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Destroy, nowPlayingInfo cleared on infoCenter.") }
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player;
        
        // attach listeners
        self.attachListeners()
    }
    
    func printCurrentNowPlayingInfo() {
        Task { @MainActor [weak self] in
            if let info = MPNowPlayingInfoCenter.default().nowPlayingInfo {
                PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO] MPNowPlayingInfoCenter.default().nowPlayingInfo = ")
                info.forEach { (key: String, value: Any) in
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO]   -> \(key): \(value)")
                }
                if let player = self?.player {
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO] playerInfo = ")
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO]   -> currentTime: \(player.currentTime)")
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO]   -> playbackRate: \(player.playbackRate)")
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO]   -> paused: \(player.paused)")
                    PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO CURRENT INFO]   -> duration: \(player.duration ?? -1)")
                }
            }
        }
    }
    
    func updateNowPlaying() {
        // Reset any existing playing info
        self.nowPlayingInfo = [:]
        
        // Gather new playing info
        if let player = self.player,
           let sourceDescription = player.source,
           let metadata = sourceDescription.metadata {
            let artWorkUrlString = self.getArtWorkUrlStringFromSourceDescription(sourceDescription)
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
        } else {
            self.clearNowPlayingOnInfoCenter()
        }
    }
    
    private func processNowPlayingToInfoCenter() {
        let nowPlayingInfo = self.nowPlayingInfo
        if !nowPlayingInfo.isEmpty {
            Task { @MainActor in
                MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] nowPlayingInfo processed to infoCenter.") }
                
                if DEBUG_NOWINFO {
                    self.printCurrentNowPlayingInfo()
                }
            }
        } else {
            self.clearNowPlayingOnInfoCenter()
        }
    }
    
    private func clearNowPlayingOnInfoCenter() {
        Task { @MainActor in
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] clearing nowPlayingInfo (to nil) on infoCenter.") }
            
            if DEBUG_NOWINFO {
                self.printCurrentNowPlayingInfo()
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
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] title [\(title)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateArtist(_ metadataArtist: String?) {
        if let artist = metadataArtist {
            self.nowPlayingInfo[MPMediaItemPropertyArtist] = artist
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] artist [\(artist)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateAlbum(_ metadataAlbum: String?) {
        if let album = metadataAlbum {
            self.nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] album [\(album)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateSubtitle(_ metadataSubtitle: String?) {
        if let subtitle = metadataSubtitle {
            self.nowPlayingInfo[MPMediaItemPropertyArtist] = subtitle
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] subtitle [\(subtitle)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateServiceIdentifier(_ serviceId: String?) {
        if let serviceId = serviceId {
            self.nowPlayingInfo[MPNowPlayingInfoPropertyServiceIdentifier] = serviceId
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] serviceId [\(serviceId)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateContentIdentifier(_ contentId: String?) {
        if let contentId = contentId {
            self.nowPlayingInfo[MPNowPlayingInfoPropertyExternalContentIdentifier] = contentId
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] contentId [\(contentId)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateMediaType() {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyMediaType] = NSNumber(value: 2)
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] mediaType [hardcoded 2, for video] stored in nowPlayingInfo.") }
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
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Artwork stored in nowPlayingInfo.") }
                } else {
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Failed to store artwork in nowPlayingInfo.") }
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
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] playbackrate [\(playerPlaybackRate)] stored in nowPlayingInfo.") }
    }
    
    private func updateCurrentTime(_ currentTime: Double) {
        self.nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = NSNumber(value: currentTime)
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] currentTime [\(currentTime)] stored in nowPlayingInfo.") }
    }
    
    private func updateDuration(_ duration: Double?) {
        if let duration = duration {
            let isLiveStream = duration.isInfinite
            self.nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = isLiveStream
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] isLiveStream [\(isLiveStream)] stored in nowPlayingInfo.") }
            if !isLiveStream {
                self.nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = NSNumber(value: duration)
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] duration [\(duration)] stored in nowPlayingInfo.") }
            }
        }
    }
    
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // DURATION_CHANGE
        self.durationChangeListener = player.addEventListener(type: PlayerEventTypes.DURATION_CHANGE) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] DURATION_CHANGE") }
            if let welf = self,
               let wplayer = player,
               let duration = wplayer.duration {
                welf.updateDuration(duration)
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // PLAYING
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] PLAYING") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // PAUSE
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] PAUSE") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(0)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        
        // RATE_CHANGE
        self.rateChangeListener = player.addEventListener(type: PlayerEventTypes.RATE_CHANGE) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] RATE_CHANGE") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // SEEKED
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] SEEKED") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingToInfoCenter()
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] SOURCE_CHANGE \(event.source == nil ? "to nil" : "")") }
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
