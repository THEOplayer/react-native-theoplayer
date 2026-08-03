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
        return "THEORCTEventBroadcastModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(broadcastEvent:event:)
    func broadcastEvent(_ node: NSNumber, event: NSDictionary) -> Void {
        withView(node) { theView in
            theView.broadcastEventHandler.broadcastEvent(eventData: event)
        }
    }
}
