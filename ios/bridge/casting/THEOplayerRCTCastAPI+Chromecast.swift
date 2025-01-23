//  THEOplayerRCTCastAPI+Chromecast.swift

import Foundation

let ERROR_CODE_CHROMECAST_ACCESS_FAILURE = "chromecast_access_failure"
let ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE = "Chromecast is not supported by the provided iOS SDK"
let ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE = "Could not access THEOplayer Chromecast API"

extension THEOplayerRCTCastAPI {
    
#if os(iOS) && canImport(THEOplayerGoogleCastIntegration)
    
    @objc(chromecastCasting:resolve:reject:)
    public func chromecastCasting(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            resolve(chromecast.casting)
        } else {
            reject(ERROR_CODE_CHROMECAST_ACCESS_FAILURE, ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE, nil)
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current chromecast casting status.") }
        }
    }
    
    @objc(chromecastState:resolve:reject:)
    public func chromecastState(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            resolve(chromecast.state?._rawValue)
        } else {
            reject(ERROR_CODE_CHROMECAST_ACCESS_FAILURE, ERROR_MESSAGE_CHROMECAST_ACCESS_FAILURE, nil)
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current chromecast state.") }
        }
    }
    
    @objc(chromecastStart:)
    public func chromecastStart(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Starting chromecast session.") }
            chromecast.start()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not start chromecast session.") }
        }
    }
    
    @objc(chromecastStop:)
    public func chromecastStop(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Stopping chromecast session.") }
            chromecast.stop()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not stop chromecast session.") }
        }
    }
    
    @objc(chromecastJoin:)
    public func chromecastJoin(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Joining chromecast session.") }
            chromecast.join()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not join chromecast session.") }
        }
    }
    
    @objc(chromecastLeave:)
    public func chromecastLeave(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let cast = theView.cast(),
           let chromecast = cast.chromecast {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Leaving chromecast session.") }
            chromecast.leave()
        } else {
            if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not leave chromecast session.") }
        }
    }
    
#else
    
    @objc(chromecastCasting:resolve:reject:)
    public func chromecastCasting(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(chromecastState:resolve:reject:)
    public func chromecastState(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
        resolve("unavailable")
    }
    
    @objc(chromecastStart:)
    public func chromecastStart(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastStop:)
    public func chromecastStop(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastJoin:)
    public func chromecastJoin(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
    @objc(chromecastLeave:)
    public func chromecastLeave(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CHROMECAST_UNSUPPORTED_FEATURE) }
    }
    
#endif
}
