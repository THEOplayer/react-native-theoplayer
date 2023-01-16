// THEOplayerRCTView.swift

import Foundation
import UIKit
import THEOplayerSDK

#if CHROMECAST
import GoogleCast
#endif
 
class THEOplayerRCTView: UIView {
    // MARK: Members
    private var player: THEOplayer?
    private var mainEventHandler: THEOplayerRCTViewMainEventHandler
    private var textTrackEventHandler: THEOplayerRCTViewTextTrackEventHandler
    private var mediaTrackEventHandler: THEOplayerRCTViewMediaTrackEventHandler
    private var adEventHandler: THEOplayerRCTViewAdEventHandler
    private var castEventHandler: THEOplayerRCTViewCastEventHandler
    
    // MARK: Bridged props
    private var src: SourceDescription?
    private var license: String?
    private var licenseUrl: String?
    private var chromeless: Bool = true
    private var config: THEOplayerConfiguration?
    private var paused: Bool = true
    private var muted: Bool = false
    private var playbackRate: Double = 1.0
    private var selectedTextTrackUid: Int = 0
    private var selectedVideoTrackUid: Int = 0
    private var selectedAudioTrackUid: Int = 0
    private var seek: Double? = nil                  // in msec
    private var fullscreen: Bool = false
    private var chromecastReceiverApplicationId: String?
    
#if os(iOS) && (CHROMECAST || AIRPLAY)
    private var castStrategy: THEOplayerSDK.CastStrategy = THEOplayerSDK.CastStrategy.manual
#endif
#if os(iOS) && ADS && (GOOGLE_IMA || GOOGLE_DAI)
    private var adSUIEnabled: Bool = true
    private var googleImaUsesNativeIma: Bool = true
    private var adPreloadType: THEOplayerSDK.AdPreloadType = .MIDROLL_AND_POSTROLL
#endif
    
    // MARK: - Initialisation / view setup
    init() {
        // create event handlers to maintain event props
        self.mainEventHandler = THEOplayerRCTViewMainEventHandler()
        self.textTrackEventHandler = THEOplayerRCTViewTextTrackEventHandler()
        self.mediaTrackEventHandler = THEOplayerRCTViewMediaTrackEventHandler()
        self.adEventHandler = THEOplayerRCTViewAdEventHandler()
        self.castEventHandler = THEOplayerRCTViewCastEventHandler()
        
        super.init(frame: .zero)
    }
    
    func destroy() {
        self.mainEventHandler.destroy()
        self.textTrackEventHandler.destroy()
        self.mediaTrackEventHandler.destroy()
        self.adEventHandler.destroy()
        self.castEventHandler.destroy()
        
        self.player?.destroy()
        self.player = nil
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] THEOplayer instance destroyed.") }
    }
    
    func ads() -> Ads? {
        guard let player = self.player else {
            return nil
        }
        return player.ads
    }
  
#if os(iOS) && (CHROMECAST || AIRPLAY)
    func cast() -> Cast? {
        guard let player = self.player else {
            return nil
        }
        return player.cast
    }
#endif
    
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
    
    // MARK: - Property bridging
    private func syncAllPlayerProps() {
        // sync stored props with player instance
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Syncing stored props with THEOplayer instance...") }
        self.syncPlayerSrc()
        self.syncPlayerPaused()
        self.syncPlayerMuted()
        self.syncPlayerPlaybackRate()
        self.syncPlayerSelectedTextTrack()
        self.syncPlayerSelectedAudioTrack()
        self.syncPlayerSelectedVideoTrack()
        self.syncPlayerSeek()
        self.syncPlayerFullscreen()
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] All props synced with THEOplayer instance.") }
    }
    
    // MARK: - Property bridging
    @objc(setSrc:)
    func setSrc(srcDict: NSDictionary) {
        // build THEOplayer SourceDescription
        if let src = THEOplayerRCTSourceDescriptionBuilder.buildSourceDescription(srcDict) {
            self.src = src
            if DEBUG_PROP_UPDATES  { print("[NATIVE] src prop updated.") }
        } else {
            if DEBUG_PROP_UPDATES  { print("[NATIVE] failed to update THEOplayer source.") }
            return
        }
        
        var isCasting = false
#if os(iOS) && (CHROMECAST || AIRPLAY)
        isCasting = self.player?.cast?.casting ?? false // TO FIX: remove 'isCasting' workaround
#endif
        
        if !isCasting || self.player == nil {
            self.player?.destroy()
            self.player = nil
            DispatchQueue.main.async {
                self.initPlayer()
                if let player = self.player {
                    // couple player instance to event handlers
                    self.mainEventHandler.setPlayer(player)
                    self.textTrackEventHandler.setPlayer(player)
					self.mediaTrackEventHandler.setPlayer(player)
                    self.adEventHandler.setPlayer(player)
                    self.castEventHandler.setPlayer(player)
                    // couple player instance to view
                    player.addAsSubview(of: self)
                }
                self.syncAllPlayerProps()
            }
        } else {
            self.syncAllPlayerProps()
        }
    }
    
    private func initPlayer() {
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] 'lazy' init THEOplayer instance") }
#if os(tvOS)
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        ads: self.initAdsConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl,
                                                                        pip: nil))
