//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import UIKit

let ERROR_MESSAGE_PLAYER_ABR_UNSUPPORTED_FEATURE: String = "Setting an ABRconfig is not supported on iOS/tvOS."
let ERROR_MESSAGE_PLAYER_QUALITY_UNSUPPORTED_FEATURE: String = "Setting a target video quality is not supported on iOS/tvOS."

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
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setPaused(paused: paused)
        }
    }
    
    @objc(setSource:src:)
    func setSource(_ node: NSNumber, src: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSrc(srcDict: src)
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
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSeek(seek: time)
        }
    }
    
    @objc(setMuted:muted:)
    func setMuted(_ node: NSNumber, muted: Bool) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setMuted(muted: muted)
        }
    }
    
    @objc(setVolume:volume:)
    func setVolume(_ node: NSNumber, volume: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setVolume(volume: volume)
        }
    }
    
    @objc(setPlaybackRate:playbackRate:)
    func setPlaybackRate(_ node: NSNumber, playbackRate: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setPlaybackRate(playbackRate: playbackRate)
        }
    }
    
    @objc(setFullscreen:fullscreen:)
    func setFullscreen(_ node: NSNumber, fullscreen: Bool) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setFullscreen(fullscreen: fullscreen)
        }
    }
    
    @objc(setSelectedTextTrack:uid:)
    func setSelectedTextTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSelectedTextTrack(selectedTextTrackUid: uid)
        }
    }
    
    @objc(setSelectedAudioTrack:uid:)
    func setSelectedAudioTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSelectedAudioTrack(selectedAudioTrackUid: uid)
        }
    }
    
    @objc(setSelectedVideoTrack:uid:)
    func setSelectedVideoTrack(_ node: NSNumber, uid: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSelectedVideoTrack(selectedVideoTrackUid: uid)
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
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setPreloadType(type: type)
        }
    }

}
