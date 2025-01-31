#import "THEORCTAdsModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"
#import "THEORCTTypeUtils.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTAdsModule_objc

RCT_EXPORT_MODULE(THEORCTAdsModule)
@synthesize bridge = _bridge;

- (instancetype)init {
    if (self = [super init]) {
        self.adsAPI = [[THEOplayerRCTAdsAPI alloc] init];
    }
    return self;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeAdsModuleSpecJSI>(params);
}

- (THEOplayerRCTView *) viewForTag:(double)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[_bridge.uiManager viewForReactTag:@(tag)];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)runForTag:(double)tag block:(void (^)(THEOplayerRCTView *view))actionBlock {
    __weak THEORCTAdsModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *view = [weakSelf viewForTag:tag];
        if (view && actionBlock) {
            actionBlock(view);
        }
    });
}

- (void)currentAdBreak:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI currentAdBreak:view
                            resolve:resolve
                             reject:reject];
    }];
}

- (void)currentAds:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI currentAds:view
                        resolve:resolve
                         reject:reject];
    }];
}

- (void)playing:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI playing:view
                     resolve:resolve
                      reject:reject];
    }];
}

- (void)scheduledAdBreaks:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI scheduledAdBreaks:view
                               resolve:resolve
                                reject:reject];
    }];
}

- (void)skip:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI skip:view];
    }];
}

- (void)schedule:(double)tag ad:(JS::NativeAdsModule::ScheduledAd &)ad {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI schedule:view
                           ad: [THEORCTTypeUtils scheduledAd:ad]];
    }];
}

// DAI

- (void)daiContentTimeForStreamTime:(double)tag time:(double)time resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI daiContentTimeForStreamTime:view
                                       timeValue:@(time)
                                         resolve:resolve
                                          reject:reject];
    }];
}

- (void)daiSetSnapback:(double)tag enabled:(BOOL)enabled {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI daiSetSnapback:view
                            enabled:enabled];
    }];
}

- (void)daiSnapback:(double)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI daiSnapback:view
                         resolve:resolve
                          reject:reject];
    }];
}

- (void)daiStreamTimeForContentTime:(double)tag time:(double)time resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI daiStreamTimeForContentTime:view
                                       timeValue:@(time)
                                         resolve:resolve
                                          reject:reject];
    }];
}

// OMID

- (void)addFriendlyObstruction:(double)tag obstruction:(JS::NativeAdsModule::FriendlyObstruction &)obstruction {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI addFriendlyObstruction:view
                            obstructionView:[self viewForTag:obstruction.view()]
                                obstruction:[THEORCTTypeUtils obstruction:obstruction]];
    }];
}

- (void)removeAllFriendlyObstructions:(double)tag {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.adsAPI removeAllFriendlyObstructions:view];
    }];
}






@end
