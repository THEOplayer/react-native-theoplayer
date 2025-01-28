#import "THEOplayerRCTView.h"
#import "THEORCTTypeUtils.h"
#import "../newarch/rntheo/ComponentDescriptors.h"
#import "../newarch/rntheo/RCTComponentViewHelpers.h"

#import "RCTFabricComponentsPlugins.h"

#import <react_native_theoplayer-Swift.h>

using namespace facebook::react;

@interface THEOplayerRCTView_objc () <RCTTHEOplayerRCTViewViewProtocol>
@end

@implementation THEOplayerRCTView_objc {
    THEOplayerRCTView * _view;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const THEOplayerRCTViewProps>();
        _props = defaultProps;
        
        // create theoplayer view
        _view = [[THEOplayerRCTView alloc] init];
        
        // attach the native callbacks to the bridge code
        [self attachNativeCallbacks];
        
        // attach the view
        self.contentView = _view;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
    const auto &oldViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(props);
    
    // pass the player config to the bridge code
    if (oldViewProps.config.license != newViewProps.config.license) {
        [_view setConfig: [THEORCTTypeUtils configFrom: newViewProps.config]];
    }
    
    [super updateProps:props oldProps:oldProps];
}


- (void)attachNativeCallbacks {
    __weak THEOplayerRCTView_objc *weakSelf = self;
    [_view setOnNativePlay:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePlay({}); }];
    [_view setOnNativePause:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePause({}); }];
    [_view setOnNativeSourceChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeSourceChange({}); }];
    [_view setOnNativeLoadStart:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeLoadStart({}); }];
    [_view setOnNativePlaying:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePlaying({}); }];
    [_view setOnNativeSeeking:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeSeeking({}); }];
    [_view setOnNativeSeeked:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeSeeked({}); }];
    [_view setOnNativeEnded:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeEnded({}); }];
    [_view setOnNativeLoadedData:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeLoadedData({}); }];
    [_view setOnNativeWaiting:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeWaiting({}); }];
    [_view setOnNativeCanPlay:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeCanPlay({}); }];
    [_view setOnNativePlayerReady:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePlayerReady([THEORCTTypeUtils nativePlayerReadyDataFrom:eventData]); }];
    [_view setOnNativeReadyStateChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeReadyStateChange([THEORCTTypeUtils nativeReadyStateChangeDataFrom:eventData]); }];
    [_view setOnNativeDurationChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeDurationChange([THEORCTTypeUtils nativeDurationChangeDataFrom:eventData]); }];
    [_view setOnNativeVolumeChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeVolumeChange([THEORCTTypeUtils nativeVolumeChangeDataFrom:eventData]); }];
    [_view setOnNativeProgress:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeProgress([THEORCTTypeUtils nativeProgressDataFrom:eventData]); }];
    [_view setOnNativeTimeUpdate:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeTimeUpdate([THEORCTTypeUtils nativeTimeUpdateDataFrom:eventData]); }];
    [_view setOnNativeError:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeError([THEORCTTypeUtils nativeErrorDataFrom:eventData]); }];
    [_view setOnNativeRateChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeRateChange([THEORCTTypeUtils nativeRateChangeDataFrom:eventData]); }];
    [_view setOnNativeLoadedMetadata:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeLoadedMetadata([THEORCTTypeUtils nativeLoadedMetadataDataFrom:eventData]); }];
    [_view setOnNativeResize:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeResize([THEORCTTypeUtils nativeResizeDataFrom:eventData]); }];
}

// New arch specific

+ (ComponentDescriptorProvider)componentDescriptorProvider {
    return concreteComponentDescriptorProvider<THEOplayerRCTViewComponentDescriptor>();
}

Class<RCTComponentViewProtocol> THEOplayerRCTViewCls(void) {
    return THEOplayerRCTView_objc.class;
}

// Event emitter convenience method
- (const THEOplayerRCTViewEventEmitter &)eventEmitter {
    return static_cast<const THEOplayerRCTViewEventEmitter &>(*_eventEmitter);
}

@end
