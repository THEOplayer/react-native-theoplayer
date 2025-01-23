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
let CACHE_EVENT_PROP_PROGRESS: String = "progress"
let CACHE_EVENT_PROP_TASK: String = "task"
let CACHE_EVENT_PROP_TASKS: String = "tasks"

let CACHE_TAG: String = "[CacheAPI]"

let ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE = "Cache API is not supported for tvOS"
let ERROR_CODE_CREATE_CACHINGTASK_FAILED = "create_cachingtask_failure"
let ERROR_MESSAGE_CREATE_CACHINGTASK_FAILURE = "Creating a new cachingTask failed."

@objc
public class THEOplayerRCTCacheAPI: NSObject {
    
    var sendEvent: ((String, [String:Any]) -> Void) = { _, _ in }
    
    // MARK: Cache Listeners
    private var cacheStatusListener: EventListener?

    // MARK: CacheTask listeners (attached dynamically to new tasks)
    private var taskStateChangeListeners: [String:EventListener] = [:] // key is CacheTask.id
    private var taskProgressListeners: [String:EventListener] = [:] // key is CacheTask.id

    @objc
    public override init() {
        super.init()

        // attach listeners
        self.attachCacheListeners()
    }

    deinit {
        self.detachCacheListeners()
    }
    
    // MARK: - attach/dettach cache Listeners
    private func attachCacheListeners() {
#if os(iOS)
        // STATE_CHANGE
        self.cacheStatusListener = THEOplayer.cache.addEventListener(type: CacheEventTypes.STATE_CHANGE) { [weak self] event in
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received STATE_CHANGE event from THEOplayer.cache") }
            self?.sendEvent("onCacheStatusChange", [
                CACHE_EVENT_PROP_STATUS: THEOplayerRCTTypeUtils.cacheStatusToString(THEOplayer.cache.status)
            ])
        }
        if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener attached to THEOplayer.cache") }
        
        // Attach listeners to all task currently known to cache
        for cachingTask in THEOplayer.cache.tasks {
            self.attachTaskListenersToTask(cachingTask)
        }
#endif
    }

    private func detachCacheListeners() {
#if os(iOS)
        // STATE_CHANGE
        if let cacheStatusListener = self.cacheStatusListener {
            THEOplayer.cache.removeEventListener(type: CacheEventTypes.STATE_CHANGE, listener: cacheStatusListener)
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener dettached from THEOplayer.cache") }
        }
#endif
    }

#if os(iOS)
    private func attachTaskListenersToTask(_ newTask: CachingTask) {
        // add STATE_CHANGE listeners to newly created task
        self.taskStateChangeListeners[newTask.id] = newTask.addEventListener(type: CachingTaskEventTypes.STATE_CHANGE) { [weak self] event in
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received STATE_CHANGE event for task with id \(newTask.id): status is \(THEOplayerRCTTypeUtils.cachingTaskStatusToString(newTask.status))") }
            self?.sendEvent("onCachingTaskStatusChangeEvent", [
                CACHETASK_PROP_ID: newTask.id,
                CACHE_EVENT_PROP_STATUS: THEOplayerRCTTypeUtils.cachingTaskStatusToString(newTask.status)
            ])

            if let errorEvent = event as? CachingTaskErrorStateChangeEvent,
               let error = errorEvent.error {
                if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] STATE_CHANGE_ERROR event for task with id \(newTask.id): [error] \(error.code):\(error.category) - \(error.message)") }
            } else if let idleEvent = event as? CachingTaskIdleStateChangeEvent {
                if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] STATE_CHANGE_IDLE event for task with id \(newTask.id): [reason] \(THEOplayerRCTTypeUtils.cacheStatusIdleReasonToString(idleEvent.idleReason))") }
            }
        }
        if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener attached to task with id \(newTask.id).") }

        // add PROGRESS listeners to newly created task
        self.taskProgressListeners[newTask.id] = newTask.addEventListener(type: CachingTaskEventTypes.PROGRESS) { [weak self] event in
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Received PROGRESS event from task with id \(newTask.id): progress is \(newTask.percentageCached * 100.0)% of \(newTask.duration) sec.") }
            self?.sendEvent("onCachingTaskProgressEvent", [
                CACHETASK_PROP_ID: newTask.id,
                CACHE_EVENT_PROP_PROGRESS: THEOplayerRCTCacheAggregator.aggregateCacheTaskProgress(task: newTask)
            ] as [String : Any])
        }
        if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Progress listener attached to task with id \(newTask.id).") }
    }

    private func detachTaskListenersFromTask(_ task: CachingTask) {
        // STATE_CHANGE
        if let taskStateChangeListener = self.taskStateChangeListeners[task.id] {
            task.removeEventListener(type: CachingTaskEventTypes.STATE_CHANGE, listener: taskStateChangeListener)
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] StateChange listener dettached from task with id \(task.id)") }
        }
        // PROGRESS
        if let taskProgressListener = self.taskProgressListeners[task.id] {
            task.removeEventListener(type: CachingTaskEventTypes.PROGRESS, listener: taskProgressListener)
            if DEBUG_CACHE_EVENTS { PrintUtils.printLog(logText: "[NATIVE] Progress listener dettached from task with id \(task.id)") }
        }
    }
