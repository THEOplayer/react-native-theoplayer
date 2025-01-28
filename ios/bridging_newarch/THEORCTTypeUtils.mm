#import "THEORCTTypeUtils.h"

using namespace facebook::react;

@implementation THEORCTTypeUtils

+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*) eventData {
    NSDictionary *versionDict = eventData[@"version"];
    NSString *version = versionDict[@"version"];
    NSString *playerSuiteVersion = versionDict[@"playerSuiteVersion"];
    return THEOplayerRCTViewEventEmitter::OnNativePlayerReady{
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion{
            [version UTF8String],
            [playerSuiteVersion UTF8String]
        },
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState{ }
    };
}

+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData {
    return @{
        @"license": @(structData.license.c_str()),
        @"licenseUrl": @(structData.licenseUrl.c_str()),
        @"chromeless": @(structData.chromeless),
        @"hlsDateRange": @(structData.hlsDateRange),
    };
}

@end
