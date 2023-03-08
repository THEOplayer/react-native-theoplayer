// THEOplayerRCTView.swift

import Foundation
import UIKit
import THEOplayerSDK
 
public class THEOplayerRCTView: UIView {
    // MARK: Members
    public private(set) var player: THEOplayer?
    var mainEventHandler: THEOplayerRCTMainEventHandler
    var textTrackEventHandler: THEOplayerRCTTextTrackEventHandler
    var mediaTrackEventHandler: THEOplayerRCTMediaTrackEventHandler
    var adEventHandler: THEOplayerRCTAdsEventHandler
    var castEventHandler: THEOplayerRCTCastEventHandler
    var nowPlayingManager: THEOplayerRCTNowPlayingManager
    var remoteCommandsManager: THEOplayerRCTRemoteCommandsManager
    var adsConfig = AdsConfig()
    var castConfig = CastConfig()
    var pipConfig = PipConfig()
    var backgroundAudioConfig = BackgroundAudioConfig()
    
    // MARK: Events
    var onNativePlayerReady: RCTDirectEventBlock?
    
    // MARK: Bridged props
    private var license: String?
    private var licenseUrl: String?
    private var chromeless: Bool = true
    private var config: THEOplayerConfiguration?
    
    // MARK: - Initialisation / view setup
    init() {
        // create event handlers to maintain event props
        self.mainEventHandler = THEOplayerRCTMainEventHandler()
        self.textTrackEventHandler = THEOplayerRCTTextTrackEventHandler()
        self.mediaTrackEventHandler = THEOplayerRCTMediaTrackEventHandler()
        self.adEventHandler = THEOplayerRCTAdsEventHandler()
        self.castEventHandler = THEOplayerRCTCastEventHandler()
        self.nowPlayingManager = THEOplayerRCTNowPlayingManager()
        self.remoteCommandsManager = THEOplayerRCTRemoteCommandsManager()
        
        super.init(frame: .zero)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("[NATIVE] init(coder:) has not been implemented")
    }
    
    override public func layoutSubviews() {
        super.layoutSubviews()
        if let player = self.player {
            player.frame = self.frame
            player.autoresizingMask = [.flexibleBottomMargin, .flexibleHeight, .flexibleLeftMargin, .flexibleRightMargin, .flexibleTopMargin, .flexibleWidth]
        }
    }
    
    // MARK: - Create Player
    
    func createPlayer() {
        // Create new player instance
        if let player = self.initPlayer() {
            // Attach player instance to event handlers
            self.mainEventHandler.setPlayer(player)
            self.textTrackEventHandler.setPlayer(player)
            self.mediaTrackEventHandler.setPlayer(player)
            self.adEventHandler.setPlayer(player)
            self.castEventHandler.setPlayer(player)
            self.nowPlayingManager.setPlayer(player)
            self.remoteCommandsManager.setPlayer(player)
            // Attach player to view
            player.addAsSubview(of: self)
        }
    }
    
    private func notifyNativePlayerReady() {
        DispatchQueue.main.async {
            if let forwardedNativeReady = self.onNativePlayerReady {
                forwardedNativeReady([:])
            }
        }
    }
    
#if os(iOS)
    private func initPlayer() -> THEOplayer? {
        let stylePath = Bundle.main.path(forResource:"style", ofType: "css")
        let cssPaths = stylePath != nil ? [stylePath!] : []
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        cssPaths: cssPaths,
                                                                        pip: self.playerPipConfiguration(),
                                                                        ads: self.playerAdsConfiguration(),
                                                                        cast: self.playerCastConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl))
        self.initBackgroundAudio()
        return self.player
    }
#else
    private func initPlayer() -> THEOplayer? {
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        ads: self.playerAdsConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl,
                                                                        pip: self.playerPipConfiguration()))
        self.initBackgroundAudio()
        return self.player
    }
