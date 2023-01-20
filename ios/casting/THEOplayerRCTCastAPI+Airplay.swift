//  THEOplayerRCTCastAPI+Airplay.swift

import Foundation

let ERROR_CODE_AIRPLAY_ACCESS_FAILURE = "airplay_access_failure"
let ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE = "Airplay is not supported by the provided iOS SDK"
let ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE = "Could not access THEOplayer Airplay API"

extension THEOplayerRCTCastAPI {
    
#if os(iOS)
    
    @objc(airplayCasting:resolver:rejecter:)
    func airplayCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let airplay = cast.airPlay {
                resolve(airplay.casting)
            } else {
                reject(ERROR_CODE_AIRPLAY_ACCESS_FAILURE, ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { print("[NATIVE] Could not retrieve current airplay casting status.") }
            }
        }
    }
    
    @objc(airplayState:resolver:rejecter:)
    func airplayState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let airplay = cast.airPlay {
                resolve(airplay.state._rawValue)
            } else {
                reject(ERROR_CODE_AIRPLAY_ACCESS_FAILURE, ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { print("[NATIVE] Could not retrieve current airplay state.") }
            }
        }
    }
    
    @objc(airplayStart:)
    func airplayStart(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let airplay = cast.airPlay {
                if DEBUG_CAST_API { print("[NATIVE] Starting airplay session.") }
                airplay.start()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not start airplay session.") }
            }
        }
    }
    
    @objc(airplayStop:)
    func airplayStop(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let airplay = cast.airPlay {
                if DEBUG_CAST_API { print("[NATIVE] Stopping airplay session.") }
                airplay.stop()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not stop airplay session.") }
            }
        }
    }
    
#else
    
    @objc(airplayCasting:resolver:rejecter:)
    func airplayCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(airplayState:resolver:rejecter:)
    func airplayState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
        resolve("unavailable")
    }
    
    @objc(airplayStart:)
    func airplayStart(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
    }
    
    @objc(airplayStop:)
    func airplayStop(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
    }

#endif
}