#else
        let stylePath = Bundle.main.path(forResource:"style", ofType: "css")
        let cssPaths = stylePath != nil ? [stylePath!] : []
        self.player = THEOplayer(configuration: THEOplayerConfiguration(chromeless: self.chromeless,
                                                                        cssPaths: cssPaths,
                                                                        pip: nil,
                                                                        ads: self.initAdsConfiguration(),
                                                                        cast: self.initCastConfiguration(),
                                                                        license: self.license,
                                                                        licenseUrl: self.licenseUrl))
#endif
    }

    private func initAdsConfiguration() -> AdsConfiguration? {
#if os(iOS) && ADS && (GOOGLE_IMA || GOOGLE_DAI)
        // NOTE: GoogleIMAAdsConfiguration, GoogleDAIAdsConfigurationBuilder, GoogleDAIAdsConfigurationBuilder require iOS SDK 4.5.1 or higher
        let googleIMAAdsConfiguration = GoogleIMAAdsConfiguration()
        googleIMAAdsConfiguration.useNativeIma = self.googleImaUsesNativeIma
        googleIMAAdsConfiguration.disableUI = !self.adSUIEnabled
        let daiBuilder = GoogleDAIAdsConfigurationBuilder()
        daiBuilder.disableUI = !self.adSUIEnabled
        daiBuilder.enableBackgroundPlayback = true
        let googleDaiAdsConfiguration = daiBuilder.build()
        return AdsConfiguration(showCountdown: self.adSUIEnabled,
                                preload: self.adPreloadType,
                                googleIma: googleIMAAdsConfiguration,
                                googleDai: googleDaiAdsConfiguration)
        
        // For lower iOS SDK versions replace the above with:
        /*let googleIMAConfiguration = GoogleIMAConfiguration()
        googleIMAConfiguration.useNativeIma = self.googleImaUsesNativeIma
        googleIMAConfiguration.disableUI = !self.adSUIEnabled
        return AdsConfiguration(showCountdown: self.adSUIEnabled,
                                preload: self.adPreloadType,
                                googleImaConfiguration: googleIMAConfiguration)*/
        
#elseif os(tvOS) && ADS && GOOGLE_IMA
        return AdsConfiguration()
#else
        return nil
#endif
    }

#if os(iOS)
    private func initCastConfiguration() -> CastConfiguration? {
#if CHROMECAST || AIRPLAY
        // prepare the config
        return CastConfiguration(strategy: self.castStrategy)
#else
        return nil
#endif
    }
