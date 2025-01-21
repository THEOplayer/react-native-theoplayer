//
//  THEORCTCastModule+Chromecast.swift
//

extension THEORCTCastModule {
    
    @objc(chromecastCasting:resolver:rejecter:)
    func chromecastCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastCasting(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(chromecastState:resolver:rejecter:)
    func chromecastState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastState(self.view(for: node), resolve: resolve, reject: reject)
        }
    }
    
    @objc(chromecastStart:)
    func chromecastStart(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastStart(self.view(for: node))
        }
    }
    
    @objc(chromecastStop:)
    func chromecastStop(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastStop(self.view(for: node))
        }
    }
    
    @objc(chromecastJoin:)
    func chromecastJoin(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastJoin(self.view(for: node))
        }
    }
    
    @objc(chromecastLeave:)
    func chromecastLeave(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            self.castAPI.chromecastLeave(self.view(for: node))
        }
    }
}
