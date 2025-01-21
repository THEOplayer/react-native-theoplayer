//
//  THEORCTCastModule+Airplay.swift
//

extension THEORCTCastModule {
    
    @objc(airplayCasting:resolver:rejecter:)
    func airplayCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.castAPI.airplayCasting(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(airplayState:resolver:rejecter:)
    func airplayState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.castAPI.airplayState(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(airplayStart:)
    func airplayStart(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.airplayStart(self.view(for: node))
        }
    }
    
    @objc(airplayStop:)
    func airplayStop(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.airplayStop(self.view(for: node))
        }
    }
}
