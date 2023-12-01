//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import THEOplayerSDK

protocol EventReceiver {
    func onReceivedEvent()
}

class NativeAdBreak: AdBreak {
    var ads: [THEOplayerSDK.Ad]  = []
    var maxDuration: Int = 0
    var maxRemainingDuration: Double = 0
    var timeOffset: Int = 0
}

@objc(THEOplayerRCTBroadcastAPI)
class THEOplayerRCTBroadcastAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    static func moduleName() -> String! {
        return "BroadcastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(dispatchEvent:event:)
    func dispatchEvent(_ node: NSNumber, event: NSDictionary) -> Void {
    }
}
