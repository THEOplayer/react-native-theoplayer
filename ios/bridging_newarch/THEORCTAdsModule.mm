#import "THEORCTAdsModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

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

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeAdsModuleSpecJSI>(params);
}

- (void)addFriendlyObstruction:(NSInteger)tag obstruction:(JS::NativeAdsModule::SpecAddFriendlyObstructionObstruction &)obstruction { 
    
}

- (void)currentAdBreak:(NSInteger)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)currentAds:(NSInteger)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)daiContentTimeForStreamTime:(NSInteger)tag time:(double)time resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)daiSetSnapback:(NSInteger)tag enabled:(BOOL)enabled { 
    
}

- (void)daiSnapback:(NSInteger)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)daiStreamTimeForContentTime:(NSInteger)tag time:(double)time resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)playing:(NSInteger)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)removeAllFriendlyObstructions:(NSInteger)tag { 
    
}

- (void)schedule:(NSInteger)tag ad:(JS::NativeAdsModule::SpecScheduleAd &)ad { 
    
}

- (void)scheduledAdBreaks:(NSInteger)tag resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    
}

- (void)skip:(NSInteger)tag { 
    
}

@end
