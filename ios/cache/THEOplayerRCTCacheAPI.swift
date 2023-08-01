//
//  THEOplayerRCTContentProtectionAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit
import THEOplayerSDK

let CACHE_EVENT_PROP_STATUS: String = "status"

let CACHE_TAG: String = "[CacheAPI]"

@objc(THEOplayerRCTCacheAPI)
class THEOplayerRCTCacheAPI: RCTEventEmitter {
    private var cacheStatusListener: EventListener?
    
    override static func moduleName() -> String! {
        return "CacheModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onCacheStatusChange",
                "onAddCachingTaskEvent",
                "onRemoveCachingTaskEvent",
                "onCachingTaskProgressEvent",
                "onCachingTaskStatusChangeEvent"
        ]
    }
    
    override init() {
        super.init()
        
        // attach listeners
        self.attachListeners()
    }
    
    deinit {
        self.detachListeners()
    }
    
    // MARK: - attach/dettach cache Listeners
    private func attachListeners() {
        // STATE_CHANGE
        self.cacheStatusListener = THEOplayer.cache.addEventListener(type: CacheEventTypes.STATE_CHANGE) { [weak self] event in
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received STATE_CHANGE event from THEOplayer.cache") }
            self?.sendEvent(withName: "onCacheStatusChange", body: [
                CACHE_EVENT_PROP_STATUS: THEOplayerRCTTypeUtils.cacheStatusToString(THEOplayer.cache.status)
            ])
        }
        if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener attached to THEOplayer.cache") }
    }
    
    private func detachListeners() {
        // STATE_CHANGE
        if let cacheStatusListener = self.cacheStatusListener {
            THEOplayer.cache.removeEventListener(type: CacheEventTypes.STATE_CHANGE, listener: cacheStatusListener)
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener dettached from THEOplayer.cache") }
        }
    }
    
    // MARK: API
    
    @objc(getInitialState:rejecter:)
    func getInitialState(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        
    }
    
    @objc(createTask:params:)
    func createTask(_ src: NSDictionary, params: NSDictionary) -> Void {
        
    }
    
    @objc(startCachingTask:)
    func startCachingTask(_ id: NSNumber) -> Void {
        
    }
    
    @objc(pauseCachingTask:)
    func pauseCachingTask(_ id: NSNumber) -> Void {
        
    }
    
    @objc(removeCachingTask:)
    func removeCachingTask(_ id: NSNumber) -> Void {
        
    }
    
    @objc(renewLicense:drmConfig:)
    func renewLicense(_ id: NSNumber, drmConfig: NSDictionary) -> Void {
        
    }
}
