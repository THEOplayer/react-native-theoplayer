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

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeCastModuleSpecJSI>(params);
}

- (THEOplayerRCTView *) viewForTag:(NSNumber *)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[self.bridge.uiManager viewForReactTag:tag];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)airplayState:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI airplayState:theView resolve:resolve reject:reject];
    });
}

- (void)airplayCasting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI airplayCasting:theView resolve:resolve reject:reject];
    });
}

- (void)airplayStart:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI airplayStart:theView];
    });
}

- (void)airplayStop:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI airplayStop:theView];
    });
}

- (void)casting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI casting:theView resolve:resolve reject:reject];
    });
}

- (void)chromecastState:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastState:theView resolve:resolve reject:reject];
    });
}

- (void)chromecastCasting:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastCasting:theView resolve:resolve reject:reject];
    });
}

- (void)chromecastJoin:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastJoin:theView];
    });
}

- (void)chromecastLeave:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastLeave:theView];
    });
}

- (void)chromecastStart:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastStart:theView];
    });
}

- (void)chromecastStop:(double)tag {
    __weak THEORCTCastModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.castAPI chromecastStop:theView];
    });
}

@end
