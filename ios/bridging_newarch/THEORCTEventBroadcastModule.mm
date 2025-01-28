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

- (THEOplayerRCTView *) viewForTag:(NSNumber *)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[self.bridge.uiManager viewForReactTag:tag];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)broadcastEvent:(NSInteger)tag event:(NSDictionary *)event {
    __weak THEORCTEventBroadcastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.eventBroadcastAPI broadcastEvent:theView event:event];
    });
    
}

@end
