//
//  THEORCTCastModule.swift
//

@objc(THEORCTCastModule)
class THEORCTCastModule: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    let castAPI = THEOplayerRCTCastAPI()
    
    static func moduleName() -> String! {
        return "THEORCTCastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        return self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.castAPI.casting(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
}
