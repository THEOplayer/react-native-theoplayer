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

- (THEOplayerRCTView *) viewForTag:(double)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[_bridge.uiManager viewForReactTag:@(tag)];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)runForTag:(double)tag block:(void (^)(THEOplayerRCTView *view))actionBlock {
    __weak THEORCTEventBroadcastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *view = [weakSelf viewForTag:tag];
        if (view && actionBlock) {
            actionBlock(view);
        }
    });
}

- (void)broadcastEvent:(double)tag event:(NSDictionary *)event {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.eventBroadcastAPI broadcastEvent:view
                                         event:event];
    }];
}

@end
