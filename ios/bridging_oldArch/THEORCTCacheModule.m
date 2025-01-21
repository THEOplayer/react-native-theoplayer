//
//  THEORCTCacheModule.m
//

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(THEORCTCacheModule, NSObject)

RCT_EXTERN_METHOD(getInitialState:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(createTask:(NSDictionary)src
                  params:(NSDictionary)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(startCachingTask:(nonnull NSString *)id);

RCT_EXTERN_METHOD(pauseCachingTask:(nonnull NSString *)id);

RCT_EXTERN_METHOD(removeCachingTask:(nonnull NSString *)id);

RCT_EXTERN_METHOD(renewLicense:(nonnull NSString *)id
                  drmConfig:(NSDictionary)drmConfig);

@end
