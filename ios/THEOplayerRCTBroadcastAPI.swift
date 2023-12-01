//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import THEOplayerSDK

protocol EventReceiver {
    func onReceivedEvent()
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
        DispatchQueue.main.async {
            if self.bridge.uiManager.view(forReactTag: node) is THEOplayerRCTView {
                let selector = NSSelectorFromString("onReceivedEvent:")
                self.bridge.moduleClasses.forEach { moduleClass in
                    if let nativeModule = self.bridge.module(for: moduleClass) as? RCTBridgeModule,
                       nativeModule.responds(to: selector) {
                        nativeModule.perform(selector, with: nil)
                    }
                }
            }
        }
    }
}
