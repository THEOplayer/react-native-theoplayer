//
//  THEORCTAdsModule.m
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(THEORCTAdsModule, NSObject)

RCT_EXTERN_METHOD(skip:(nonnull NSNumber *)node);

RCT_EXTERN_METHOD(playing:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentAdBreak:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(currentAds:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(scheduledAdBreaks:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(schedule:(nonnull NSNumber *)node
                  ad:(NSDictionary)ad);

RCT_EXTERN_METHOD(daiSnapback:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(daiSetSnapback:(nonnull NSNumber *)node
                  enabled:(BOOL)enabled);

RCT_EXTERN_METHOD(daiContentTimeForStreamTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)timeValue
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(daiStreamTimeForContentTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)timeValue
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(addFriendlyObstruction:(nonnull NSNumber *)node
                  obstruction:(NSDictionary)obstruction);

RCT_EXTERN_METHOD(removeAllFriendlyObstructions:(nonnull NSNumber *)node);

@end
