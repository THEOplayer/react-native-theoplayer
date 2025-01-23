#import "THEORCTCacheModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTCacheModule_objc

RCT_EXPORT_MODULE(THEORCTCacheModule)
@synthesize bridge = _bridge;

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

- (void)createTask:(NSDictionary *)source parameters:(NSDictionary *)parameters { 
    
}

- (void)getInitialState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)pauseCachingTask:(NSString *)taskId { 
    
}

- (void)removeCachingTask:(NSString *)taskId { 
    
}

- (void)renewLicense:(NSString *)taskId drmConfig:(NSDictionary *)drmConfig { 
    
}

- (void)startCachingTask:(NSString *)taskId { 
    
}

@end
