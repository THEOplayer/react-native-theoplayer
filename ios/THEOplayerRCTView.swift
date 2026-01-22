// THEOplayerRCTView.swift

import Foundation
import UIKit
import THEOplayerSDK

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif
#if canImport(THEOplayerGoogleIMAIntegration)
import THEOplayerGoogleIMAIntegration
import GoogleInteractiveMediaAds
#endif
#if canImport(THEOplayerGoogleCastIntegration)
import THEOplayerGoogleCastIntegration
#endif
#if canImport(THEOplayerMillicastIntegration)
import THEOplayerMillicastIntegration
#endif
#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let SAFE_AREA_INSET_OFFSET: CGFloat = 47.0

public class THEOplayerRCTView: UIView {
    // MARK: Members
    public private(set) var player: THEOplayer?
    public private(set) var mainEventHandler: THEOplayerRCTMainEventHandler
    public private(set) var broadcastEventHandler: THEOplayerRCTBroadcastEventHandler
    var textTrackEventHandler: THEOplayerRCTTextTrackEventHandler
    var mediaTrackEventHandler: THEOplayerRCTMediaTrackEventHandler
    var deviceEventHandler: THEOplayerRCTDeviceEventHandler
    var metadataTrackEventHandler: THEOplayerRCTSideloadedMetadataTrackEventHandler
    var adEventHandler: THEOplayerRCTAdsEventHandler
    var theoliveEventHandler: THEOplayerRCTTHEOliveEventHandler
    var theoadsEventHandler: THEOplayerRCTTHEOadsEventHandler
    var castEventHandler: THEOplayerRCTCastEventHandler
    var presentationModeManager: THEOplayerRCTPresentationModeManager
    var backgroundAudioManager: THEOplayerRCTBackgroundAudioManager
    var nowPlayingManager: THEOplayerRCTNowPlayingManager
    var remoteCommandsManager: THEOplayerRCTRemoteCommandsManager
    var pipManager: THEOplayerRCTPipManager
    var pipControlsManager: THEOplayerRCTPipControlsManager
    var isApplicationInBackground: Bool = (UIApplication.shared.applicationState == .background)
    
    var adsConfig = AdsConfig()
    var castConfig = CastConfig()
    var uiConfig = UIConfig()
    var theoliveConfig = THEOliveConfig()
    
    public var bypassDropInstanceOnReactLifecycle = false // controls superView detaching behaviour
    
    // integrations
    #if canImport(THEOplayerTHEOadsIntegration)
    var THEOadsIntegration: THEOplayerTHEOadsIntegration.THEOadsIntegration?
    #endif
    #if canImport(THEOplayerGoogleIMAIntegration)
    var imaIntegration: THEOplayerGoogleIMAIntegration.GoogleImaIntegration?
    #endif
    #if canImport(THEOplayerGoogleCastIntegration)
    var castIntegration: THEOplayerGoogleCastIntegration.CastIntegration?
    #endif
    #if canImport(THEOplayerMillicastIntegration)
    var millicastIntegration: THEOplayerMillicastIntegration.MillicastIntegration?
    #endif
    #if canImport(THEOplayerTHEOliveIntegration)
    var THEOliveIntegration: THEOplayerTHEOliveIntegration.THEOliveIntegration?
    #endif

    var mediaControlConfig = MediaControlConfig() {
        didSet {
            self.remoteCommandsManager.setMediaControlConfig(mediaControlConfig)
        }
    }
    var pipConfig = PipConfig() {
        didSet {
            self.pipControlsManager.setPipConfig(pipConfig)
        }
    }
    var backgroundAudioConfig = BackgroundAudioConfig() {
          didSet {
              self.backgroundAudioManager.updateInterruptionNotifications()
              self.backgroundAudioManager.updateAVAudioSessionMode()
          }
      }

    // MARK: Events
    var onNativePlayerReady: RCTDirectEventBlock?
    var onNativePlayerStateSync: RCTDirectEventBlock?
    
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
        self.deviceEventHandler = THEOplayerRCTDeviceEventHandler()
        self.metadataTrackEventHandler = THEOplayerRCTSideloadedMetadataTrackEventHandler()
        self.adEventHandler = THEOplayerRCTAdsEventHandler()
        self.theoliveEventHandler = THEOplayerRCTTHEOliveEventHandler()
        self.theoadsEventHandler = THEOplayerRCTTHEOadsEventHandler()
        self.castEventHandler = THEOplayerRCTCastEventHandler()
        self.presentationModeManager = THEOplayerRCTPresentationModeManager()
        self.backgroundAudioManager = THEOplayerRCTBackgroundAudioManager()
        self.nowPlayingManager = THEOplayerRCTNowPlayingManager()
        self.remoteCommandsManager = THEOplayerRCTRemoteCommandsManager()
        self.pipManager = THEOplayerRCTPipManager()
        self.pipControlsManager = THEOplayerRCTPipControlsManager()
        super.init(frame: .zero)
        
