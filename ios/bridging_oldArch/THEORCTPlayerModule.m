//
//  THEORCTPlayerModule.m
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(THEORCTPlayerModule, NSObject)

RCT_EXTERN_METHOD(version:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(setPaused:(nonnull NSNumber *)node
                  paused:(BOOL)paused);

RCT_EXTERN_METHOD(setSource:(nonnull NSNumber *)node
                  src:(NSDictionary)src);

RCT_EXTERN_METHOD(setABRConfig:(nonnull NSNumber *)node
                  abrConfig:(NSDictionary)abrConfig);

RCT_EXTERN_METHOD(setCurrentTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)time);

RCT_EXTERN_METHOD(setMuted:(nonnull NSNumber *)node
                  muted:(BOOL)muted);

RCT_EXTERN_METHOD(setVolume:(nonnull NSNumber *)node
                  volume:(nonnull NSNumber *)volume);

RCT_EXTERN_METHOD(setPlaybackRate:(nonnull NSNumber *)node
                  playbackRate:(nonnull NSNumber *)playbackRate);

RCT_EXTERN_METHOD(setPresentationMode:(nonnull NSNumber *)node
                  presentationMode:(nonnull NSString *)presentationMode);

RCT_EXTERN_METHOD(setAspectRatio:(nonnull NSNumber *)node
                  ratio:(nonnull NSString *)ratio);

RCT_EXTERN_METHOD(setPipConfig:(nonnull NSNumber *)node
                  pipConfig:(NSDictionary)pipConfig);

RCT_EXTERN_METHOD(setBackgroundAudioConfig:(nonnull NSNumber *)node
                  backgroundAudioConfig:(NSDictionary)backgroundAudioConfig);

RCT_EXTERN_METHOD(setSelectedTextTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid);

RCT_EXTERN_METHOD(setSelectedAudioTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid);

RCT_EXTERN_METHOD(setSelectedVideoTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid);

RCT_EXTERN_METHOD(setTargetVideoQuality:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid);

RCT_EXTERN_METHOD(setPreload:(nonnull NSNumber *)node
                  type:(nonnull NSString *)type);

RCT_EXTERN_METHOD(setTextTrackStyle:(nonnull NSNumber *)node
                  textTrackStyle:(NSDictionary)textTrackStyle);

@end
