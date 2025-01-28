#import "THEORCTPlayerModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTPlayerModule_objc

RCT_EXPORT_MODULE(THEORCTPlayerModule)
@synthesize bridge = _bridge;

- (instancetype)init {
    if (self = [super init]) {
        self.playerAPI = [[THEOplayerRCTPlayerAPI alloc] init];
    }
    return self;
}

- (THEOplayerRCTView *) viewForTag:(NSNumber *)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[self.bridge.uiManager viewForReactTag:tag];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativePlayerModuleSpecJSI>(params);
}

- (void)setPaused:(double)tag paused:(BOOL)paused {
    __weak THEORCTPlayerModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.playerAPI setPaused:theView paused:paused];
    });
}

- (void)version:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve([self.playerAPI version]);
}

- (void)setABRConfig:(double)tag config:(NSDictionary *)config {
    
}


- (void)setAspectRatio:(double)tag ratio:(NSString *)ratio {
    
}


- (void)setBackgroundAudioConfig:(double)tag config:(NSDictionary *)config {
    
}


- (void)setCurrentTime:(double)tag seekTime:(double)seekTime {
    
}


- (void)setKeepScreenOn:(double)tag keepScreenOn:(BOOL)keepScreenOn {
    
}


- (void)setMuted:(double)tag muted:(BOOL)muted {
    
}


- (void)setPipConfig:(double)tag config:(NSDictionary *)config {
    
}


- (void)setPlaybackRate:(double)tag rate:(double)rate {
    
}


- (void)setPreload:(double)tag type:(NSString *)type {
    
}


- (void)setPresentationMode:(double)tag mode:(NSString *)mode {
    
}


- (void)setRenderingTarget:(double)tag target:(NSString *)target {
    
}


- (void)setSelectedAudioTrack:(double)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSelectedTextTrack:(double)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSelectedVideoTrack:(double)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSource:(double)tag source:(NSDictionary *)source {
    __weak THEORCTPlayerModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *theView = [weakSelf viewForTag:[NSNumber numberWithDouble:tag]];
        [self.playerAPI setSource:theView src:source];
    });
}


- (void)setTargetVideoQuality:(double)tag qualities:(NSArray *)qualities {
    
}


- (void)setTextTrackStyle:(double)tag style:(NSDictionary *)style {
    
}


- (void)setVolume:(double)tag volume:(double)volume {
    
}

@end