        self.setupAppStateObservers()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("[NATIVE] init(coder:) has not been implemented")
    }
    
    func willUnmount() {
        if DEBUG_PRESENTATIONMODES {PrintUtils.printLog(logText: "[NATIVE] willUnmount with presentationMode: \(self.presentationModeManager.presentationMode._rawValue)")}
        
        // before destruction, make sure the view reparenting is reset when player was put in fullscreen
        if self.presentationModeManager.presentationMode == .fullscreen {
            if DEBUG_PRESENTATIONMODES { PrintUtils.printLog(logText: "[NATIVE] presentationMode is fullscreen => back to inline for player unmount.") }
            self.setPresentationMode(newPresentationMode: PresentationMode.inline)
        }
    }
  
    deinit {
        self.clearAppStateObservers()
        
        self.mainEventHandler.destroy()
        self.textTrackEventHandler.destroy()
        self.mediaTrackEventHandler.destroy()
        self.deviceEventHandler.destroy()
        self.adEventHandler.destroy()
        self.theoliveEventHandler.destroy()
        self.theoadsEventHandler.destroy()
        self.castEventHandler.destroy()
        self.nowPlayingManager.destroy()
        self.remoteCommandsManager.destroy()
        self.pipManager.destroy()
        self.pipControlsManager.destroy()
        self.presentationModeManager.destroy()
        self.backgroundAudioManager.destroy()
      
        self.destroyBackgroundAudio()
        self.player?.removeAllIntegrations()
        self.player = nil
        
        if DEBUG_THEOPLAYER_INTERACTION { PrintUtils.printLog(logText: "[NATIVE] THEOplayer instance destroyed.") }
    }
    
    // MARK: - View Layout
    
    override public func layoutSubviews() {
        super.layoutSubviews()
        if let player = self.player {
            player.frame = self.frame
            player.autoresizingMask = [.flexibleBottomMargin, .flexibleHeight, .flexibleLeftMargin, .flexibleRightMargin, .flexibleTopMargin, .flexibleWidth]
            
            self.presentationModeManager.validateLayout()
        }
    }
    
    public override func removeFromSuperview() {
        if !bypassDropInstanceOnReactLifecycle {
            super.removeFromSuperview()
        }
    }
    
    public override func willMove(toSuperview: UIView?) {
        if bypassDropInstanceOnReactLifecycle && toSuperview == nil {
            return
        }
        super.willMove(toSuperview: toSuperview)
    }
    
    override public var safeAreaInsets: UIEdgeInsets {
#if os(iOS)
        // When in fullscreen mode, we need to provide some insets
        // to avoid content being obscured by notches or home indicators.
        if self.presentationModeManager.presentationMode == .fullscreen,
           let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            let orientation = windowScene.interfaceOrientation
            let isPortrait = orientation.rawValue <= 2
            let verticalInset = isPortrait ? SAFE_AREA_INSET_OFFSET: 0.0
            let horizontalInset = isPortrait ? 0.0: SAFE_AREA_INSET_OFFSET
            return UIEdgeInsets.init(top: verticalInset, left: horizontalInset, bottom: verticalInset, right: horizontalInset)
        }
