//
//  THEORCTCastModule.m
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(THEORCTCastModule, NSObject)

RCT_EXTERN_METHOD(casting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

// chromecast specific
RCT_EXTERN_METHOD(chromecastCasting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(chromecastState:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(chromecastStart:(nonnull NSNumber *)node);

RCT_EXTERN_METHOD(chromecastStop:(nonnull NSNumber *)node);

RCT_EXTERN_METHOD(chromecastJoin:(nonnull NSNumber *)node);

RCT_EXTERN_METHOD(chromecastLeave:(nonnull NSNumber *)node);

// airplay specific
RCT_EXTERN_METHOD(airplayCasting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(airplayState:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(airplayStart:(nonnull NSNumber *)node);

RCT_EXTERN_METHOD(airplayStop:(nonnull NSNumber *)node);

@end
