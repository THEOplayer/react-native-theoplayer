#import "THEOplayerRCTView.h"

#import "../newarch/rntheo/ComponentDescriptors.h"
#import "../newarch/rntheo/EventEmitters.h"
#import "../newarch/rntheo/Props.h"
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
        
        _view = [[THEOplayerRCTView alloc] init];
        
        __weak THEOplayerRCTView_objc *weakSelf = self;
        [_view setOnNativePlayerReady:^(NSDictionary *eventData) {
            [weakSelf onNativePlayerReady:eventData];
        }];
        
        self.contentView = _view;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
    const auto &oldViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<THEOplayerRCTViewProps const>(props);
    
    if (oldViewProps.config.license != newViewProps.config.license) {
        THEOplayerRCTViewConfigStruct newConfig = newViewProps.config;
        [_view setConfig: @{
            @"license": @(newConfig.license.c_str()),
            @"licenseUrl": @(newConfig.licenseUrl.c_str()),
            @"chromeless": @(newConfig.chromeless),
            @"hlsDateRange": @(newConfig.hlsDateRange),
        }];
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

- (void)onNativePlayerReady:(NSDictionary*) eventData {
    NSDictionary *versionDict = eventData[@"version"];
    NSString *version = versionDict[@"version"];
    NSString *playerSuiteVersion = versionDict[@"playerSuiteVersion"];
    THEOplayerRCTViewEventEmitter::OnNativePlayerReady responseData = THEOplayerRCTViewEventEmitter::OnNativePlayerReady{
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion{
            [version UTF8String],
            [playerSuiteVersion UTF8String]
        },
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState{ }
    };
    
    self.eventEmitter.onNativePlayerReady(responseData);
}

@end
