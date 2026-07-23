// THEOplayerRCTNowPlayingManager.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

class THEOplayerRCTNowPlayingManager {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: THEOplayerRCTView?
    private let nowPlayingQueue = DispatchQueue(label: "com.theoplayer.reactnative.nowplayinginfo")
    private var nowPlayingInfoStorage = [String : Any]()
    private var nowPlayingInfoGeneration: Int = 0
    
    // MARK: computed
    private var mediaSessionEnabled: Bool {
        self.view?.mediaControlConfig.mediaSessionEnabled ?? DEFAULT_MEDIA_SESSION_ENABLED
    }
    
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
            self.processNowPlayingInfoToInfoCenter()
        }
        
        // clear nowPlayingInfo
        self.clearNowPlayingInfoStorage()
        self.clearNowPlayingInfoOnInfoCenter()
        
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Destroy, nowPlayingInfo cleared on infoCenter.") }
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer, view: THEOplayerRCTView?) {
        self.player = player;
        self.view = view
        
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
    
    func updateNowPlayingInfo() {
        // Reset any existing playing info; this invalidates any artwork fetch still in flight
        let generation = self.clearNowPlayingInfoStorage()
        
        // Gather new playing info
        if let player = self.player,
           let sourceDescription = player.source,
           let metadata = sourceDescription.metadata {
            let artWorkUrlString = self.getArtWorkUrlStringFromSourceDescription(sourceDescription)
            self.updateTitle(metadata.title)
            self.updateSubtitleOrArtist(subtitle: metadata.metadataKeys?["subtitle"] as? String,
                                        artist: metadata.metadataKeys?["artist"] as? String)
            self.updateAlbum(metadata.metadataKeys?["album"] as? String)
            self.updateDuration(player.duration)
            self.updateMediaType() // video
            self.updatePlaybackRate(player.playbackRate)
            self.updateServiceIdentifier(metadata.metadataKeys?["nowPlayingServiceIdentifier"] as? String)
            self.updateContentIdentifier(metadata.metadataKeys?["nowPlayingContentIdentifier"] as? String)
            self.updateCurrentTime(player.currentTime)
            self.updateArtWork(artWorkUrlString, generation: generation) { [weak self] in
                self?.processNowPlayingInfoToInfoCenter()
            }
        } else {
            self.clearNowPlayingInfoOnInfoCenter()
        }
    }
    
    // MARK: - thread safe nowPlayingInfo access
    // nowPlayingInfoStorage is touched both from the main thread (player event listeners,
    // updateNowPlayingInfo, destroy) and from the URLSession delegate queue (artwork fetch
    // completion). All access is serialized through nowPlayingQueue to avoid corrupting
    // the dictionary storage.
    //
    // nowPlayingInfoGeneration identifies the source the storage is currently describing.
    // It is bumped on every clear, so an artwork fetch that completes after a source change
    // (or after the info was cleared) can detect that it is stale and skip both its write
    // and the publication to the info center.
    private func setNowPlayingInfoStorage(_ key: String, _ value: Any?) {
        self.nowPlayingQueue.sync { self.nowPlayingInfoStorage[key] = value }
    }
    
    // Writes only when the generation is still current; returns false when stale.
    private func setNowPlayingInfoStorage(_ key: String, _ value: Any?, ifGeneration generation: Int) -> Bool {
        self.nowPlayingQueue.sync {
            guard generation == self.nowPlayingInfoGeneration else {
                return false
            }
            self.nowPlayingInfoStorage[key] = value
            return true
        }
    }
    
    private func isCurrentNowPlayingInfoGeneration(_ generation: Int) -> Bool {
        self.nowPlayingQueue.sync { generation == self.nowPlayingInfoGeneration }
    }
    
    private func getNowPlayingInfoStorage() -> [String : Any] {
        self.nowPlayingQueue.sync { self.nowPlayingInfoStorage }
    }
    
    @discardableResult
    private func clearNowPlayingInfoStorage() -> Int {
        self.nowPlayingQueue.sync {
            self.nowPlayingInfoStorage = [:]
            self.nowPlayingInfoGeneration += 1
            return self.nowPlayingInfoGeneration
        }
    }
    
    private func processNowPlayingInfoToInfoCenter() {
        guard self.mediaSessionEnabled else { return }
        let nowPlayingInfo = self.getNowPlayingInfoStorage()
        if !nowPlayingInfo.isEmpty {
            Task { @MainActor in
                MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
                if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] nowPlayingInfo processed to infoCenter.") }
                
                if DEBUG_NOWINFO {
                    self.printCurrentNowPlayingInfo()
                }
            }
        } else {
            self.clearNowPlayingInfoOnInfoCenter()
        }
    }
    
    private func clearNowPlayingInfoOnInfoCenter() {
        guard self.mediaSessionEnabled else { return }
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
            self.setNowPlayingInfoStorage(MPMediaItemPropertyTitle, title)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] title [\(title)] stored in nowPlayingInfo.") }
        }
    }
    
    // MPMediaItemPropertyArtist holds the secondary line shown below the title. An audio
    // stream typically describes it through an artist, while a video stream has no artist but
    // can provide a subtitle (e.g. title "My Series" with subtitle "ep.8: My Episode Title").
    // Only one of both can be displayed, so the subtitle takes precedence when both are set.
    private func updateSubtitleOrArtist(subtitle metadataSubtitle: String?, artist metadataArtist: String?) {
        if let subtitleOrArtist = metadataSubtitle ?? metadataArtist {
            self.setNowPlayingInfoStorage(MPMediaItemPropertyArtist, subtitleOrArtist)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] subtitle/artist [\(subtitleOrArtist)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateAlbum(_ metadataAlbum: String?) {
        if let album = metadataAlbum {
            self.setNowPlayingInfoStorage(MPMediaItemPropertyAlbumTitle, album)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] album [\(album)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateServiceIdentifier(_ serviceId: String?) {
        if let serviceId = serviceId {
            self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyServiceIdentifier, serviceId)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] serviceId [\(serviceId)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateContentIdentifier(_ contentId: String?) {
        if let contentId = contentId {
            self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyExternalContentIdentifier, contentId)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] contentId [\(contentId)] stored in nowPlayingInfo.") }
        }
    }
    
    private func updateMediaType() {
        self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyMediaType, NSNumber(value: 2))
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] mediaType [hardcoded 2, for video] stored in nowPlayingInfo.") }
    }
    
    private func updateArtWork(_ urlString: String?, generation: Int, completion: (() -> Void)?) {
        if let artUrlString = urlString,
           let artUrl = URL(string: artUrlString) {
            let dataTask = URLSession.shared.dataTask(with: artUrl) { [weak self] (data, _, _) in
                guard let welf = self else {
                    return
                }
                if let displayIconData = data,
                   let displayIcon = UIImage(data: displayIconData) {
                    let artWork = MPMediaItemArtwork(boundsSize: displayIcon.size) { size in
                        return displayIcon
                    }
                    guard welf.setNowPlayingInfoStorage(MPMediaItemPropertyArtwork, artWork, ifGeneration: generation) else {
                        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Artwork arrived for an outdated source, discarding it.") }
                        return
                    }
                    if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Artwork stored in nowPlayingInfo.") }
                } else {
                    guard welf.isCurrentNowPlayingInfoGeneration(generation) else {
                        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] Artwork failed for an outdated source, discarding it.") }
                        return
                    }
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
        self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyPlaybackRate, NSNumber(value: playerPlaybackRate))
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] playbackrate [\(playerPlaybackRate)] stored in nowPlayingInfo.") }
    }
    
    private func updateCurrentTime(_ currentTime: Double) {
        self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyElapsedPlaybackTime, NSNumber(value: currentTime))
        if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] currentTime [\(currentTime)] stored in nowPlayingInfo.") }
    }
    
    private func updateDuration(_ duration: Double?) {
        if let duration = duration {
            let isLiveStream = duration.isInfinite
            self.setNowPlayingInfoStorage(MPNowPlayingInfoPropertyIsLiveStream, isLiveStream)
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO] isLiveStream [\(isLiveStream)] stored in nowPlayingInfo.") }
            if !isLiveStream {
                self.setNowPlayingInfoStorage(MPMediaItemPropertyPlaybackDuration, NSNumber(value: duration))
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
                welf.processNowPlayingInfoToInfoCenter()
            }
        }
        
        // PLAYING
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] PLAYING") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingInfoToInfoCenter()
            }
        }
        
        // PAUSE
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] PAUSE") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(0)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingInfoToInfoCenter()
            }
        }
        
        
        // RATE_CHANGE
        self.rateChangeListener = player.addEventListener(type: PlayerEventTypes.RATE_CHANGE) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] RATE_CHANGE") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingInfoToInfoCenter()
            }
        }
        
        // SEEKED
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED) { [weak self, weak player] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] SEEKED") }
            if let welf = self,
               let wplayer = player {
                welf.updatePlaybackRate(wplayer.playbackRate)
                welf.updateCurrentTime(wplayer.currentTime)
                welf.processNowPlayingInfoToInfoCenter()
            }
        }
        
        // SOURCE_CHANGE
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { [weak self] event in
            if DEBUG_NOWINFO { PrintUtils.printLog(logText: "[NATIVE][NOWPLAYINGINFO-EVENT] SOURCE_CHANGE \(event.source == nil ? "to nil" : "")") }
            self?.updateNowPlayingInfo()
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
