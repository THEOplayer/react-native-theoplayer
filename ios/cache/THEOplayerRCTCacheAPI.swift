//
//  THEOplayerRCTCacheAPI.swift
//  Theoplayer
//
//  Created by William Van Haevre on 01/08/2023.
//

import Foundation
import UIKit
import THEOplayerSDK

let CACHE_EVENT_PROP_STATUS: String = "status"
let CACHE_EVENT_PROP_TASKS: String = "tasks"

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
        resolve([
            CACHE_EVENT_PROP_STATUS: THEOplayerRCTTypeUtils.cacheStatusToString(THEOplayer.cache.status),
            CACHE_EVENT_PROP_TASKS: THEOplayerRCTCacheAggregator.aggregateCacheTasks(tasks: THEOplayer.cache.tasks)
        ] as [String : Any])
    }
    
    @objc(createTask:params:)
    func createTask(_ src: NSDictionary, params: NSDictionary) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] createTask triggered on Cache API.") }
        let params = THEOplayerRCTCachingParametersBuilder.buildCachingParameters(params)
        if let srcDescription = THEOplayerRCTSourceDescriptionBuilder.buildSourceDescription(src),
           let newTask = THEOplayer.cache.createTask(source: srcDescription, parameters: params) {
            if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] New cache task created with id \(newTask.id)") }
            
            // add stateChange and progress listeners to newly created task
            
        }
    }
    
    @objc(startCachingTask:)
    func startCachingTask(_ id: NSNumber) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Start task triggered on Cache API for task with id \(id).") }
    }
    
    @objc(pauseCachingTask:)
    func pauseCachingTask(_ id: NSNumber) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Pause task triggered on Cache API for task with id \(id).") }
    }
    
    @objc(removeCachingTask:)
    func removeCachingTask(_ id: NSNumber) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Remove task triggered on Cache API for task with id \(id).") }
    }
    
    @objc(renewLicense:drmConfig:)
    func renewLicense(_ id: NSNumber, drmConfig: NSDictionary) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Renew license triggered on Cache API for task with id \(id).") }
    }
}