#endif
    
    // MARK: - Destroy Player
    
    func destroyPlayer() {
        self.mainEventHandler.destroy()
        self.textTrackEventHandler.destroy()
        self.mediaTrackEventHandler.destroy()
        self.adEventHandler.destroy()
        self.castEventHandler.destroy()
        self.nowPlayingManager.destroy()
        self.remoteCommandsManager.destroy()
        
        self.player?.destroy()
        self.player = nil
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] THEOplayer instance destroyed.") }
    }
    
    // MARK: - Property bridging (config)
    
    @objc(setConfig:)
    func setConfig(configDict: NSDictionary) {
        // store license info
        self.license = configDict["license"] as? String
        self.licenseUrl = configDict["licenseUrl"] as? String
        self.chromeless = configDict["chromeless"] as? Bool ?? true
        self.parseAdsConfig(configDict: configDict)
        self.parseCastConfig(configDict: configDict)
        if DEBUG_VIEW { print("[NATIVE] config prop updated.") }
        
        // Given the bridged config, create the initial THEOplayer instance
        self.createPlayer()
        
        // Notify that the player is prepared for usage
        self.notifyNativePlayerReady()
    }
    
    // MARK: - VIEW READY event bridging
    
    @objc(setOnNativePlayerReady:)
    func setOnNativePlayerReady(nativePlayerReady: @escaping RCTDirectEventBlock) {
        self.onNativePlayerReady = nativePlayerReady
        if DEBUG_VIEW { print("[NATIVE] nativePlayerReady prop set.") }
    }
    
    // MARK: - Listener based MAIN event bridging
    
    @objc(setOnNativePlay:)
    func setOnNativePlay(nativePlay: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlay = nativePlay
        if DEBUG_VIEW { print("[NATIVE] nativePlay prop set.") }
    }
    
    @objc(setOnNativePause:)
    func setOnNativePause(nativePause: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePause = nativePause
        if DEBUG_VIEW { print("[NATIVE] nativePause prop set.") }
    }
    
    @objc(setOnNativeSourceChange:)
    func setOnNativeSourceChange(nativeSourceChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSourceChange = nativeSourceChange
        if DEBUG_VIEW { print("[NATIVE] nativeSourceChange prop set.") }
    }
    
    @objc(setOnNativeLoadStart:)
    func setOnNativeLoadStart(nativeLoadStart: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadStart = nativeLoadStart
        if DEBUG_VIEW { print("[NATIVE] nativeLoadStart prop set.") }
    }
    
    @objc(setOnNativeReadyStateChange:)
    func setOnNativeReadyStateChange(nativeReadyStateChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeReadyStateChange = nativeReadyStateChange
        if DEBUG_VIEW { print("[NATIVE] nativeReadyStateChange prop set.") }
    }
    
    @objc(setOnNativeDurationChange:)
    func setOnNativeDurationChange(nativeDurationChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeDurationChange = nativeDurationChange
        if DEBUG_VIEW { print("[NATIVE] nativeDurationChange prop set.") }
    }
    
    @objc(setOnNativeVolumeChange:)
    func setOnNativeVolumeChange(nativeVolumeChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeVolumeChange = nativeVolumeChange
        if DEBUG_VIEW { print("[NATIVE] nativeVolumeChange prop set.") }
    }
    
    @objc(setOnNativeProgress:)
    func setOnNativeProgress(nativeProgress: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeProgress = nativeProgress
        if DEBUG_VIEW { print("[NATIVE] nativeProgress prop set.") }
    }
    
    @objc(setOnNativeTimeUpdate:)
    func setOnNativeTimeUpdate(nativeTimeUpdate: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeTimeUpdate = nativeTimeUpdate
        if DEBUG_VIEW { print("[NATIVE] nativeTimeUpdate prop set.") }
    }
    
    @objc(setOnNativePlaying:)
    func setOnNativePlaying(nativePlaying: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlaying = nativePlaying
        if DEBUG_VIEW { print("[NATIVE] nativePlaying prop set.") }
    }
    
    @objc(setOnNativeSeeking:)
    func setOnNativeSeeking(nativeSeeking: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeking = nativeSeeking
        if DEBUG_VIEW { print("[NATIVE] nativeSeeking prop set.") }
    }
    
    @objc(setOnNativeSeeked:)
    func setOnNativeSeeked(nativeSeeked: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeked = nativeSeeked
        if DEBUG_VIEW { print("[NATIVE] nativeSeeked prop set.") }
    }
    
    @objc(setOnNativeEnded:)
    func setOnNativeEnded(nativeEnded: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeEnded = nativeEnded
        if DEBUG_VIEW { print("[NATIVE] nativeEnded prop set.") }
    }
    
    @objc(setOnNativeError:)
    func setOnNativeError(nativeError: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeError = nativeError
        if DEBUG_VIEW { print("[NATIVE] nativeError prop set.") }
    }
    
    @objc(setOnNativeLoadedData:)
    func setOnNativeLoadedData(nativeLoadedData: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedData = nativeLoadedData
        if DEBUG_VIEW { print("[NATIVE] nativeLoadedData prop set.") }
    }
    
    @objc(setOnNativeRateChange:)
    func setOnNativeRateChange(nativeRateChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeRateChange = nativeRateChange
        if DEBUG_VIEW { print("[NATIVE] nativeRateChange prop set.") }
    }
    
    @objc(setOnNativeLoadedMetadata:)
    func setOnNativeLoadedMetadata(nativeLoadedMetadata: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedMetadata = nativeLoadedMetadata
        if DEBUG_VIEW { print("[NATIVE] nativeLoadedMetadata prop set.") }
    }
    
    @objc(setOnNativeWaiting:)
    func setOnNativeWaiting(nativeWaiting: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeWaiting = nativeWaiting
        if DEBUG_VIEW { print("[NATIVE] nativeWaiting prop set.") }
    }
    
    @objc(setOnNativeCanPlay:)
    func setOnNativeCanPlay(nativeCanPlay: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeCanPlay = nativeCanPlay
        if DEBUG_VIEW { print("[NATIVE] nativeCanPlay prop set.") }
    }
    
    @objc(setOnNativePresentationModeChange:)
    func setOnNativePresentationModeChange(nativePresentationMode: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePresentationModeChange = nativePresentationMode
        if DEBUG_VIEW { print("[NATIVE] nativePresentationMode prop set.") }
    }
    
    // MARK: - Listener based TEXTTRACK event bridging
    
    @objc(setOnNativeTextTrackListEvent:)
    func setOnNativeTextTrackListEvent(nativeTextTrackListEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackListEvent = nativeTextTrackListEvent
        if DEBUG_VIEW { print("[NATIVE] nativeTextTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeTextTrackEvent:)
    func setOnNativeTextTrackEvent(nativeTextTrackEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackEvent = nativeTextTrackEvent
        if DEBUG_VIEW { print("[NATIVE] nativeTextTrackEvent prop set.") }
    }
    
    // MARK: - Listener based MEDIATRACK event bridging
    
    @objc(setOnNativeMediaTrackListEvent:)
    func setOnNativeMediaTrackListEvent(nativeMediaTrackListEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackListEvent = nativeMediaTrackListEvent
        if DEBUG_VIEW { print("[NATIVE] nativeMediaTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeMediaTrackEvent:)
    func setOnNativeMediaTrackEvent(nativeMediaTrackEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackEvent = nativeMediaTrackEvent
        if DEBUG_VIEW { print("[NATIVE] nativeMediaTrackEvent prop set.") }
    }
    
    // MARK: - Listener based CAST event bridging
    
    @objc(setOnNativeCastEvent:)
    func setOnNativeCastEvent(nativeCastEvent: @escaping RCTDirectEventBlock) {
        self.castEventHandler.onNativeCastEvent = nativeCastEvent
        if DEBUG_VIEW { print("[NATIVE] nativeCastEvent prop set.") }
    }
    
    // MARK: - Listener based AD event bridging
    
    @objc(setOnNativeAdEvent:)
    func setOnNativeAdEvent(nativeAdEvent: @escaping RCTDirectEventBlock) {
        self.adEventHandler.onNativeAdEvent = nativeAdEvent
        if DEBUG_VIEW { print("[NATIVE] nativeAdEvent prop set.") }
    }
}
