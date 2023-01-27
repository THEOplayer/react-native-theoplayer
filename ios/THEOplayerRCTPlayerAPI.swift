//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import UIKit

let ERROR_MESSAGE_PLAYER_ABR_UNSUPPORTED_FEATURE: String = "Setting an ABRconfig is not supported on iOS/tvOS."

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
        if DEBUG_ADS_API { print(ERROR_MESSAGE_PLAYER_ABR_UNSUPPORTED_FEATURE) }
        return
    }
    
    @objc(setCurrentTime:time:)
    func setCurrentTime(_ node: NSNumber, time: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            theView.setSeek(seek: time)
        }
    }

}
