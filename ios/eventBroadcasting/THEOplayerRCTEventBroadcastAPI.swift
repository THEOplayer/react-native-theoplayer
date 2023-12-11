//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import THEOplayerSDK

protocol EventReceiver {
    func onReceivedEvent()
}

@objc(THEOplayerRCTEventBroadcastAPI)
class THEOplayerRCTBroadcastAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    
    static func moduleName() -> String! {
        return "EventBroadcastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(broadcastEvent:event:)
    func broadcastEvent(_ node: NSNumber, event: NSDictionary) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                theView.broadcastEventHandler.broadcastEvent(eventData: event)
            }
        }
    }
}
