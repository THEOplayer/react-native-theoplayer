//
//  THEOplayerRCTAdsAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

let ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE = "Chromecast and Airplay are not supported by the provided iOS SDK"
let ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE = "Chromecast is not supported by the provided iOS SDK"
let ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE = "Airplay is not supported by the provided iOS SDK"

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
    
#if CHROMECAST || AIRPLAY
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        print("CastModule - casting: todo")
        resolve(false)
    }
    
#else
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
#endif
    
    
    
    // MARK: CHROMECAST SPECIFIC

#if CHROMECAST
    
    @objc(chromecastCasting:resolver:rejecter:)
    func chromecastCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        print("CastModule - chromecastCasting: todo")
        resolve(false)
    }
    
    @objc(chromecastState:resolver:rejecter:)
    func chromecastState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        print("CastModule - chromecastState: todo")
        resolve("unavailable")
    }
    
    @objc(chromecastStart:)
    func chromecastStart(_ node: NSNumber) -> Void {
        print("CastModule - chromecastStart: todo")
    }
    
    @objc(chromecastStop:)
    func chromecastStop(_ node: NSNumber) -> Void {
        print("CastModule - chromecastStop: todo")
    }
    
    @objc(chromecastJoin:)
    func chromecastJoin(_ node: NSNumber) -> Void {
        print("CastModule - chromecastJoin: todo")
    }
    
    @objc(chromecastLeave:)
    func chromecastLeave(_ node: NSNumber) -> Void {
        print("CastModule - chromecastLeave: todo")
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

#if AIRPLAY
    
    @objc(airplayCasting:resolver:rejecter:)
    func airplayCasting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        print("CastModule - airplayCasting: todo")
        resolve(false)
    }
    
    @objc(airplayState:resolver:rejecter:)
    func airplayState(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        print("CastModule - airplayState: todo")
        resolve("unavailable")
    }
    
    @objc(airplayStart:)
    func airplayStart(_ node: NSNumber) -> Void {
        print("CastModule - airplayStart: todo")
    }
    
    @objc(airplayStop:)
    func airplayStop(_ node: NSNumber) -> Void {
        print("CastModule - airplayStop: todo")
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
