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

- (dispatch_queue_t)methodQueue {
    // All methods on THEORCTPlayerModule require the main thread For THEOplayerRCTView lookup (UI action)
    return dispatch_get_main_queue();
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativePlayerModuleSpecJSI>(params);
}

- (THEOplayerRCTView *) viewForTag:(double)tag {
    THEOplayerRCTView_objc *theComponentView = (THEOplayerRCTView_objc *)[_bridge.uiManager viewForReactTag:@(tag)];
    return (THEOplayerRCTView *)theComponentView.contentView;
}

- (void)runForTag:(double)tag block:(void (^)(THEOplayerRCTView *view))actionBlock {
    __weak THEORCTPlayerModule_objc *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        THEOplayerRCTView *view = [weakSelf viewForTag:tag];
        if (view && actionBlock) {
            actionBlock(view);
        }
    });
}

- (void)version:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve([self.playerAPI version]);
}

- (void)setPaused:(double)tag paused:(BOOL)paused {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setPaused:view
                           paused:paused];
    }];
}

- (void)setABRConfig:(double)tag config:(NSDictionary *)config {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setABRConfig:view
                           abrConfig:config];
    }];
}

- (void)setAspectRatio:(double)tag ratio:(NSString *)ratio {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setAspectRatio:view
                                 ratio:ratio];
    }];
}

- (void)setBackgroundAudioConfig:(double)tag config:(NSDictionary *)config {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setBackgroundAudioConfig:view
                           backgroundAudioConfig:config];
    }];
}

- (void)setCurrentTime:(double)tag seekTime:(double)seekTime {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setCurrentTime:view
                                  time:[NSNumber numberWithDouble:seekTime]];
    }];
}

- (void)setMuted:(double)tag muted:(BOOL)muted {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setMuted:view
                           muted:muted];
    }];
}

- (void)setPipConfig:(double)tag config:(NSDictionary *)config {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setPipConfig:view
                           pipConfig:config];
    }];
}

- (void)setPlaybackRate:(double)tag rate:(double)rate {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setPlaybackRate:view
                           playbackRate:[NSNumber numberWithDouble:rate]];
    }];
}

- (void)setPreload:(double)tag type:(NSString *)type {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setPreload:view
                              type:type];
    }];
}

- (void)setPresentationMode:(double)tag mode:(NSString *)mode {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setPresentationMode:view
                           presentationMode:mode];
    }];
}

- (void)setSelectedAudioTrack:(double)tag trackUid:(NSNumber *)trackUid {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setSelectedAudioTrack:view
                                          uid:trackUid];
    }];
}

- (void)setSelectedTextTrack:(double)tag trackUid:(NSNumber *)trackUid {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setSelectedTextTrack:view
                                         uid:trackUid];
    }];
}

- (void)setSelectedVideoTrack:(double)tag trackUid:(NSNumber *)trackUid {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setSelectedVideoTrack:view
                                          uid:trackUid];
    }];
}

- (void)setSource:(double)tag source:(NSDictionary *)source {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setSource:view
                              src:source];
    }];
}

- (void)setTargetVideoQuality:(double)tag qualities:(NSArray *)qualities {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setTargetVideoQuality:view
                                          uid:qualities];
    }];
}

- (void)setTextTrackStyle:(double)tag style:(NSDictionary *)style {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setTextTrackStyle:view
                           textTrackStyle:style];
    }];
}

- (void)setVolume:(double)tag volume:(double)volume {
    [self runForTag:tag block:^(THEOplayerRCTView *view) {
        [self.playerAPI setVolume:view
                           volume:[NSNumber numberWithDouble:volume]];
    }];
}

- (void)setRenderingTarget:(double)tag target:(NSString *)target {
    NSLog(@"THEORCTPlayerModule.setRenderingTarget() has no implementation for native iOS.");
}

- (void)setKeepScreenOn:(double)tag keepScreenOn:(BOOL)keepScreenOn {
    NSLog(@"THEORCTPlayerModule.setKeepScreenOn() has no implementation for native iOS.");
}

@end
