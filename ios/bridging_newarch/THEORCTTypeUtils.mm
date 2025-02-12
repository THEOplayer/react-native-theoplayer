#import "THEORCTTypeUtils.h"
#import "THEORCTBridgingTypeUtils.h"
#import <Foundation/Foundation.h>
#import "RCTConvert.h"

using namespace facebook::react;
using namespace JS::NativeAdsModule;

@implementation THEORCTTypeUtils

+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData {
    // ads
    THEOplayerRCTViewConfigAdsStruct adsData = structData.ads;
    std::vector<std::string> allowedMimeTypes = adsData.allowedMimeTypes;
    // cast
    THEOplayerRCTViewConfigCastStruct castData = structData.cast;
    THEOplayerRCTViewConfigCastChromecastStruct chromecastData = castData.chromecast;
    // ui
    THEOplayerRCTViewConfigUiStruct uiData = structData.ui;
    // mediacontrol
    THEOplayerRCTViewConfigMediaControlStruct mediaControlData = structData.mediaControl;
    
    std::vector<std::string> allowedMimeTypes = adsData.allowedMimeTypes;
    return @{
        @"license": @(structData.license.c_str()),
        @"licenseUrl": @(structData.licenseUrl.c_str()),
        @"chromeless": @(structData.chromeless),
        @"hlsDateRange": @(structData.hlsDateRange),
        @"liveOffset": @(structData.liveOffset),
        @"mutedAutoplay": @(structData.mutedAutoplay.c_str()),
        @"libraryLocation": @(structData.libraryLocation.c_str()),
        @"ads": @{
            @"uiEnabled": @(adsData.uiEnabled),
            @"preload": @(adsData.preload.c_str()),
            @"vpaidMode": @(adsData.vpaidMode.c_str()),
            @"theoads": @(adsData.theoads),
            @"allowedMimeTypes": @[]
        },
        @"cast": @{
            @"strategy": @(castData.strategy.c_str()),
            @"chromecast": @{
                @"appID": @(chromecastData.appID.c_str())
            }
        },
        @"ui": @{
            @"language": @(uiData.language.c_str())
        },
        @"mediaControl": @{
            @"mediaSessionEnabled": @(mediaControlData.mediaSessionEnabled),
            @"skipForwardInterval": @(mediaControlData.skipBackwardInterval),
            @"skipBackwardInterval": @(mediaControlData.skipBackwardInterval),
            @"convertSkipToSeek": @(mediaControlData.convertSkipToSeek)
        }
    };
    
    
    
    
    
    /*
     
     struct THEOplayerRCTViewConfigAdsStruct {
       std::vector<std::string> allowedMimeTypes{};
       bool uiEnabled{false};
       std::string preload{};
       std::string vpaidMode{};
       THEOplayerRCTViewConfigAdsImaStruct ima{};
       bool theoads{false};
     };
     */
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

+ (NSDictionary *) obstruction:(FriendlyObstruction) obstructionData {
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
        
        // TODO: IN PROGRESS
        
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

+ (THEORCTBridgingTypeUtils::BridgedCue) bridgedCueFrom:(NSDictionary*) eventData {
    THEORCTBridgingTypeUtils::BridgedCue cue = THEORCTBridgingTypeUtils::BridgedCue();
    NSString *cueId = eventData[@"id"];
    cue.id = [cueId UTF8String];
    NSNumber *uid = eventData[@"uid"];
    cue.uid = [uid doubleValue];
    NSNumber *startTime = eventData[@"startTime"];
    cue.startTime = [startTime doubleValue];
    NSNumber *endTime = eventData[@"endTime"];
    cue.endTime = [endTime doubleValue];
    THEORCTBridgingTypeUtils::BridgedCueContent cueContent = THEORCTBridgingTypeUtils::BridgedCueContent();
    
    // TODO: IN PROGRESS
    
    cue.content = cueContent;
    NSNumber *startDate = eventData[@"startDate"];
    if (startDate) {
        cue.startDate = [startDate doubleValue];
    }
    NSNumber *endDate = eventData[@"endDate"];
    if (endDate) {
        cue.endDate = [endDate doubleValue];
    }
    NSString *cueClass = eventData[@"class"];
    if (cueClass) {
        cue.classString = [cueClass UTF8String];
    }
    NSNumber *duration = eventData[@"duration"];
    if (duration) {
        cue.duration = [duration doubleValue];
    }
    NSNumber *plannedDuration = eventData[@"plannedDuration"];
    if (plannedDuration) {
        cue.plannedDuration = [plannedDuration doubleValue];
    }
    NSNumber *endOnNext = eventData[@"endOnNext"];
    if (endOnNext) {
        cue.endOnNext = [endOnNext boolValue];
    }
    THEORCTBridgingTypeUtils::BridgedCueCustomAttributes cueCustomAttributes = THEORCTBridgingTypeUtils::BridgedCueCustomAttributes();
    
    // TODO: IN PROGRESS
    
    cue.customAttributes = cueCustomAttributes;
    return cue;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent) nativeTextTrackListEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent event = THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent();
    NSNumber *type = eventData[@"type"];
    event.type = [type doubleValue];
    NSDictionary *trackDict = eventData[@"track"];
    if (trackDict) {
        THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrack eventTrack = THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrack();
        NSString *kind = trackDict[@"kind"];
        eventTrack.kind = [kind UTF8String];
        NSString *label = trackDict[@"label"];
        eventTrack.label = [label UTF8String];
        NSString *language = trackDict[@"language"];
        eventTrack.language = [language UTF8String];
        NSString *idStr = trackDict[@"id"];
        eventTrack.id = [idStr UTF8String];
        NSString *uid = trackDict[@"uid"];
        eventTrack.uid = [uid doubleValue];
        NSString *mode = trackDict[@"mode"];
        eventTrack.mode = [mode UTF8String];
        NSString *type = trackDict[@"type"];
        eventTrack.type = [type UTF8String];
        NSString *src = trackDict[@"src"];
        eventTrack.src = [src UTF8String];
        NSNumber *forced = trackDict[@"forced"];
        eventTrack.forced = [forced boolValue];
        NSArray *cuesList = trackDict[@"cues"];
        std::vector<THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues> cues;
        NSDictionary *cueDict;
        if (cuesList) {
            for (cueDict in cuesList) {
                THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [THEORCTTypeUtils bridgedCueFrom:cueDict];
                THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues newCue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackListEventTrackCues(bridgedCue);
                cues.push_back(newCue);
            }
        }
        eventTrack.cues = cues;
        event.track = eventTrack;
    }
    
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent) nativeTextTrackEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent event = THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent();
    NSNumber *type = eventData[@"type"];
    event.type = [type doubleValue];
    NSNumber *trackUid = eventData[@"trackUid"];
    event.trackUid = [trackUid doubleValue];
    
    NSDictionary *cueDict = eventData[@"cue"];
    THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [THEORCTTypeUtils bridgedCueFrom:cueDict];
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCue newCue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackEventCue(bridgedCue);
    event.cue = newCue;
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent) nativeMediaTrackListEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent event = THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent();
    NSNumber *type = eventData[@"type"];
    event.type = [type doubleValue];
    NSNumber *trackType = eventData[@"trackType"];
    event.trackType = [trackType doubleValue];
    
    NSDictionary *trackDict = eventData[@"track"];
    if (trackDict) {
        THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrack eventTrack = THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrack();
        NSString *kind = trackDict[@"kind"];
        eventTrack.kind = [kind UTF8String];
        NSString *label = trackDict[@"label"];
        eventTrack.label = [label UTF8String];
        NSString *language = trackDict[@"language"];
        eventTrack.language = [language UTF8String];
        NSString *idStr = trackDict[@"id"];
        eventTrack.id = [idStr UTF8String];
        NSString *uid = trackDict[@"uid"];
        eventTrack.uid = [uid doubleValue];
        NSNumber *enabled = trackDict[@"enabled"];
        eventTrack.enabled = [enabled boolValue];
        
        // activeQuality and qualities are not available on iOS / tvOS SDK's
        THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality trackActiveQuality =  THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality();
        std::vector<THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackQualities> trackQualities;
        eventTrack.activeQuality = trackActiveQuality;
        eventTrack.qualities = trackQualities;
        
        event.track = eventTrack;
    }
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent) nativeMediaTrackEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent event = THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent();
    NSNumber *type = eventData[@"type"];
    event.type = [type doubleValue];
    NSNumber *trackType = eventData[@"trackType"];
    event.trackType = [trackType doubleValue];
    NSNumber *trackUid = eventData[@"trackUid"];
    event.trackUid = [trackUid doubleValue];
    
    // on iOS / tvOS the SDK provides only the current active quality for this event.
    NSArray *qualityList = eventData[@"qualities"];
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities> trackQualities;
    NSDictionary *qualityDict;
    if (qualityList) {
        for (qualityDict in qualityList) {
            THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities trackActiveQuality =  THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities();
            NSNumber *bandwidth = qualityDict[@"bandwidth"];
            trackActiveQuality.bandwidth = [bandwidth doubleValue];
            NSString *codecs = qualityDict[@"codecs"];
            trackActiveQuality.codecs = [codecs UTF8String];
            NSString *qualityId = qualityDict[@"id"];
            trackActiveQuality.id = [qualityId UTF8String];
            NSNumber *uid = qualityDict[@"uid"];
            trackActiveQuality.uid = [uid doubleValue];
            NSString *name = qualityDict[@"name"];
            trackActiveQuality.name = [name UTF8String];
            NSString *label = qualityDict[@"label"];
            trackActiveQuality.label = [label UTF8String];
            NSNumber *available = qualityDict[@"available"];
            trackActiveQuality.available = [available boolValue];
            NSNumber *width = qualityDict[@"width"];
            if (width) {
                trackActiveQuality.width = [width doubleValue];
            }
            NSNumber *height = qualityDict[@"height"];
            if (height) {
                trackActiveQuality.height = [height doubleValue];
            }
            trackQualities.push_back(trackActiveQuality);
        }
    }
    event.qualities = trackQualities;
    return event;
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
