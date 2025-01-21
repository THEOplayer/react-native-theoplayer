//
//  THEORCTCacheModule.swift
//

@objc(THEORCTCacheModule)
class THEORCTCacheModule: RCTEventEmitter {
    let cacheAPI = THEOplayerRCTCacheAPI()
    
    override init() {
        super.init()
        self.cacheAPI.sendEvent = self.sendEvent
    }
    
    override static func moduleName() -> String! {
        return "THEORCTCacheModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return [
            "onCacheStatusChange",
            "onAddCachingTaskEvent",
            "onRemoveCachingTaskEvent",
            "onCachingTaskProgressEvent",
            "onCachingTaskStatusChangeEvent"
        ]
    }
    
    @objc(getInitialState:rejecter:)
    func getInitialState(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.cacheAPI.getInitialState(resolve: resolve, reject: reject)
    }

    @objc(createTask:params:resolver:rejecter:)
    func createTask(_ src: NSDictionary, params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.cacheAPI.createTask(src: src, params: params, resolve: resolve, reject: reject)
    }

    @objc(startCachingTask:)
    func startCachingTask(_ id: NSString) -> Void {
        self.cacheAPI.startCachingTask(id: id)
    }

    @objc(pauseCachingTask:)
    func pauseCachingTask(_ id: NSString) -> Void {
        self.cacheAPI.pauseCachingTask(id: id)
    }

    @objc(removeCachingTask:)
    func removeCachingTask(_ id: NSString) -> Void {
        self.cacheAPI.removeCachingTask(id: id)
    }

    @objc(renewLicense:drmConfig:)
    func renewLicense(_ id: NSString, drmConfig: NSDictionary) -> Void {
        self.cacheAPI.renewLicense(id: id, drmConfig: drmConfig)
    }
    
    
}
