//
//  THEOplayerRCTEventAPI.swift
//  Theoplayer
//

import Foundation


@objc(THEOplayerRCTEventAPI)
class THEOplayerRCTEventAPI: RCTEventEmitter {
    private var myTimer: Timer?
    private var counter: Double = 0.0
    private var increment: Double = 1.0
    
    override init() {
        super.init()
        
        self.myTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true, block: { t in
            self.counter += self.increment
            if self.counter >= 5.0 || self.counter <= 0.0 {
                self.increment = -self.increment
            }
            // EMIT
            self.sendEvent(withName: "onRCTEventEmitterEvent", body: ["increment" : self.increment])
            
            // DISPATCH
            //self.bridge.eventDispatcher().sendAppEvent(withName: "onEventDispatcherEvent", body: ["increment" : self.increment])
        })
    }
    
    override static func moduleName() -> String! {
        return "EventModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onRCTEventEmitterEvent", "onEventDispatcherEvent"]
    }
}