#endif
    
    private func syncPlayerSrc() {
        // set sourceDescription on player
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Setting new source on TheoPlayer") }
        if let player = self.player {
            player.source = self.src
        }
    }
    
    @objc(setConfig:)
    func setConfig(configDict: NSDictionary) {
        // store license info
        self.license = configDict["license"] as? String
        self.licenseUrl = configDict["licenseUrl"] as? String
        self.chromeless = configDict["chromeless"] as? Bool ?? true
#if os(iOS) && ADS && (GOOGLE_IMA || GOOGLE_DAI)
        if let adsConfig = configDict["ads"] as? NSDictionary {
            self.adSUIEnabled = adsConfig["uiEnabled"] as? Bool ?? true
            if let adPreloadType = adsConfig["preload"] as? String {
                self.adPreloadType = adPreloadType == "none" ? THEOplayerSDK.AdPreloadType.NONE : THEOplayerSDK.AdPreloadType.MIDROLL_AND_POSTROLL
            }
            if let googleImaConfiguration = adsConfig["googleImaConfiguration"] as? NSDictionary {
                self.googleImaUsesNativeIma = googleImaConfiguration["useNativeIma"] as? Bool ?? true
            }
        }
#endif
#if os(iOS) && (CHROMECAST || AIRPLAY)
        if let castConfig = configDict["cast"] as? NSDictionary {
            if let castStrategy = castConfig["strategy"] as? String {
                switch castStrategy {
                case "auto":
                    self.castStrategy = THEOplayerSDK.CastStrategy.auto
                case "manual":
                    self.castStrategy = THEOplayerSDK.CastStrategy.manual
                case "disabled":
                    self.castStrategy = THEOplayerSDK.CastStrategy.disabled
                default :
                    self.castStrategy = THEOplayerSDK.CastStrategy.manual
                }
            }
            if let chromecastConfig = castConfig["chromecast"] as? NSDictionary,
                let castReceiverApplicationId = chromecastConfig["appID"] as? String {
                self.chromecastReceiverApplicationId = castReceiverApplicationId
            }
        }
#endif
        if DEBUG_PROP_UPDATES  { print("[NATIVE] config prop updated.") }
    }
    
    @objc(setPaused:)
    func setPaused(paused: Bool) {
        // store paused state
        self.paused = paused
        if DEBUG_PROP_UPDATES  { print("[NATIVE] paused prop updated.") }
        // sync player state with paused prop
        self.syncPlayerPaused()
    }
    
    private func syncPlayerPaused() {
        if let player = self.player {
            if DEBUG_THEOPLAYER_INTERACTION { print("RNView paused: \(self.paused), THEOplayer paused: \(player.paused)") }
            if self.paused && !player.paused {
                if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Triggering pause on TheoPlayer") }
                player.pause()
            } else if !self.paused && player.paused {
                if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Triggering play on TheoPlayer") }
                player.play()
            }
        }
    }
    
    @objc(setVolume:)
    func setVolume(volume: NSNumber) {
        if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Setting volume: TheoPlayer does not handle volume changes for iOS. This is handled by the device.") }
    }

    @objc(setMuted:)
    func setMuted(muted: Bool) {
        // store muted state
        self.muted = muted
        if DEBUG_PROP_UPDATES  { print("[NATIVE] muted prop updated.") }
        // sync player state with muted prop
        self.syncPlayerMuted()
    }
    
    private func syncPlayerMuted() {
        if let player = self.player {
            if player.muted != self.muted {
                if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Changing TheoPlayer to \(self.muted ? "muted" : "not muted")") }
                player.muted = self.muted
            }
        }
    }
    
    @objc(setPlaybackRate:)
    func setPlaybackRate(playbackRate: NSNumber) {
        // store playbackRate
        self.playbackRate = playbackRate.doubleValue
        if DEBUG_PROP_UPDATES  { print("[NATIVE] playbackRate prop updated.") }
        // sync player state with playbackRate prop
        self.syncPlayerPlaybackRate()
    }
    
    private func syncPlayerPlaybackRate() {
        if let player = self.player {
            if player.playbackRate != self.playbackRate {
                if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Setting playbackRate on TheoPlayer to \(self.playbackRate)") }
                player.setPlaybackRate(self.playbackRate)
            }
        }
    }
    
    @objc(setSelectedTextTrack:)
    func setSelectedTextTrack(selectedTextTrackUid: NSNumber) {
        // store selectedTextTrackUid
        self.selectedTextTrackUid = selectedTextTrackUid.intValue
        if DEBUG_PROP_UPDATES  { print("[NATIVE] selectedTextTrack prop updated.") }
        // sync player state with selectedTextTrackUid prop
        self.syncPlayerSelectedTextTrack()
    }
    
    private func syncPlayerSelectedTextTrack() {
        if let player = self.player {
            let textTracks: TextTrackList = player.textTracks
            guard textTracks.count > 0 else {
                return
            }
            if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Showing textTrack \(self.selectedTextTrackUid) on TheoPlayer") }
            for i in 0...textTracks.count-1 {
                var textTrack: TextTrack = textTracks.get(i)
                textTrack.mode = (textTrack.uid == self.selectedTextTrackUid) ? TextTrackMode.showing : TextTrackMode.disabled
            }
        }
    }
    
    @objc(setSelectedAudioTrack:)
    func setSelectedAudioTrack(selectedAudioTrackUid: NSNumber) {
        // store selectedAudioTrackUid
        self.selectedAudioTrackUid = selectedAudioTrackUid.intValue
        if DEBUG_PROP_UPDATES  { print("[NATIVE] selectedAudioTrack prop updated.") }
        // sync player state with selectedAudioTrackUid prop
        self.syncPlayerSelectedAudioTrack()
    }
    
    private func syncPlayerSelectedAudioTrack() {
        if let player = self.player {
            let audioTracks: AudioTrackList = player.audioTracks
            guard audioTracks.count > 0 else {
                return
            }
            if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Enabling audioTrack \(self.selectedAudioTrackUid) on TheoPlayer") }
            for i in 0...audioTracks.count-1 {
                var audioTrack: MediaTrack = audioTracks.get(i)
                audioTrack.enabled = (audioTrack.uid == self.selectedAudioTrackUid)
            }
        }
    }
    
    @objc(setSelectedVideoTrack:)
    func setSelectedVideoTrack(selectedVideoTrackUid: NSNumber) {
        // store selectedVideoTrackUid
        self.selectedVideoTrackUid = selectedVideoTrackUid.intValue
        if DEBUG_PROP_UPDATES  { print("[NATIVE] selectedVideoTrack prop updated.") }
        // sync player state with selectedVideoTrackUid prop
        self.syncPlayerSelectedVideoTrack()
    }
    
    private func syncPlayerSelectedVideoTrack() {
        if let player = self.player {
            let videoTracks: VideoTrackList = player.videoTracks
            guard videoTracks.count > 0 else {
                return
            }
            if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Enabling videoTrack \(self.selectedVideoTrackUid) on TheoPlayer") }
            for i in 0...videoTracks.count-1 {
                var videoTrack: MediaTrack = videoTracks.get(i)
                videoTrack.enabled = (videoTrack.uid == self.selectedVideoTrackUid)
            }
        }
    }
    
    @objc(setSeek:)
    func setSeek(seek: NSNumber) {
        // store selectedVideoTrackUid
        self.seek = seek.doubleValue
        if DEBUG_PROP_UPDATES  { print("[NATIVE] seek prop set.") }
        // sync player state with seek prop
        self.syncPlayerSeek()
    }
    
    private func syncPlayerSeek() {
        if let player = self.player,
           let seek = self.seek {
            if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Seeking to \(seek) on TheoPlayer") }
            player.setCurrentTime(seek * 0.001)
            // Unset seek prop. CurrentTime value must be set only once
            self.seek = nil
            if DEBUG_PROP_UPDATES  { print("[NATIVE] seek prop unset.") }
        }
    }
    
    @objc(setFullscreen:)
    func setFullscreen(fullscreen: Bool) {
        // store fullscreen
        self.fullscreen = fullscreen
        if DEBUG_PROP_UPDATES  { print("[NATIVE] fullscreen prop updated.") }
        // sync player state with fullscreen prop
        self.syncPlayerFullscreen()
    }
    
    private func syncPlayerFullscreen() {
        // NOTE: Fullscreen changes only supported through default UI or with custom implementation in RN
        if let player = self.player {
            if self.fullscreen && player.presentationMode != PresentationMode.fullscreen {
                // if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Putting TheoPlayer in fullscreen") }
            } else if !self.fullscreen && player.presentationMode == PresentationMode.fullscreen {
                // if DEBUG_THEOPLAYER_INTERACTION { print("[NATIVE] Taking TheoPlayer out of fullscreen") }
            }
        }
    }
    
    // MARK: - Listener based MAIN event bridging
    
    @objc(setOnNativePlay:)
    func setOnNativePlay(nativePlay: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlay = nativePlay
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativePlay prop set.") }
    }
    
    @objc(setOnNativePause:)
    func setOnNativePause(nativePause: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePause = nativePause
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativePause prop set.") }
    }
    
    @objc(setOnNativeSourceChange:)
    func setOnNativeSourceChange(nativeSourceChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSourceChange = nativeSourceChange
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeSourceChange prop set.") }
    }
    
    @objc(setOnNativeLoadStart:)
    func setOnNativeLoadStart(nativeLoadStart: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadStart = nativeLoadStart
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeLoadStart prop set.") }
    }
    
    @objc(setOnNativeReadyStateChange:)
    func setOnNativeReadyStateChange(nativeReadyStateChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeReadyStateChange = nativeReadyStateChange
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeReadyStateChange prop set.") }
    }
    
    @objc(setOnNativeDurationChange:)
    func setOnNativeDurationChange(nativeDurationChange: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeDurationChange = nativeDurationChange
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeDurationChange prop set.") }
    }
    
    @objc(setOnNativeProgress:)
    func setOnNativeProgress(nativeProgress: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeProgress = nativeProgress
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeProgress prop set.") }
    }
    
    @objc(setOnNativeTimeUpdate:)
    func setOnNativeTimeUpdate(nativeTimeUpdate: @escaping RCTBubblingEventBlock) {
        self.mainEventHandler.onNativeTimeUpdate = nativeTimeUpdate
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeTimeUpdate prop set.") }
    }
    
    @objc(setOnNativePlaying:)
    func setOnNativePlaying(nativePlaying: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativePlaying = nativePlaying
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativePlaying prop set.") }
    }
    
    @objc(setOnNativeSeeking:)
    func setOnNativeSeeking(nativeSeeking: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeking = nativeSeeking
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeSeeking prop set.") }
    }
    
    @objc(setOnNativeSeeked:)
    func setOnNativeSeeked(nativeSeeked: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeSeeked = nativeSeeked
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeSeeked prop set.") }
    }
    
    @objc(setOnNativeEnded:)
    func setOnNativeEnded(nativeEnded: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeEnded = nativeEnded
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeEnded prop set.") }
    }
    
    @objc(setOnNativeError:)
    func setOnNativeError(nativeError: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeError = nativeError
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeError prop set.") }
    }
    
    @objc(setOnNativeLoadedData:)
    func setOnNativeLoadedData(nativeLoadedData: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedData = nativeLoadedData
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeLoadedData prop set.") }
    }
    
    @objc(setOnNativeLoadedMetadata:)
    func setOnNativeLoadedMetadata(nativeLoadedMetadata: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeLoadedMetadata = nativeLoadedMetadata
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeLoadedMetadata prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerWillPresent:)
    func setOnNativeFullscreenPlayerWillPresent(nativeFullscreenPlayerWillPresent: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerWillPresent = nativeFullscreenPlayerWillPresent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeFullscreenPlayerWillPresent prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerDidPresent:)
    func setOnNativeFullscreenPlayerDidPresent(nativeFullscreenPlayerDidPresent: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerDidPresent = nativeFullscreenPlayerDidPresent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeFullscreenPlayerDidPresent prop set.") }
    }

    @objc(setOnNativeFullscreenPlayerWillDismiss:)
    func setOnNativeFullscreenPlayerWillDismiss(nativeFullscreenPlayerWillDismiss: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerWillDismiss = nativeFullscreenPlayerWillDismiss
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeFullscreenPlayerWillDismiss prop set.") }
    }
    
    @objc(setOnNativeFullscreenPlayerDidDismiss:)
    func setOnNativeFullscreenPlayerDidDismiss(nativeFullscreenPlayerDidDismiss: @escaping RCTDirectEventBlock) {
        self.mainEventHandler.onNativeFullscreenPlayerDidDismiss = nativeFullscreenPlayerDidDismiss
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeFullscreenPlayerDidDismiss prop set.") }
    }
    
    // MARK: - Listener based TEXTTRACK event bridging
    
    @objc(setOnNativeTextTrackListEvent:)
    func setOnNativeTextTrackListEvent(nativeTextTrackListEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackListEvent = nativeTextTrackListEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeTextTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeTextTrackEvent:)
    func setOnNativeTextTrackEvent(nativeTextTrackEvent: @escaping RCTDirectEventBlock) {
        self.textTrackEventHandler.onNativeTextTrackEvent = nativeTextTrackEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeTextTrackEvent prop set.") }
    }
    
    // MARK: - Listener based MEDIATRACK event bridging
    
    @objc(setOnNativeMediaTrackListEvent:)
    func setOnNativeMediaTrackListEvent(nativeMediaTrackListEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackListEvent = nativeMediaTrackListEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeMediaTrackListEvent prop set.") }
    }
    
    @objc(setOnNativeMediaTrackEvent:)
    func setOnNativeMediaTrackEvent(nativeMediaTrackEvent: @escaping RCTDirectEventBlock) {
        self.mediaTrackEventHandler.onNativeMediaTrackEvent = nativeMediaTrackEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeMediaTrackEvent prop set.") }
    }
    
    // MARK: - Listener based AD event bridging
    
    @objc(setOnNativeAdEvent:)
    func setOnNativeAdEvent(nativeAdEvent: @escaping RCTDirectEventBlock) {
        self.adEventHandler.onNativeAdEvent = nativeAdEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeAdEvent prop set.") }
    }
    
    // MARK: - Listener based CAST event bridging
    
    @objc(setOnNativeCastEvent:)
    func setOnNativeCastEvent(nativeCastEvent: @escaping RCTDirectEventBlock) {
        self.castEventHandler.onNativeCastEvent = nativeCastEvent
        if DEBUG_PROP_UPDATES  { print("[NATIVE] nativeCastEvent prop set.") }
    }
}
