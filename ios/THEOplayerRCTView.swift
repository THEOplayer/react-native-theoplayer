// THEOplayerRCTView.swift

import Foundation
import UIKit
import THEOplayerSDK
 
public class THEOplayerRCTView: UIView {
    // MARK: Members
    public private(set) var player: THEOplayer?
    public private(set) var mainEventHandler: THEOplayerRCTMainEventHandler
    public private(set) var broadcastEventHandler: THEOplayerRCTBroadcastEventHandler
    var textTrackEventHandler: THEOplayerRCTTextTrackEventHandler
    var mediaTrackEventHandler: THEOplayerRCTMediaTrackEventHandler
    var metadataTrackEventHandler: THEOplayerRCTSideloadedMetadataTrackEventHandler
    var adEventHandler: THEOplayerRCTAdsEventHandler
    var castEventHandler: THEOplayerRCTCastEventHandler
    var presentationModeManager: THEOplayerRCTPresentationModeManager
    var nowPlayingManager: THEOplayerRCTNowPlayingManager
    var remoteCommandsManager: THEOplayerRCTRemoteCommandsManager
    var pipControlsManager: THEOplayerRCTPipControlsManager
    var adsConfig = AdsConfig()
    var castConfig = CastConfig()
    var uiConfig = UIConfig()
    
    var pipConfig = PipConfig() {
        didSet {
            self.pipControlsManager.setPipConfig(pipConfig)
        }
    }
    var backgroundAudioConfig = BackgroundAudioConfig() {
        didSet {
            self.remoteCommandsManager.setBackGroundAudioConfig(backgroundAudioConfig)
        }
    }

    // MARK: Events
    var onNativePlayerReady: RCTDirectEventBlock?
    
    // MARK: Bridged props
    private var license: String?
    private var licenseUrl: String?
    private var chromeless: Bool = true
    private var hlsDateRange: Bool = false
    
    // MARK: - Initialisation / view setup
    init() {
        // create event handlers to maintain event props
        self.mainEventHandler = THEOplayerRCTMainEventHandler()
        self.broadcastEventHandler = THEOplayerRCTBroadcastEventHandler()
        self.textTrackEventHandler = THEOplayerRCTTextTrackEventHandler()
        self.mediaTrackEventHandler = THEOplayerRCTMediaTrackEventHandler()
        self.metadataTrackEventHandler = THEOplayerRCTSideloadedMetadataTrackEventHandler()
        self.adEventHandler = THEOplayerRCTAdsEventHandler()
        self.castEventHandler = THEOplayerRCTCastEventHandler()
        self.presentationModeManager = THEOplayerRCTPresentationModeManager()
        self.nowPlayingManager = THEOplayerRCTNowPlayingManager()
        self.remoteCommandsManager = THEOplayerRCTRemoteCommandsManager()
        self.pipControlsManager = THEOplayerRCTPipControlsManager()
        
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
            self.presentationModeManager.setPlayer(player, view: self)
            self.adEventHandler.setPlayer(player)
            self.castEventHandler.setPlayer(player)
            self.nowPlayingManager.setPlayer(player)
            self.remoteCommandsManager.setPlayer(player)
            self.pipControlsManager.setPlayer(player)
            // Attach player to view
            player.addAsSubview(of: self)
        }
    }
    
    private func notifyNativePlayerReady() {
        DispatchQueue.main.async {
            let versionString = THEOplayer.version
            if let forwardedNativeReady = self.onNativePlayerReady {
                forwardedNativeReady([
                    "version":  [
                        "version" : versionString,
                        "playerSuiteVersion": versionString
                    ],
                ])
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
                                                                        ui: self.playerUIConfiguration(),
                                                                        cast: self.playerCastConfiguration(),
                                                                        hlsDateRange: self.hlsDateRange,
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl))
        self.initAdsIntegration()
        self.initCastIntegration()
        self.initBackgroundAudio()
        self.initPip()
        return self.player
    }
