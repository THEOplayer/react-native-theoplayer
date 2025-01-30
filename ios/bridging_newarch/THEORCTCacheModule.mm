#import "THEORCTCacheModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTCacheModule_objc

RCT_EXPORT_MODULE(THEORCTCacheModule)

- (instancetype)init {
    if (self = [super init]) {
        self.cacheAPI = [[THEOplayerRCTCacheAPI alloc] init];
    }
    return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeCacheModuleSpecJSI>(params);
}

- (void)createTask:(NSDictionary *)source parameters:(NSDictionary *)parameters resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.cacheAPI createTaskForSrc:source
                             params:parameters
                            resolve:resolve
                             reject:reject];
}

- (void)getInitialState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.cacheAPI getInitialState:resolve
                            reject:reject];
}

- (void)startCachingTask:(NSString *)taskId {
    [self.cacheAPI startCachingTaskWithId:taskId];
}

- (void)pauseCachingTask:(NSString *)taskId { 
    [self.cacheAPI pauseCachingTaskWithId:taskId];
}

- (void)removeCachingTask:(NSString *)taskId { 
    [self.cacheAPI removeCachingTaskWithId:taskId];
}

- (void)renewLicense:(NSString *)taskId drmConfig:(NSDictionary *)drmConfig { 
    [self.cacheAPI renewLicenseForTaskId:taskId
                               drmConfig:drmConfig];
}


@end
