#import "THEORCTTypeUtils.h"
#import <Foundation/Foundation.h>

using namespace facebook::react;

@implementation THEORCTTypeUtils

+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData {
    return @{
        @"license": @(structData.license.c_str()),
        @"licenseUrl": @(structData.licenseUrl.c_str()),
        @"chromeless": @(structData.chromeless),
        @"hlsDateRange": @(structData.hlsDateRange),
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*) eventData {
    NSDictionary *versionDict = eventData[@"version"];
    NSString *version = versionDict[@"version"];
    NSString *playerSuiteVersion = versionDict[@"playerSuiteVersion"];
    return THEOplayerRCTViewEventEmitter::OnNativePlayerReady{
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion {
            [version UTF8String],
            [playerSuiteVersion UTF8String]
        },
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState{ }
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange) nativeReadyStateChangeDataFrom:(NSDictionary*) eventData {
    NSNumber *readyState = eventData[@"readyState"];
    return THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange {
        [readyState intValue]
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeDurationChange) nativeDurationChangeDataFrom:(NSDictionary*) eventData {
    NSNumber *duration = eventData[@"duration"];
    return THEOplayerRCTViewEventEmitter::OnNativeDurationChange {
        [duration doubleValue]
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeVolumeChange) nativeVolumeChangeDataFrom:(NSDictionary*) eventData {
    NSNumber *volume = eventData[@"volume"];
    NSNumber *muted = eventData[@"muted"];
    return THEOplayerRCTViewEventEmitter::OnNativeVolumeChange {
        [volume doubleValue],
        [muted boolValue]
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeProgress) nativeProgressDataFrom:(NSDictionary*) eventData {
    NSArray *seekableTimeRanges = eventData[@"seekable"];
    NSArray *bufferedTimeRanges = eventData[@"buffered"];
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable> seekable;
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered> buffered;
    NSDictionary *item;
    for (item in seekableTimeRanges) {
        NSNumber *start = item[@"start"];
        NSNumber *end = item[@"end"];
        seekable.push_back(THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable{
            [start doubleValue],
            [end doubleValue]
        });
    }
    for (item in bufferedTimeRanges) {
        NSNumber *start = item[@"start"];
        NSNumber *end = item[@"end"];
        buffered.push_back(THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered{
            [start doubleValue],
            [end doubleValue]
        });
    }
    return THEOplayerRCTViewEventEmitter::OnNativeProgress {
        seekable,
        buffered
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate) nativeTimeUpdateDataFrom:(NSDictionary*) eventData {
    NSNumber *currentTime = eventData[@"currentTime"];
    NSNumber *currentProgramDateTime = eventData[@"currentProgramDateTime"];
    return THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate {
        [currentTime doubleValue],
        [currentProgramDateTime doubleValue]
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeError) nativeErrorDataFrom:(NSDictionary*) eventData {
    NSDictionary *errorDict = eventData[@"error"];
    NSString *errorCode = errorDict[@"errorCode"];
    NSString *errorMessage = errorDict[@"errorMessage"];
    return THEOplayerRCTViewEventEmitter::OnNativeError {
        THEOplayerRCTViewEventEmitter::OnNativeErrorError {
            [errorCode UTF8String],
            [errorMessage UTF8String]
        }
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeRateChange) nativeRateChangeDataFrom:(NSDictionary*) eventData {
    NSNumber *playbackRate = eventData[@"playbackRate"];
    return THEOplayerRCTViewEventEmitter::OnNativeRateChange {
        [playbackRate doubleValue],
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata) nativeLoadedMetadataDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeResize) nativeResizeDataFrom:(NSDictionary*) eventData {
    NSNumber *width = eventData[@"width"];
    NSNumber *height = eventData[@"height"];
    return THEOplayerRCTViewEventEmitter::OnNativeResize {
        [width doubleValue],
        [height doubleValue]
    };
}


@end
