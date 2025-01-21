//
//  THEORCTAdsModule+DAI.swift
//

extension THEORCTAdsModule {
    
    @objc(daiSnapback:resolver:rejecter:)
    func daiSnapback(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.daiSnapback(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(daiSetSnapback:enabled:)
    func daiSetSnapback(_ node: NSNumber, enabled: Bool) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.daiSetSnapback(self.view(for: node), enabled: enabled)
        }
    }
    
    @objc(daiContentTimeForStreamTime:time:resolver:rejecter:)
    func daiContentTimeForStreamTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.daiContentTimeForStreamTime(self.view(for: node), timeValue: timeValue, resolve: resolve, reject: reject)
        }
    }
    
    @objc(daiStreamTimeForContentTime:time:resolver:rejecter:)
    func daiStreamTimeForContentTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.adsAPI.daiStreamTimeForContentTime(self.view(for: node), timeValue: timeValue, resolve: resolve, reject: reject)
        }
    }
}
