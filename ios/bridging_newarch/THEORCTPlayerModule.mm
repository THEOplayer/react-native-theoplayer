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

- (void)setABRConfig:(NSInteger)tag config:(NSDictionary *)config {
    
}


- (void)setAspectRatio:(NSInteger)tag ratio:(NSString *)ratio {
    
}


- (void)setBackgroundAudioConfig:(NSInteger)tag config:(NSDictionary *)config {
    
}


- (void)setCurrentTime:(NSInteger)tag seekTime:(double)seekTime {
    
}


- (void)setKeepScreenOn:(NSInteger)tag keepScreenOn:(BOOL)keepScreenOn {
    
}


- (void)setMuted:(NSInteger)tag muted:(BOOL)muted {
    
}


- (void)setPipConfig:(NSInteger)tag config:(NSDictionary *)config {
    
}


- (void)setPlaybackRate:(NSInteger)tag rate:(double)rate {
    
}


- (void)setPreload:(NSInteger)tag type:(NSString *)type {
    
}


- (void)setPresentationMode:(NSInteger)tag mode:(NSString *)mode {
    
}


- (void)setRenderingTarget:(NSInteger)tag target:(NSString *)target {
    
}


- (void)setSelectedAudioTrack:(NSInteger)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSelectedTextTrack:(NSInteger)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSelectedVideoTrack:(NSInteger)tag trackUid:(NSNumber *)trackUid {
    
}


- (void)setSource:(NSInteger)tag source:(NSDictionary *)source {
    
}


- (void)setTargetVideoQuality:(NSInteger)tag qualities:(NSArray *)qualities {
    
}


- (void)setTextTrackStyle:(NSInteger)tag style:(NSDictionary *)style {
    
}


- (void)setVolume:(NSInteger)tag volume:(double)volume {
    
}

@end