#else
    private func initPlayer() -> THEOplayer? {
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        ads: self.playerAdsConfiguration(),
                                                                        hlsDateRange: self.hlsDateRange,
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl,
                                                                        pip: self.playerPipConfiguration(),
                                                                        ui: self.playerUIConfiguration()))
        self.initAdsIntegration()
        self.initBackgroundAudio()
        self.initPip()
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
        self.pipControlsManager.destroy()
        
        self.destroyBackgroundAudio()
        self.player?.removeAllIntegrations()
        self.player?.destroy()
        self.player = nil
        if DEBUG_THEOPLAYER_INTERACTION { PrintUtils.printLog(logText: "[NATIVE] THEOplayer instance destroyed.") }
    }
    
    func processMetadataTracks(metadataTrackDescriptions: [TextTrackDescription]?) {
        THEOplayerRCTSideloadedMetadataProcessor.loadTrackInfoFromTrackDescriptions(metadataTrackDescriptions) { tracksInfo in
            self.mainEventHandler.setLoadedMetadataTracksInfo(tracksInfo)
            self.metadataTrackEventHandler.setLoadedMetadataTracksInfo(tracksInfo)
        }
    }
    
    // MARK: - Property bridging (config)
    
    @objc(setConfig:)
    func setConfig(configDict: NSDictionary) {
        // store license info
        self.license = configDict["license"] as? String
        self.licenseUrl = configDict["licenseUrl"] as? String
        self.chromeless = configDict["chromeless"] as? Bool ?? true
        self.hlsDateRange = configDict["hlsDateRange"] as? Bool ?? false
        self.parseAdsConfig(configDict: configDict)
        self.parseCastConfig(configDict: configDict)
        self.parseUIConfig(configDict: configDict)
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] config prop updated.") }
        
        // Given the bridged config, create the initial THEOplayer instance
        self.createPlayer()
        
        // Notify that the player is prepared for usage
        self.notifyNativePlayerReady()
    }
    
    // MARK: - VIEW READY event bridging
    
    @objc(setOnNativePlayerReady:)
    func setOnNativePlayerReady(nativePlayerReady: @escaping RCTDirectEventBlock) {
        self.onNativePlayerReady = nativePlayerReady
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePlayerReady prop set.") }
    }
    
    // MARK: - Listener based MAIN event bridging
    
    @objc(setOnNativePlay:)
    func setOnNativePlay(nativePlay: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlay = nativePlay
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePlay prop set.") }
    }
    
    @objc(setOnNativePause:)
    func setOnNativePause(nativePause: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePause = nativePause
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePause prop set.") }
    }
    
    @objc(setOnNativeSourceChange:)
    func setOnNativeSourceChange(nativeSourceChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSourceChange = nativeSourceChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeSourceChange prop set.") }
    }
    
    @objc(setOnNativeLoadStart:)
    func setOnNativeLoadStart(nativeLoadStart: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadStart = nativeLoadStart
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeLoadStart prop set.") }
    }
    
    @objc(setOnNativeReadyStateChange:)
    func setOnNativeReadyStateChange(nativeReadyStateChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeReadyStateChange = nativeReadyStateChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeReadyStateChange prop set.") }
    }
    
    @objc(setOnNativeDurationChange:)
    func setOnNativeDurationChange(nativeDurationChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeDurationChange = nativeDurationChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeDurationChange prop set.") }
    }
    
    @objc(setOnNativeVolumeChange:)
    func setOnNativeVolumeChange(nativeVolumeChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeVolumeChange = nativeVolumeChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeVolumeChange prop set.") }
    }
    
    @objc(setOnNativeProgress:)
    func setOnNativeProgress(nativeProgress: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeProgress = nativeProgress
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeProgress prop set.") }
    }
    
    @objc(setOnNativeTimeUpdate:)
    func setOnNativeTimeUpdate(nativeTimeUpdate: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeTimeUpdate = nativeTimeUpdate
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeTimeUpdate prop set.") }
    }
    
    @objc(setOnNativePlaying:)
    func setOnNativePlaying(nativePlaying: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlaying = nativePlaying
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePlaying prop set.") }
    }
    
    @objc(setOnNativeSeeking:)
    func setOnNativeSeeking(nativeSeeking: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeking = nativeSeeking
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeSeeking prop set.") }
    }
    
    @objc(setOnNativeSeeked:)
    func setOnNativeSeeked(nativeSeeked: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeked = nativeSeeked
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeSeeked prop set.") }
    }
    
    @objc(setOnNativeEnded:)
    func setOnNativeEnded(nativeEnded: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeEnded = nativeEnded
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeEnded prop set.") }
    }
    
    @objc(setOnNativeError:)
    func setOnNativeError(nativeError: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeError = nativeError
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeError prop set.") }
    }
    
    @objc(setOnNativeLoadedData:)
    func setOnNativeLoadedData(nativeLoadedData: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedData = nativeLoadedData
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeLoadedData prop set.") }
    }
    
    @objc(setOnNativeRateChange:)
    func setOnNativeRateChange(nativeRateChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeRateChange = nativeRateChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeRateChange prop set.") }
    }
    
    @objc(setOnNativeLoadedMetadata:)
    func setOnNativeLoadedMetadata(nativeLoadedMetadata: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedMetadata = nativeLoadedMetadata
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeLoadedMetadata prop set.") }
    }
    
    @objc(setOnNativeWaiting:)
    func setOnNativeWaiting(nativeWaiting: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeWaiting = nativeWaiting
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeWaiting prop set.") }
    }
    
    @objc(setOnNativeCanPlay:)
    func setOnNativeCanPlay(nativeCanPlay: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeCanPlay = nativeCanPlay
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeCanPlay prop set.") }
    }
    
    // MARK: - Listener based PRESENTATIONMODE event bridging
    
    @objc(setOnNativePresentationModeChange:)
    func setOnNativePresentationModeChange(nativePresentationMode: @escaping RCTDirectEventBlock) {
        self.presentationModeManager.onNativePresentationModeChange = nativePresentationMode
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePresentationMode prop set.") }
    }
    
    // MARK: - Listener based TEXTTRACK event bridging
    
    @objc(setOnNativeTextTrackListEvent:)
    func setOnNativeTextTrackListEvent(nativeTextTrackListEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackListEvent = nativeTextTrackListEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeTextTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeTextTrackEvent:)
    func setOnNativeTextTrackEvent(nativeTextTrackEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackEvent = nativeTextTrackEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeTextTrackEvent prop set.") }
    }
    
    // MARK: - Listener based MEDIATRACK event bridging
    
    @objc(setOnNativeMediaTrackListEvent:)
    func setOnNativeMediaTrackListEvent(nativeMediaTrackListEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackListEvent = nativeMediaTrackListEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeMediaTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeMediaTrackEvent:)
    func setOnNativeMediaTrackEvent(nativeMediaTrackEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackEvent = nativeMediaTrackEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeMediaTrackEvent prop set.") }
    }
    
    // MARK: - Listener based CAST event bridging
    
    @objc(setOnNativeCastEvent:)
    func setOnNativeCastEvent(nativeCastEvent: @escaping RCTDirectEventBlock) {
        self.castEventHandler.onNativeCastEvent = nativeCastEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeCastEvent prop set.") }
    }
    
    // MARK: - Listener based AD event bridging
    
    @objc(setOnNativeAdEvent:)
    func setOnNativeAdEvent(nativeAdEvent: @escaping RCTDirectEventBlock) {
        self.adEventHandler.onNativeAdEvent = nativeAdEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeAdEvent prop set.") }
    }
}
