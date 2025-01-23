#import "THEORCTEventBroadcastModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTEventBroadcastModule_objc

RCT_EXPORT_MODULE(THEORCTEventBroadcastModule)
@synthesize bridge = _bridge;

- (instancetype)init {
    if (self = [super init]) {
        self.eventBroadcastAPI = [[THEOplayerRCTEventBroadcastAPI alloc] init];
    }
    return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeEventBroadcastModuleSpecJSI>(params);
}

- (void)broadcastEvent:(NSInteger)tag event:(NSDictionary *)event { 
    
}

@end
