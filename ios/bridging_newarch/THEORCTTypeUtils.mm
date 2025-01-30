#import "THEORCTTypeUtils.h"
#import <Foundation/Foundation.h>
#import "RCTConvert.h"

using namespace facebook::react;
using namespace JS::NativeAdsModule;

@implementation THEORCTTypeUtils

+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData {
    NSMutableDictionary *scheduledAdDict = [[NSMutableDictionary alloc] init];
    return @{
        @"license": @(structData.license.c_str()),
        @"licenseUrl": @(structData.licenseUrl.c_str()),
        @"chromeless": @(structData.chromeless),
        @"hlsDateRange": @(structData.hlsDateRange),
    };
}

+ (NSDictionary *) scheduledAd:(ScheduledAd) scheduledAdData {
    NSMutableDictionary *scheduledAdDict = [[NSMutableDictionary alloc] init];
    NSString *integration = scheduledAdData.integration();
    if (integration) {
        scheduledAdDict[@"integration"] = integration;
    }
    if (scheduledAdData.sources().has_value()) {
        ScheduledAdSources sources = scheduledAdData.sources().value();
        NSMutableDictionary *sourcesDict = [[NSMutableDictionary alloc] init];
        NSString *src = sources.src();
        if (src) {
            sourcesDict[@"src"] = src;
        }
        NSString *type = sources.type();
        if (type) {
            sourcesDict[@"type"] = type;
        }
        scheduledAdDict[@"sources"] = sourcesDict;
        
    }
    if (scheduledAdData.timeOffset().has_value()) {
        double timeOffset = scheduledAdData.timeOffset().value();
        scheduledAdDict[@"timeOffset"] = @(timeOffset);
    }
    return scheduledAdDict;
}

+ (NSDictionary *) obstruction:(SpecAddFriendlyObstructionObstruction) obstructionData {
    NSMutableDictionary *obstructionDict = [[NSMutableDictionary alloc] init];
    obstructionDict[@"view"] = @(obstructionData.view());
    obstructionDict[@"purpose"] = obstructionData.purpose();
    obstructionDict[@"reason"] = obstructionData.reason();
    return obstructionDict;
}

+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativePlayerReady event = THEOplayerRCTViewEventEmitter::OnNativePlayerReady();
    NSDictionary *versionDict = eventData[@"version"];
    if (versionDict) {
        THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion eventVersion = THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion();
        NSString *version = versionDict[@"version"];
        eventVersion.version = [version UTF8String];
        NSString *playerSuiteVersion = versionDict[@"playerSuiteVersion"];
        eventVersion.playerSuiteVersion = [playerSuiteVersion UTF8String];
        event.version = eventVersion;
    }
    
    THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState eventState = THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState();
    event.state = eventState;
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange) nativeReadyStateChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange event = THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange();
    NSNumber *readyState = eventData[@"readyState"];
    event.readyState = [readyState doubleValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeDurationChange) nativeDurationChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeDurationChange event = THEOplayerRCTViewEventEmitter::OnNativeDurationChange();
    NSNumber *duration = eventData[@"duration"];
    event.duration = [duration doubleValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeVolumeChange) nativeVolumeChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeVolumeChange event = THEOplayerRCTViewEventEmitter::OnNativeVolumeChange();
    NSNumber *volume = eventData[@"volume"];
    event.volume = [volume doubleValue];
    NSNumber *muted = eventData[@"muted"];
    event.muted = [muted boolValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeProgress) nativeProgressDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeProgress event = THEOplayerRCTViewEventEmitter::OnNativeProgress();
    NSArray *seekableTimeRanges = eventData[@"seekable"];
    NSArray *bufferedTimeRanges = eventData[@"buffered"];
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable> seekable;
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered> buffered;
    
    NSDictionary *item;
    if (seekableTimeRanges) {
        for (item in seekableTimeRanges) {
            NSNumber *start = item[@"start"];
            NSNumber *end = item[@"end"];
            seekable.push_back(THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable{
                [start doubleValue],
                [end doubleValue]
            });
        }
    }
    if (bufferedTimeRanges) {
        for (item in bufferedTimeRanges) {
            NSNumber *start = item[@"start"];
            NSNumber *end = item[@"end"];
            buffered.push_back(THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered{
                [start doubleValue],
                [end doubleValue]
            });
        }
    }
    
    event.seekable = seekable;
    event.buffered = buffered;

    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate) nativeTimeUpdateDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate event = THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate();
    NSNumber *currentTime = eventData[@"currentTime"];
    event.currentTime = [currentTime doubleValue];
    NSNumber *currentProgramDateTime = eventData[@"currentProgramDateTime"];
    event.currentProgramDateTime = [currentProgramDateTime doubleValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeError) nativeErrorDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeError event = THEOplayerRCTViewEventEmitter::OnNativeError();
    NSDictionary *errorDict = eventData[@"error"];
    if (errorDict) {
        THEOplayerRCTViewEventEmitter::OnNativeErrorError eventError = THEOplayerRCTViewEventEmitter::OnNativeErrorError();
        NSString *errorCode = errorDict[@"errorCode"];
        eventError.errorCode = [errorCode UTF8String];
        NSString *errorMessage = errorDict[@"errorMessage"];
        eventError.errorCode = [errorMessage UTF8String];
        event.error = eventError;
    }
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeRateChange) nativeRateChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeRateChange event = THEOplayerRCTViewEventEmitter::OnNativeRateChange();
    NSNumber *playbackRate = eventData[@"playbackRate"];
    event.playbackRate = [playbackRate doubleValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeResize) nativeResizeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeResize event = THEOplayerRCTViewEventEmitter::OnNativeResize();
    NSNumber *width = eventData[@"width"];
    NSNumber *height = eventData[@"height"];
    event.width = [width doubleValue];
    event.height = [height doubleValue];
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata) nativeLoadedMetadataDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange) nativePresentationModeChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange event = THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange();
    NSString *presentationMode = eventData[@"presentationMode"];
    event.presentationMode = [presentationMode UTF8String];
    NSString *previousPresentationMode = eventData[@"previousPresentationMode"];
    event.previousPresentationMode = [previousPresentationMode UTF8String];
    NSDictionary *contextDict = eventData[@"context"];
    if (contextDict) {
        THEOplayerRCTViewEventEmitter::OnNativePresentationModeChangeContext eventContext = THEOplayerRCTViewEventEmitter::OnNativePresentationModeChangeContext();
        NSString *pipContext = contextDict[@"pip"];
        eventContext.pip = [pipContext UTF8String];
        event.context = eventContext;
    }
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent) nativeTextTrackListEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent) nativeTextTrackEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent) nativeMediaTrackListEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent) nativeMediaTrackEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeCastEvent) nativeCastEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeCastEvent {
        
        // TODO
        
    };
}

+ (THEOplayerRCTViewEventEmitter::OnNativeAdEvent) nativeAdEventDataFrom:(NSDictionary*) eventData {
    return THEOplayerRCTViewEventEmitter::OnNativeAdEvent {
        
        // TODO
        
    };
}

@end
