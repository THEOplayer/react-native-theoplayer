#import "THEORCTCastModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTCastModule_objc

RCT_EXPORT_MODULE(THEORCTCastModule)
@synthesize bridge = _bridge;

- (instancetype)init {
    if (self = [super init]) {
        self.castAPI = [[THEOplayerRCTCastAPI alloc] init];
    }
    return self;
}

- (dispatch_queue_t)methodQueue {
    // All methods on THEORCTCastModule require the main thread For THEOplayerRCTView lookup (UI action)
    return dispatch_get_main_queue();
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeCastModuleSpecJSI>(params);
}

- (THEOplayerRCTView *) viewForTag:(double)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[_bridge.uiManager viewForReactTag:@(tag)];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)runForTag:(double)tag block:(void (^)(THEOplayerRCTView *view))actionBlock {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *view = [weakSelf viewForTag:tag];
        if (view && actionBlock) {
            actionBlock(view);
        }
    });
}

- (void)airplayState:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI airplayState:view
                           resolve:resolve
                            reject:reject];
    }];
}

- (void)airplayCasting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI airplayCasting:view
                             resolve:resolve
                              reject:reject];
    }];
}

- (void)airplayStart:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI airplayStart:view];
    }];
}

- (void)airplayStop:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI airplayStop:view];
    }];
}

- (void)casting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI casting:view
                      resolve:resolve
                       reject:reject];
    }];
}

- (void)chromecastState:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastState:view
                              resolve:resolve
                               reject:reject];
    }];
}

- (void)chromecastCasting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastCasting:view
                                resolve:resolve
                                 reject:reject];
    }];
}

- (void)chromecastJoin:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastJoin:view];
    }];
}

- (void)chromecastLeave:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastLeave:view];
    }];
}

- (void)chromecastStart:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastStart:view];
    }];
}

- (void)chromecastStop:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.castAPI chromecastStop:view];
    }];
}

@end
