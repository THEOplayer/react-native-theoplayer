//
//  THEORCTEventBroadcastModule.swift
//

@objc(THEORCTEventBroadcastModule)
class THEORCTEventBroadcastModule: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    let eventBroadcastAPI = THEOplayerRCTEventBroadcastAPI()
    
    static func moduleName() -> String! {
        return "THEORCTEventBroadcastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        return self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    @objc(broadcastEvent:event:)
    func broadcastEvent(_ node: NSNumber, event: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.eventBroadcastAPI.broadcastEvent(self.view(for: node), event: event)
        }
    }
}