#endif
        // When inline, the THEOplayerView itself should be possitioned correctly by the customer,
        // taking into account their app's safe areas, so no explicit safe area insets needed.
        // On tvOS no insets required.
        return .zero
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
            self.theoliveEventHandler.setPlayer(player)
            self.theoadsEventHandler.setPlayer(player)
            self.castEventHandler.setPlayer(player)
            self.nowPlayingManager.setPlayer(player)
            self.remoteCommandsManager.setPlayer(player)
            self.pipControlsManager.setPlayer(player)
            self.presentationModeManager.setPlayer(player, view: self)
            self.backgroundAudioManager.setPlayer(player, view: self)
            self.pipManager.setView(view: self)
            // Attach player to view
            player.addAsSubview(of: self)
        }
    }
    
    private func initPlayer() -> THEOplayer? {
        let config = THEOplayerConfigurationBuilder()
        config.pip = self.playerPipConfiguration()
        config.hlsDateRange = self.hlsDateRange
        config.license = self.license
        config.licenseUrl = self.licenseUrl
        self.player = THEOplayer(configuration: config.build())
        
        self.initAdsIntegration()
        self.initCastIntegration()
        self.initTHEOadsIntegration()
        self.initTHEOliveIntegration()
        self.initMillicastIntegration()
        self.initBackgroundAudio()
        self.initPip()
        return self.player
    }
    
    public func notifyNativePlayerReady() {
        DispatchQueue.main.async {
            let versionString = THEOplayer.version
            if let forwardedNativeReady = self.onNativePlayerReady {
                var payload: [String: Any] = [:]
                
                // pass initial player state
                payload["state"] = self.collectPlayerStatePayload()
                
                // pass version onfo
                payload["version"] = [
                    "version": versionString,
                    "playerSuiteVersion": versionString
                ]
                
                forwardedNativeReady(payload)
            }
        }
    }
    
    private func collectPlayerStatePayload() -> [String:Any] {
        guard let player = self.player else { return [:] }
        
        // collect stored track metadata
        let trackInfo = THEOplayerRCTTrackMetadataAggregator.aggregateTrackInfo(
            player: player,
            metadataTracksInfo: self.mainEventHandler.loadedMetadataAndChapterTracksInfo
        )
        
        return THEOplayerRCTPlayerStateBuilder()
            .source(player.source)
            .currentTime(player.currentTime)
            .currentProgramDateTime(player.currentProgramDateTime)
            .paused(player.paused)
            .playbackRate(player.playbackRate)
            .duration(player.duration)
            .volume(player.volume)
            .muted(player.muted)
            .seekable(player.seekable)
            .buffered(player.buffered)
            .trackInfo(trackInfo)
            .build()
    }
    
    func processMetadataAndChapterTracks(trackDescriptions: [TextTrackDescription]?) {
      THEOplayerRCTSideloadedWebVTTProcessor.loadTrackInfoFromTrackDescriptions(trackDescriptions) { tracksInfo in
            self.mainEventHandler.setLoadedMetadataAndChapterTracksInfo(tracksInfo)
            self.metadataTrackEventHandler.setLoadedMetadataAndChapterTracksInfo(tracksInfo)
        }
    }
    
    public func syncPlayerState() {
        if let forwardedPlayerStateSync = self.onNativePlayerStateSync {
            forwardedPlayerStateSync(["state": self.collectPlayerStatePayload()])
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
        self.parseMediaControlConfig(configDict: configDict)
        self.parseTHEOliveConfig(configDict: configDict)
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] config prop updated.") }
        
        // Given the bridged config, create the initial THEOplayer instance
        self.createPlayer()
        
        // Notify that the player is prepared for usage
        self.notifyNativePlayerReady()
    }
    
    // MARK: - VIEW event bridging
    
    @objc(setOnNativePlayerReady:)
    func setOnNativePlayerReady(nativePlayerReady: @escaping RCTDirectEventBlock) {
        self.onNativePlayerReady = nativePlayerReady
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePlayerReady prop set.") }
    }
    
    @objc(setOnNativePlayerStateSync:)
    func setonNativePlayerStateSync(nativePlayerStateSync: @escaping RCTDirectEventBlock) {
        self.onNativePlayerStateSync = nativePlayerStateSync
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativePlayerStateSync prop set.") }
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
    
    @objc(setOnNativeDimensionChange:)
    func setOnNativeDimensionChange(nativeDimensionChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeDimensionChange = nativeDimensionChange
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeDimensionChange prop set.") }
    }
  
    @objc(setOnNativeVideoResize:)
    func setOnNativeVideoResize(nativeVideoResize: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeVideoResize = nativeVideoResize
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeVideoResize prop set.") }
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
    
    // MARK: - Observer based device event bridging
    
    @objc(setOnNativeDeviceOrientationChanged:)
    func setOnNativeDeviceOrientationChanged(nativeDeviceOrientationChanged: @escaping RCTDirectEventBlock) {
        self.deviceEventHandler.onNativeDeviceOrientationChanged = nativeDeviceOrientationChanged
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeDeviceOrientationChanged prop set.") }
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
    
    // MARK: - Listener based THEOLIVE event bridging
    
    @objc(setOnNativeTHEOliveEvent:)
    func setOnNativeTHEOliveEvent(nativeTHEOliveEvent: @escaping RCTDirectEventBlock) {
        self.theoliveEventHandler.onNativeTHEOliveEvent = nativeTHEOliveEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeTHEOliveEvent prop set.") }
    }
    
    // MARK: - Listener based THEOADS event bridging
    
    @objc(setOnNativeTHEOadsEvent:)
    func setOnNativeTHEOadsEvent(nativeTHEOadsEvent: @escaping RCTDirectEventBlock) {
        self.theoadsEventHandler.onNativeTHEOadsEvent = nativeTHEOadsEvent
        if DEBUG_VIEW { PrintUtils.printLog(logText: "[NATIVE] nativeTHEOadsEvent prop set.") }
    }
}
