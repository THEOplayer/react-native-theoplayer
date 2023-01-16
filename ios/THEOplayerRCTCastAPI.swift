//
//  THEOplayerRCTAdsAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

let ERROR_CODE_CAST_ACCESS_FAILURE = "cast_access_failure"
let ERROR_CODE_CHROMECAST_ACCESS_FAILURE = "chromecast_access_failure"
let ERROR_CODE_AIRPLAY_ACCESS_FAILURE = "airplay_access_failure"

let ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE = "Chromecast and Airplay are not supported by the provided iOS SDK"
let ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE = "Chromecast is not supported by the provided iOS SDK"
let ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE = "Airplay is not supported by the provided iOS SDK"
let ERROR_MESSAGE_CAST_ACCESS_FAILURE = "Could not access THEOplayer Cast Module"
let ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE = "Could not access THEOplayer Chromecast API"
let ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE = "Could not access THEOplayer Airplay API"

@objc(THEOplayerRCTCastAPI)
class THEOplayerRCTCastAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    static func moduleName() -> String! {
        return "CastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    // MARK: CHROMECAST AND AIRPLAY
    
#if os(iOS)
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast() {
                resolve(cast.casting)
            } else {
                reject(ERROR_CODE_CAST_ACCESS_FAILURE, ERROR_MESSAGE_CAST_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { print("[NATIVE] Could not retrieve current casting status (cast module unavailable).") }
            }
        }
    }
    
#else
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
#endif
    
    
    
    // MARK: CHROMECAST SPECIFIC

#if os(iOS) && CHROMECAST
    @objc(chromecastCasting:resolver:rejecter:)
    func chromecastCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                resolve(chromecast.casting)
            } else {
                reject(ERROR_CODE_CHROMECAST_ACCESS_FAILURE, ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { print("[NATIVE] Could not retrieve current chromecast casting status.") }
            }
        }
    }
    
    @objc(chromecastState:resolver:rejecter:)
    func chromecastState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                resolve(chromecast.state?._rawValue)
            } else {
                reject(ERROR_CODE_CHROMECAST_ACCESS_FAILURE, ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { print("[NATIVE] Could not retrieve current chromecast state.") }
            }
        }
    }
    
    @objc(chromecastStart:)
    func chromecastStart(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                if DEBUG_CAST_API { print("[NATIVE] Starting chromecast session.") }
                chromecast.start()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not start chromecast session.") }
            }
        }
    }
    
    @objc(chromecastStop:)
    func chromecastStop(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                if DEBUG_CAST_API { print("[NATIVE] Stopping chromecast session.") }
                chromecast.stop()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not stop chromecast session.") }
            }
        }
    }
    
    @objc(chromecastJoin:)
    func chromecastJoin(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                if DEBUG_CAST_API { print("[NATIVE] Joining chromecast session.") }
                chromecast.join()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not join chromecast session.") }
            }
        }
    }
    
    @objc(chromecastLeave:)
    func chromecastLeave(_ node: NSNumber) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast(),
               let chromecast = cast.chromecast {
                if DEBUG_CAST_API { print("[NATIVE] Leaving chromecast session.") }
                chromecast.leave()
            } else {
                if DEBUG_CAST_API { print("[NATIVE] Could not leave chromecast session.") }
            }
        }
    }
    
#else

    @objc(chromecastCasting:resolver:rejecter:)
    func chromecastCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(chromecastState:resolver:rejecter:)
    func chromecastState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
        resolve("unavailable")
    }
    
    @objc(chromecastStart:)
    func chromecastStart(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastStop:)
    func chromecastStop(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastJoin:)
    func chromecastJoin(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastLeave:)
    func chromecastLeave(_ node: NSNumber) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
#endif
    
    
    
    // MARK: AIRPLAY SPECIFIC

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
