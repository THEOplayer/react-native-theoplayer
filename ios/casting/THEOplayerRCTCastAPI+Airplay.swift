//  THEOplayerRCTCastAPI+Airplay.swift

import Foundation

let ERROR_CODE_AIRPLAY_ACCESS_FAILURE = "airplay_access_failure"
let ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE = "Airplay is not supported by the provided iOS SDK"
let ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE = "Could not access THEOplayer Airplay API"

extension THEOplayerRCTCastAPI {
    
#if os(iOS)
    
    func airplayCasting(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let airplay = cast.airPlay {
            resolve(airplay.casting)
        } else {
            reject(ERROR_CODE_AIRPLAY_ACCESS_FAILURE, ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE, nil)
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current airplay casting status.") }
        }
    }
    
    func airplayState(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let airplay = cast.airPlay {
            resolve(airplay.state._rawValue)
        } else {
            reject(ERROR_CODE_AIRPLAY_ACCESS_FAILURE, ERROR_MESSAGE_AIRPLAY_ACCESS_FAILURE, nil)
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current airplay state.") }
        }
    }
    
    func airplayStart(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let airplay = cast.airPlay {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Starting airplay session.") }
            airplay.start()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not start airplay session.") }
        }
    }
    
    func airplayStop(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let airplay = cast.airPlay {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Stopping airplay session.") }
            airplay.stop()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not stop airplay session.") }
        }
    }
    
#else
    
    func airplayCasting(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    func airplayState(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
        resolve("unavailable")
    }
    
    func airplayStart(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
    }
    
    func airplayStop(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_AIRPLAY_UNSUPPORTED_FEATURE) }
    }
    
#endif
}



