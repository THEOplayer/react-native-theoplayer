//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import UIKit
import THEOplayerSDK

let ERROR_MESSAGE_PLAYER_ABR_UNSUPPORTED_FEATURE: String = "Setting an ABRconfig is not supported on iOS/tvOS."
let ERROR_MESSAGE_PLAYER_QUALITY_UNSUPPORTED_FEATURE: String = "Setting a target video quality is not supported on iOS/tvOS."
let ERROR_MESSAGE_PLAYER_FULLSCREEN_UNSUPPORTED_FEATURE: String = "Fullscreen presentationmode should be implemented on the RN level for iOS/tvOS."

@objc(THEOplayerRCTPlayerAPI)
class THEOplayerRCTPlayerAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    static func moduleName() -> String! {
        return "PlayerModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(setPaused:paused:)
    func setPaused(_ node: NSNumber, paused: Bool) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if paused && !player.paused {
                    if DEBUG_PLAYER_API { print("[NATIVE] Triggering pause on TheoPlayer") }
                    player.pause()
                } else if !paused && player.paused {
                    if DEBUG_PLAYER_API { print("[NATIVE] Triggering play on TheoPlayer") }
                    player.play()
                }
            }
        }
    }
    
    @objc(setSource:src:)
    func setSource(_ node: NSNumber, src: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let srcDescription = THEOplayerRCTSourceDescriptionBuilder.buildSourceDescription(src) {
                if let player = theView.player {
                    if DEBUG_PLAYER_API { print("[NATIVE] Setting new source on TheoPlayer") }
                    player.source = srcDescription
                }
            } else {
                if DEBUG_PLAYER_API { print("[NATIVE] Failed to update THEOplayer source.") }
            }
        }
    }
    
    @objc(setABRConfig:abrConfig:)
    func setABRConfig(_ node: NSNumber, setABRConfig: NSDictionary) -> Void {
        if DEBUG_PLAYER_API { print(ERROR_MESSAGE_PLAYER_ABR_UNSUPPORTED_FEATURE) }
        return
    }
    
    @objc(setCurrentTime:time:)
    func setCurrentTime(_ node: NSNumber, time: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let timeValue = time.doubleValue * 0.001
                if DEBUG_PLAYER_API { print("[NATIVE] Seeking to \(timeValue) on TheoPlayer") }
                player.setCurrentTime(timeValue)
            }
        }
    }
    
    @objc(setMuted:muted:)
    func setMuted(_ node: NSNumber, muted: Bool) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if player.muted != muted {
                    if DEBUG_PLAYER_API { print("[NATIVE] Changing TheoPlayer to \(muted ? "muted" : "not muted")") }
                    player.muted = muted
                }
            }
        }
    }
    
    @objc(setVolume:volume:)
    func setVolume(_ node: NSNumber, volume: NSNumber) -> Void {
        if DEBUG_PLAYER_API { print("[NATIVE] Setting volume: TheoPlayer does not handle volume changes for iOS. This is handled by the device.") }
    }
    
    @objc(setPlaybackRate:playbackRate:)
    func setPlaybackRate(_ node: NSNumber, playbackRate: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let playbackRateValue = playbackRate.doubleValue
                if player.playbackRate != playbackRateValue {
                    if DEBUG_PLAYER_API { print("[NATIVE] Setting playbackRate on TheoPlayer to \(playbackRateValue)") }
                    player.setPlaybackRate(playbackRateValue)
                }
            }
        }
    }
    
    @objc(setPresentationMode:presentationMode:)
    func setPresentationMode(_ node: NSNumber, presentationMode: String) -> Void {
        DispatchQueue.main.async {
            let newPresentationMode: PresentationMode = THEOplayerRCTTypeUtils.presentationModeFromString(presentationMode)
            if newPresentationMode == .fullscreen {
                print(ERROR_MESSAGE_PLAYER_FULLSCREEN_UNSUPPORTED_FEATURE)
            }
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if player.presentationMode != newPresentationMode {
                    if DEBUG_PLAYER_API { print("[NATIVE] Changing TheoPlayer to \(presentationMode)") }
                    player.presentationMode = newPresentationMode
                }
            }
        }
        return
    }
    
    @objc(setPipConfig:pipConfig:)
    func setPipConfig(_ node: NSNumber, pipConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let newPipConfig: PipConfig = self.parsePipConfig(configDict: pipConfig)
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                theView.pipConfig = newPipConfig
                // TODO: update pipConfig on Player instance
            }
        }
        return
    }
    
    private func parsePipConfig(configDict: NSDictionary) -> PipConfig {
        var pipConfig = PipConfig()
        pipConfig.retainPresentationModeOnSourceChange = configDict["retainPresentationModeOnSourceChange"] as? Bool ?? false
        pipConfig.canStartPictureInPictureAutomaticallyFromInline = configDict["startsAutomatically"] as? Bool ?? false
        return pipConfig
    }
    
    @objc(setBackgroundAudioConfig:backgroundAudioConfig:)
    func setBackgroundAudioConfig(_ node: NSNumber, backgroundAudioConfig: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let newBackgroundAudioConfig: BackgroundAudioConfig = self.parseBackgroundAudioConfig(configDict: backgroundAudioConfig)
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
               theView.backgroundAudioConfig = newBackgroundAudioConfig
            }
        }
        return
    }
    
    private func parseBackgroundAudioConfig(configDict: NSDictionary) -> BackgroundAudioConfig {
        var backgroundAudio = BackgroundAudioConfig()
        backgroundAudio.enabled = configDict["enabled"] as? Bool ?? false
        return backgroundAudio
    }
    
    @objc(setSelectedTextTrack:uid:)
    func setSelectedTextTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let textTracks: TextTrackList = player.textTracks
                guard textTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { print("[NATIVE] Showing textTrack \(uidValue) on TheoPlayer") }
                for i in 0...textTracks.count-1 {
                    var textTrack: TextTrack = textTracks.get(i)
                    if textTrack.uid == uidValue {
                        textTrack.mode = TextTrackMode.showing
                    } else if textTrack.mode == TextTrackMode.showing {
                        textTrack.mode = TextTrackMode.disabled
                    } 
                }
            }
        }
    }
    
    @objc(setSelectedAudioTrack:uid:)
    func setSelectedAudioTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let audioTracks: AudioTrackList = player.audioTracks
                guard audioTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { print("[NATIVE] Enabling audioTrack \(uidValue) on TheoPlayer") }
                for i in 0...audioTracks.count-1 {
                    var audioTrack: MediaTrack = audioTracks.get(i)
                    audioTrack.enabled = (audioTrack.uid == uidValue)
                }
            }
        }
    }
    
    @objc(setSelectedVideoTrack:uid:)
    func setSelectedVideoTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let uidValue = uid.intValue
                let videoTracks: VideoTrackList = player.videoTracks
                guard videoTracks.count > 0 else {
                    return
                }
                if DEBUG_PLAYER_API { print("[NATIVE] Enabling videoTrack \(uidValue) on TheoPlayer") }
                for i in 0...videoTracks.count-1 {
                    var videoTrack: MediaTrack = videoTracks.get(i)
                    videoTrack.enabled = (videoTrack.uid == uidValue)
                }
            }
        }
    }
    
    @objc(setTargetVideoQuality:uid:)
    func setTargetVideoQuality(_ node: NSNumber, uid: [NSNumber]) -> Void {
        if DEBUG_PLAYER_API { print(ERROR_MESSAGE_PLAYER_QUALITY_UNSUPPORTED_FEATURE) }
        return
    }
    
    @objc(setPreload:type:)
    func setPreload(_ node: NSNumber, type: String) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                let preloadType = THEOplayerRCTTypeUtils.preloadTypeFromString(type)
                if player.preload != preloadType {
                    if DEBUG_PLAYER_API { print("[NATIVE] Changing TheoPlayer preload type to \(type)") }
                    player.setPreload(preloadType)
                }
            }
        }
    }
    
}
