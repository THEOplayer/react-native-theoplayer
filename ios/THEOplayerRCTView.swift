// THEOplayerRCTView.swift

import Foundation
import UIKit
import THEOplayerSDK
 
class THEOplayerRCTView: UIView {
    // MARK: Members
    var player: THEOplayer?
    var mainEventHandler: THEOplayerRCTMainEventHandler
    var textTrackEventHandler: THEOplayerRCTTextTrackEventHandler
    var mediaTrackEventHandler: THEOplayerRCTMediaTrackEventHandler
    var adEventHandler: THEOplayerRCTAdsEventHandler
    var castEventHandler: THEOplayerRCTCastEventHandler
    var adsConfig = AdsConfig()
    var castConfig = CastConfig()
    
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
        
        super.init(frame: .zero)
        
        self.createPlayer()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("[NATIVE] init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
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
            // Attach player to view
            player.addAsSubview(of: self)
        }
    }
    
#if os(iOS)
    private func initPlayer() -> THEOplayer? {
        let stylePath = Bundle.main.path(forResource:"style", ofType: "css")
        let cssPaths = stylePath != nil ? [stylePath!] : []
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        cssPaths: cssPaths,
                                                                        pip: nil,
                                                                        ads: self.playerAdsConfiguration(),
                                                                        cast: self.playerCastConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl))
        return self.player
    }
#else
    private func initPlayer() -> THEOplayer? {
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        ads: self.playerAdsConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl,
                                                                        pip: nil))
        return self.player
    }
#endif
    
    // MARK: - Destrpy Player
    
    func destroyPlayer() {
        self.mainEventHandler.destroy()
        self.textTrackEventHandler.destroy()
        self.mediaTrackEventHandler.destroy()
        self.adEventHandler.destroy()
        self.castEventHandler.destroy()
        
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
    
    @objc(setOnNativeLoadedMetadata:)
    func setOnNativeLoadedMetadata(nativeLoadedMetadata: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedMetadata = nativeLoadedMetadata
        if DEBUG_VIEW { print("[NATIVE] nativeLoadedMetadata prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerWillPresent:)
    func setOnNativeFullscreenPlayerWillPresent(nativeFullscreenPlayerWillPresent: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerWillPresent = nativeFullscreenPlayerWillPresent
        if DEBUG_VIEW { print("[NATIVE] nativeFullscreenPlayerWillPresent prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerDidPresent:)
    func setOnNativeFullscreenPlayerDidPresent(nativeFullscreenPlayerDidPresent: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerDidPresent = nativeFullscreenPlayerDidPresent
        if DEBUG_VIEW { print("[NATIVE] nativeFullscreenPlayerDidPresent prop set.") }
    }

    @objc(setOnNativeFullscreenPlayerWillDismiss:)
    func setOnNativeFullscreenPlayerWillDismiss(nativeFullscreenPlayerWillDismiss: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerWillDismiss = nativeFullscreenPlayerWillDismiss
        if DEBUG_VIEW { print("[NATIVE] nativeFullscreenPlayerWillDismiss prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerDidDismiss:)
    func setOnNativeFullscreenPlayerDidDismiss(nativeFullscreenPlayerDidDismiss: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerDidDismiss = nativeFullscreenPlayerDidDismiss
        if DEBUG_VIEW { print("[NATIVE] nativeFullscreenPlayerDidDismiss prop set.") }
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
