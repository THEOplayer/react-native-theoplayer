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

+ (ComponentDescriptorProvider)componentDescriptorProvider {
    return concreteComponentDescriptorProvider<THEOplayerRCTViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const THEOplayerRCTViewProps>();
        _props = defaultProps;
        
        // create theoplayer view
        _view = [[THEOplayerRCTView alloc] init];
        self.contentView = _view;
        
        // setup callbacks
        __weak THEOplayerRCTView_objc *weakSelf = self;
        [_view setOnNativePlayerReady:^(NSDictionary *eventData) {
            weakSelf.eventEmitter.onNativePlayerReady([THEORCTTypeUtils nativePlayerReadyDataFrom:eventData]);
        }];
        [_view setOnNativePlay:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePlay({}); }];
        [_view setOnNativePause:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativePause({}); }];
        [_view setOnNativeSourceChange:^(NSDictionary *eventData) { weakSelf.eventEmitter.onNativeSourceChange({}); }];
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
    const auto &oldViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(props);
    
    if (oldViewProps.config.license != newViewProps.config.license) {
        [_view setConfig: [THEORCTTypeUtils configFrom: newViewProps.config]];
    }
    
    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> THEOplayerRCTViewCls(void) {
    return THEOplayerRCTView_objc.class;
}

// Event emitter convenience method
- (const THEOplayerRCTViewEventEmitter &)eventEmitter {
    return static_cast<const THEOplayerRCTViewEventEmitter &>(*_eventEmitter);
}

@end
