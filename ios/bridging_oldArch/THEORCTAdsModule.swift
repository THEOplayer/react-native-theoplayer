//
//  THEORCTAdsModule.swift
//

@objc(THEORCTAdsModule)
class THEORCTAdsModule: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    let adsAPI = THEOplayerRCTAdsAPI()
    
    static func moduleName() -> String! {
        return "THEORCTAdsModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        return self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.skip(self.view(for: node))
        }
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.playing(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.currentAdBreak(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.currentAds(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.scheduledAdBreaks(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.schedule(self.view(for: node), adDict: adDict)
        }
    }
}