#endif

    // MARK: API

#if os(iOS)
    func getInitialState(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve([
            CACHE_EVENT_PROP_STATUS: THEOplayerRCTTypeUtils.cacheStatusToString(THEOplayer.cache.status),
            CACHE_EVENT_PROP_TASKS: THEOplayerRCTCacheAggregator.aggregateCacheTasks(tasks: THEOplayer.cache.tasks)
        ] as [String : Any])
    }

    func createTask(src: NSDictionary, params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] createTask triggered on Cache API.") }
		let params = THEOplayerRCTCachingParametersBuilder.buildCachingParameters(params)
		let (sourceDescription, _) = THEOplayerRCTSourceDescriptionBuilder.buildSourceDescription(src)
		if let srcDescription = sourceDescription,
		   let newTask = THEOplayer.cache.createTask(source: srcDescription, parameters: params) {
            if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] New cache task created with id \(newTask.id)") }
            resolve(THEOplayerRCTCacheAggregator.aggregateCacheTask(task: newTask))
            // emit onAddCachingTaskEvent
            self.sendEvent("onAddCachingTaskEvent", [
                CACHE_EVENT_PROP_TASK: THEOplayerRCTCacheAggregator.aggregateCacheTask(task: newTask)
            ])

            // attach the state and progress listeners to the new task
            self.attachTaskListenersToTask(newTask)
        } else {
            reject(ERROR_CODE_CREATE_CACHINGTASK_FAILED, ERROR_MESSAGE_CREATE_CACHINGTASK_FAILURE, nil)
        }
    }

    func startCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Start task triggered on Cache API for task with id \(id).") }
        if let task = self.taskById(id as String) {
            task.start()
        }
    }

    func pauseCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Pause task triggered on Cache API for task with id \(id).") }
        if let task = self.taskById(id as String) {
            task.pause()
        }
    }

    func removeCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Remove task triggered on Cache API for task with id \(id).") }
        if let task = self.taskById(id as String) {
            // remove the task
            task.remove()
            // remove the listeners
            self.detachTaskListenersFromTask(task)
        }
    }

    func renewLicense(id: NSString, drmConfig: NSDictionary) -> Void {
        if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Renew license triggered on Cache API for task with id \(id).") }
        if let task = self.taskById(id as String) {
            guard let contentProtectionData = drmConfig as? [String:Any] else {
                if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Renew license failed for task with id \(id): Unable to extract drm configuration data.") }
                return
            }
            let sanitisedContentProtectionData = THEOplayerRCTSourceDescriptionBuilder.sanitiseContentProtectionData(contentProtectionData)
            if let contentProtectionConfig = THEOplayerRCTSourceDescriptionBuilder.buildContentProtection(sanitisedContentProtectionData) {
                task.license.renew(contentProtectionConfig)
                if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] License renewed for task with id \(id).") }
            } else {
                if DEBUG_CACHE_API { PrintUtils.printLog(logText: "[NATIVE] Renew license failed for task with id \(id): Invalid contentProtection input.") }
            }
        }
    }

    private func taskById(_ id: String) -> CachingTask? {
        return THEOplayer.cache.tasks.first {
            cachingTask in cachingTask.id == id
        }
    }
#else
    func getInitialState(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
        resolve([
            CACHE_EVENT_PROP_STATUS: "uninitialised",
            CACHE_EVENT_PROP_TASKS: []
        ] as [String : Any])
    }

    func createTask(src: NSDictionary, params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
        reject([:] as [String : Any])
    }

    func startCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
    }

    func pauseCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
    }

    func removeCachingTask(id: NSString) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
    }

    func renewLicense(id: NSString, drmConfig: NSDictionary) -> Void {
        if DEBUG_CACHE_API { print(ERROR_MESSAGE_CACHE_API_UNSUPPORTED_FEATURE) }
    }
#endif
}
