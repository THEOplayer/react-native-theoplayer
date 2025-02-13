#import "THEORCTTypeUtils.h"
#import "THEORCTBridgingTypeUtils.h"
#import <Foundation/Foundation.h>
#import "RCTConvert.h"

using namespace facebook::react;
using namespace JS::NativeAdsModule;

@implementation THEORCTTypeUtils

// ==========================
// C++ struct => NSDictionary
// ==========================

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigAdsImaStruct &ima) {
    return @{
        @"ppid": [NSString stringWithUTF8String:ima.ppid.c_str()],
        @"maxRedirects": @(ima.maxRedirects),
        @"autoPlayAdBreaks": @(ima.autoPlayAdBreaks),
        @"sessionID": [NSString stringWithUTF8String:ima.sessionID.c_str()],
        @"enableDebugMode": @(ima.enableDebugMode),
        @"bitrate": @(ima.bitrate)
    };
}

NSArray<NSString *> *convertVectorToNSArray(const std::vector<std::string> &vec) {
    NSMutableArray<NSString *> *array = [NSMutableArray arrayWithCapacity:vec.size()];
    for (const auto &str : vec) {
        [array addObject:[NSString stringWithUTF8String:str.c_str()]];
    }
    return [array copy];
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigAdsStruct &ads) {
    return @{
        @"allowedMimeTypes": convertVectorToNSArray(ads.allowedMimeTypes),
        @"uiEnabled": @(ads.uiEnabled),
        @"preload": [NSString stringWithUTF8String:ads.preload.c_str()],
        @"vpaidMode": [NSString stringWithUTF8String:ads.vpaidMode.c_str()],
        @"ima": convertToNSDictionary(ads.ima),
        @"theoads": @(ads.theoads)
    };
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigCastChromecastStruct &chromecast) {
    return @{
        @"appID": [NSString stringWithUTF8String:chromecast.appID.c_str()]
    };
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigCastStruct &cast) {
    return @{
        @"chromecast": convertToNSDictionary(cast.chromecast),
        @"strategy": [NSString stringWithUTF8String:cast.strategy.c_str()]
    };
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigUiStruct &ui) {
    return @{
        @"language": [NSString stringWithUTF8String:ui.language.c_str()]
    };
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigMediaControlStruct &mediaControl) {
    return @{
        @"mediaSessionEnabled": @(mediaControl.mediaSessionEnabled),
        @"skipForwardInterval": @(mediaControl.skipForwardInterval),
        @"skipBackwardInterval": @(mediaControl.skipBackwardInterval),
        @"convertSkipToSeek": @(mediaControl.convertSkipToSeek)
    };
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigStruct &config) {
    return @{
        @"libraryLocation": [NSString stringWithUTF8String:config.libraryLocation.c_str()],
        @"mutedAutoplay": [NSString stringWithUTF8String:config.mutedAutoplay.c_str()],
        @"ads": convertToNSDictionary(config.ads),
        @"cast": convertToNSDictionary(config.cast),
        @"ui": convertToNSDictionary(config.ui),
        @"mediaControl": convertToNSDictionary(config.mediaControl),
        @"license": [NSString stringWithUTF8String:config.license.c_str()],
        @"licenseUrl": [NSString stringWithUTF8String:config.licenseUrl.c_str()],
        @"chromeless": @(config.chromeless),
        @"hlsDateRange": @(config.hlsDateRange),
        @"liveOffset": @(config.liveOffset)
    };
}

+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData {
    NSDictionary *config = convertToNSDictionary(structData);
    NSLog(@"Extracted config: %@", config);
    return config;
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

// ==========================
// NSDictionary => C++ struct
// ==========================

+ (std::string)stringFromDict:(NSDictionary *)dict key:(NSString *)key {
    NSString *value = dict[key];
    return value ? [value UTF8String] : "";
}

+ (double)doubleFromDict:(NSDictionary *)dict key:(NSString *)key {
    NSNumber *value = dict[key];
    return value ? [value doubleValue] : 0.0;
}

+ (bool)boolFromDict:(NSDictionary *)dict key:(NSString *)key {
    NSNumber *value = dict[key];
    return value ? [value boolValue] : false;
}

+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*)eventData {
    THEOplayerRCTViewEventEmitter::OnNativePlayerReady playerReadyData;
    NSDictionary *versionData = eventData[@"version"];
    THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion version;
    version.version = [self stringFromDict:versionData key:@"version"];
    version.playerSuiteVersion = [self stringFromDict:versionData key:@"playerSuiteVersion"];
    playerReadyData.version = version;
    THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState state;
    playerReadyData.state = state;
    return playerReadyData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange) nativeReadyStateChangeDataFrom:(NSDictionary*)eventData {
    THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange readyStateChangeData;
    readyStateChangeData.readyState = [self doubleFromDict:eventData key:@"readyState"];
    return readyStateChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeDurationChange)nativeDurationChangeDataFrom:(NSDictionary *)eventData {
    THEOplayerRCTViewEventEmitter::OnNativeDurationChange durationChangeData;
    durationChangeData.duration = [self doubleFromDict:eventData key:@"duration"];
    return durationChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeVolumeChange)nativeVolumeChangeDataFrom:(NSDictionary*)eventData {
    THEOplayerRCTViewEventEmitter::OnNativeVolumeChange volumeChangeData;
    volumeChangeData.volume = [self doubleFromDict:eventData key:@"volume"];
    volumeChangeData.muted = [self boolFromDict:eventData key:@"muted"];
    return volumeChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeProgress) nativeProgressDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeProgress progressData;
    NSArray *seekableArray = eventData[@"seekable"];
    for (NSDictionary *seekableDict in seekableArray) {
        THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable seekableItem;
        seekableItem.start = [self doubleFromDict:seekableDict key:@"start"];
        seekableItem.end = [self doubleFromDict:seekableDict key:@"end"];
        progressData.seekable.push_back(seekableItem);
    }
    NSArray *bufferedArray = eventData[@"buffered"];
    for (NSDictionary *bufferedDict in bufferedArray) {
        THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered bufferedItem;
        bufferedItem.start = [self doubleFromDict:bufferedDict key:@"start"];
        bufferedItem.end = [self doubleFromDict:bufferedDict key:@"end"];
        progressData.buffered.push_back(bufferedItem);
    }
    return progressData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate) nativeTimeUpdateDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate timeUpdateData;
    timeUpdateData.currentTime = [self doubleFromDict:eventData key:@"currentTime"];
    timeUpdateData.currentProgramDateTime = [self doubleFromDict:eventData key:@"currentProgramDateTime"];
    return timeUpdateData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeError)nativeErrorDataFrom:(NSDictionary*)eventData {
    THEOplayerRCTViewEventEmitter::OnNativeError errorData;
    NSDictionary *errorErrorData = eventData[@"error"];
    THEOplayerRCTViewEventEmitter::OnNativeErrorError error;
    error.errorCode = [self stringFromDict:errorErrorData key:@"errorCode"];
    error.errorMessage = [self stringFromDict:errorErrorData key:@"errorMessage"];
    errorData.error = error;
    return errorData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeRateChange) nativeRateChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeRateChange rateChangeData;
    rateChangeData.playbackRate = [self doubleFromDict:eventData key:@"playbackRate"];
    return rateChangeData;
}

+ (THEORCTBridgingTypeUtils::BridgedCue)BridgedCueFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedCue cue;
    cue.id = [self stringFromDict:dict key:@"id"];
    cue.uid = [self doubleFromDict:dict key:@"uid"];
    cue.startTime = [self doubleFromDict:dict key:@"startTime"];
    cue.endTime = [self doubleFromDict:dict key:@"endTime"];
    cue.startDate = [self doubleFromDict:dict key:@"startDate"];
    cue.endDate = [self doubleFromDict:dict key:@"endDate"];
    cue.classString = [self stringFromDict:dict key:@"classString"];
    cue.duration = [self doubleFromDict:dict key:@"duration"];
    cue.plannedDuration = [self doubleFromDict:dict key:@"plannedDuration"];
    cue.endOnNext = [self boolFromDict:dict key:@"endOnNext"];
    THEORCTBridgingTypeUtils::BridgedCueContent content;
    // TODO: EXTRACT CONTENT
    cue.content = content;
    THEORCTBridgingTypeUtils::BridgedCueCustomAttributes customAttributes;
    // TODO: EXTRACT ATTRIBUTES
    cue.customAttributes = customAttributes;
    return cue;
}

+ (THEORCTBridgingTypeUtils::BridgedQuality)BridgedQualityFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedQuality quality;
    quality.averageBandwidth = [self doubleFromDict:dict key:@"averageBandwidth"];
    quality.bandwidth = [self doubleFromDict:dict key:@"bandwidth"];
    quality.codecs = [self stringFromDict:dict key:@"codecs"];
    quality.id = [self stringFromDict:dict key:@"id"];
    quality.uid = [self doubleFromDict:dict key:@"uid"];
    quality.name = [self stringFromDict:dict key:@"name"];
    quality.label = [self stringFromDict:dict key:@"label"];
    quality.available = [self boolFromDict:dict key:@"available"];
    quality.width = [self doubleFromDict:dict key:@"width"];
    quality.height = [self doubleFromDict:dict key:@"height"];
    return quality;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues)nativeLoadedMetadataTextTracksCuesFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [self BridgedCueFrom:dict];
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues cue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeLoadedMetadataTextTracksCues(bridgedCue);
    return cue;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues>)nativeLoadedMetadataTextTracksCuesArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues> cues;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues cue = [self nativeLoadedMetadataTextTracksCuesFrom:item];
        cues.push_back(cue);
    }
    return cues;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksActiveQuality)nativeLoadedMetadataAudioTracksActiveQualityFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:dict];
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksActiveQuality quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeLoadedMetadataAudioTracksActiveQuality(bridgedQuality);
    return quality;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities)nativeLoadedMetadataAudioTracksQualitiesFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:dict];
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeLoadedMetadataAudioTracksQualities(bridgedQuality);
    return quality;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities>)nativeLoadedMetadataAudioTracksQualitiesArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities> qualities;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities quality = [self nativeLoadedMetadataAudioTracksQualitiesFrom:item];
        qualities.push_back(quality);
    }
    return qualities;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksActiveQuality)nativeLoadedMetadataVideoTracksActiveQualityFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:dict];
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksActiveQuality quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeLoadedMetadataVideoTracksActiveQuality(bridgedQuality);
    return quality;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities)nativeLoadedMetadataVideoTracksQualitiesFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:dict];
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeLoadedMetadataVideoTracksQualities(bridgedQuality);
    return quality;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities>)nativeLoadedMetadataVideoTracksQualitiesArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities> qualities;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities quality = [self nativeLoadedMetadataVideoTracksQualitiesFrom:item];
        qualities.push_back(quality);
    }
    return qualities;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracks)nativeLoadedMetadataTextTracksFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracks textTrack;
    textTrack.kind = [self stringFromDict:dict key:@"kind"];
    textTrack.label = [self stringFromDict:dict key:@"label"];
    textTrack.language = [self stringFromDict:dict key:@"language"];
    textTrack.id = [self stringFromDict:dict key:@"id"];
    textTrack.uid = [self doubleFromDict:dict key:@"uid"];
    textTrack.mode = [self stringFromDict:dict key:@"mode"];
    textTrack.type = [self stringFromDict:dict key:@"type"];
    textTrack.cues = [self nativeLoadedMetadataTextTracksCuesArrayFrom:dict[@"cues"]];
    textTrack.src = [self stringFromDict:dict key:@"src"];
    textTrack.forced = [self boolFromDict:dict key:@"forced"];
    return textTrack;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks)nativeLoadedMetadataAudioTracksFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks audioTrack;
    audioTrack.id = [self stringFromDict:dict key:@"id"];
    audioTrack.uid = [self doubleFromDict:dict key:@"uid"];
    audioTrack.kind = [self stringFromDict:dict key:@"kind"];
    audioTrack.label = [self stringFromDict:dict key:@"label"];
    audioTrack.language = [self stringFromDict:dict key:@"language"];
    audioTrack.activeQuality = [self nativeLoadedMetadataAudioTracksActiveQualityFrom:dict[@"activeQuality"]];
    audioTrack.qualities = [self nativeLoadedMetadataAudioTracksQualitiesArrayFrom:dict[@"qualities"]];
    audioTrack.enabled = [self boolFromDict:dict key:@"enabled"];
    return audioTrack;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks)nativeLoadedMetadataVideoTracksFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks videoTrack;
    videoTrack.id = [self stringFromDict:dict key:@"id"];
    videoTrack.uid = [self doubleFromDict:dict key:@"uid"];
    videoTrack.kind = [self stringFromDict:dict key:@"kind"];
    videoTrack.label = [self stringFromDict:dict key:@"label"];
    videoTrack.language = [self stringFromDict:dict key:@"language"];
    videoTrack.activeQuality = [self nativeLoadedMetadataVideoTracksActiveQualityFrom:dict[@"activeQuality"]];
    videoTrack.qualities = [self nativeLoadedMetadataVideoTracksQualitiesArrayFrom:dict[@"qualities"]];
    videoTrack.enabled = [self boolFromDict:dict key:@"enabled"];
    return videoTrack;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracks>)nativeLoadedMetadataTextTracksArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracks> textTracks;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracks textTrack = [self nativeLoadedMetadataTextTracksFrom:item];
        textTracks.push_back(textTrack);
    }
    return textTracks;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks>)nativeLoadedMetadataAudioTracksArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks> audioTracks;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks audioTrack = [self nativeLoadedMetadataAudioTracksFrom:item];
        audioTracks.push_back(audioTrack);
    }
    return audioTracks;
}

+ (std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks>)nativeLoadedMetadataVideoTracksArrayFrom:(NSArray *)array {
    std::vector<THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks> videoTracks;
    for (NSDictionary *item in array) {
        THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks videoTrack = [self nativeLoadedMetadataVideoTracksFrom:item];
        videoTracks.push_back(videoTrack);
    }
    return videoTracks;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata)nativeLoadedMetadataDataFrom:(NSDictionary *)eventData {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata metadata;
    metadata.textTracks = [self nativeLoadedMetadataTextTracksArrayFrom:eventData[@"textTracks"]];
    metadata.audioTracks = [self nativeLoadedMetadataAudioTracksArrayFrom:eventData[@"audioTracks"]];
    metadata.videoTracks = [self nativeLoadedMetadataVideoTracksArrayFrom:eventData[@"videoTracks"]];
    metadata.duration = [self doubleFromDict:eventData key:@"duration"];
    metadata.selectedTextTrack = [self doubleFromDict:eventData key:@"selectedTextTrack"];
    metadata.selectedVideoTrack = [self doubleFromDict:eventData key:@"selectedVideoTrack"];
    metadata.selectedAudioTrack = [self doubleFromDict:eventData key:@"selectedAudioTrack"];
    return metadata;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeResize) nativeResizeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeResize resizeData;
    
    // Extract width and height from NSDictionary
    NSNumber *width = eventData[@"width"];
    NSNumber *height = eventData[@"height"];
    
    if (width && [width isKindOfClass:[NSNumber class]]) {
        resizeData.width = [width doubleValue];
    } else {
        resizeData.width = 0.0; // Default value or handle error
    }
    
    if (height && [height isKindOfClass:[NSNumber class]]) {
        resizeData.height = [height doubleValue];
    } else {
        resizeData.height = 0.0; // Default value or handle error
    }
    
    return resizeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange) nativePresentationModeChangeDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange result;
    
    // Extracting simple strings
    if ([eventData objectForKey:@"presentationMode"]) {
        result.presentationMode = [eventData[@"presentationMode"] UTF8String];
    }
    if ([eventData objectForKey:@"previousPresentationMode"]) {
        result.previousPresentationMode = [eventData[@"previousPresentationMode"] UTF8String];
    }
    
    // Extracting nested struct for context
    if ([eventData objectForKey:@"context"]) {
        NSDictionary *contextData = eventData[@"context"];
        if ([contextData objectForKey:@"pip"]) {
            result.context.pip = [contextData[@"pip"] UTF8String];
        }
    }
    
    return result;
}


+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent)nativeTextTrackListEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent event;
    
    // Extract type
    event.type = [eventData[@"type"] doubleValue];
    
    // Extract track
    NSDictionary *trackData = eventData[@"track"];
    if (trackData) {
        THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrack track;
        track.kind = [trackData[@"kind"] UTF8String];
        track.label = [trackData[@"label"] UTF8String];
        track.language = [trackData[@"language"] UTF8String];
        track.id = [trackData[@"id"] UTF8String];
        track.uid = [trackData[@"uid"] doubleValue];
        track.mode = [trackData[@"mode"] UTF8String];
        track.type = [trackData[@"type"] UTF8String];
        track.src = [trackData[@"src"] UTF8String];
        track.forced = [trackData[@"forced"] boolValue];
        
        // Extract cues
        NSArray *cuesData = trackData[@"cues"];
        if (cuesData) {
            for (NSDictionary *cueData in cuesData) {
                THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [self BridgedCueFrom:cueData];
                THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues cue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackListEventTrackCues(bridgedCue);
                track.cues.push_back(cue);
            }
        }
        
        event.track = track;
    }
    
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent)nativeTextTrackEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent event;
    
    // Extract type and trackUid
    event.type = [eventData[@"type"] doubleValue];
    event.trackUid = [eventData[@"trackUid"] doubleValue];
    
    // Extract cue
    NSDictionary *cueData = eventData[@"cue"];
    if (cueData) {
        THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [self BridgedCueFrom:cueData];
        THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCue cue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackEventCue(bridgedCue);
        event.cue = cue;
    }
    
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent)nativeMediaTrackListEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent event;
    
    // Extract type and trackType
    event.type = [eventData[@"type"] doubleValue];
    event.trackType = [eventData[@"trackType"] doubleValue];
    
    // Extract track
    NSDictionary *trackData = eventData[@"track"];
    if (trackData) {
        THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrack track;
        track.id = [trackData[@"id"] UTF8String];
        track.uid = [trackData[@"uid"] doubleValue];
        track.kind = [trackData[@"kind"] UTF8String];
        track.label = [trackData[@"label"] UTF8String];
        track.language = [trackData[@"language"] UTF8String];
        track.enabled = [trackData[@"enabled"] boolValue];
        
        // Extract activeQuality
        NSDictionary *activeQualityData = trackData[@"activeQuality"];
        if (activeQualityData) {
            THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality activeQuality;
            activeQuality.averageBandwidth = [activeQualityData[@"averageBandwidth"] doubleValue];
            activeQuality.bandwidth = [activeQualityData[@"bandwidth"] doubleValue];
            activeQuality.codecs = [activeQualityData[@"codecs"] UTF8String];
            activeQuality.id = [activeQualityData[@"id"] UTF8String];
            activeQuality.uid = [activeQualityData[@"uid"] doubleValue];
            activeQuality.name = [activeQualityData[@"name"] UTF8String];
            activeQuality.label = [activeQualityData[@"label"] UTF8String];
            activeQuality.available = [activeQualityData[@"available"] boolValue];
            activeQuality.width = [activeQualityData[@"width"] doubleValue];
            activeQuality.height = [activeQualityData[@"height"] doubleValue];
            
            track.activeQuality = activeQuality;
        }
        
        // Extract qualities
        NSArray *qualitiesData = trackData[@"qualities"];
        if (qualitiesData) {
            for (NSDictionary *qualityData in qualitiesData) {
                THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackQualities quality;
                quality.averageBandwidth = [qualityData[@"averageBandwidth"] doubleValue];
                quality.bandwidth = [qualityData[@"bandwidth"] doubleValue];
                quality.codecs = [qualityData[@"codecs"] UTF8String];
                quality.id = [qualityData[@"id"] UTF8String];
                quality.uid = [qualityData[@"uid"] doubleValue];
                quality.name = [qualityData[@"name"] UTF8String];
                quality.label = [qualityData[@"label"] UTF8String];
                quality.available = [qualityData[@"available"] boolValue];
                quality.width = [qualityData[@"width"] doubleValue];
                quality.height = [qualityData[@"height"] doubleValue];
                
                track.qualities.push_back(quality);
            }
        }
        
        event.track = track;
    }
    
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent)nativeMediaTrackEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent event;
    
    // Extract type, trackType, and trackUid
    event.type = [eventData[@"type"] doubleValue];
    event.trackType = [eventData[@"trackType"] doubleValue];
    event.trackUid = [eventData[@"trackUid"] doubleValue];
    
    // Extract qualities
    NSArray *qualitiesData = eventData[@"qualities"];
    if (qualitiesData) {
        for (NSDictionary *qualityData in qualitiesData) {
            THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities quality;
            quality.averageBandwidth = [qualityData[@"averageBandwidth"] doubleValue];
            quality.bandwidth = [qualityData[@"bandwidth"] doubleValue];
            quality.codecs = [qualityData[@"codecs"] UTF8String];
            quality.id = [qualityData[@"id"] UTF8String];
            quality.uid = [qualityData[@"uid"] doubleValue];
            quality.name = [qualityData[@"name"] UTF8String];
            quality.label = [qualityData[@"label"] UTF8String];
            quality.available = [qualityData[@"available"] boolValue];
            quality.width = [qualityData[@"width"] doubleValue];
            quality.height = [qualityData[@"height"] doubleValue];
            
            event.qualities.push_back(quality);
        }
    }
    
    return event;
}


+ (THEOplayerRCTViewEventEmitter::OnNativeCastEvent)nativeCastEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeCastEvent event;
    
    // Extract type and state
    event.type = [eventData[@"type"] UTF8String];
    event.state = [eventData[@"state"] UTF8String];
    
    // Extract error
    NSDictionary *errorData = eventData[@"error"];
    if (errorData) {
        THEOplayerRCTViewEventEmitter::OnNativeCastEventError error;
        error.errorCode = [errorData[@"errorCode"] UTF8String];
        error.description = [errorData[@"description"] UTF8String];
        
        event.error = error;
    }
    
    return event;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeAdEvent)nativeAdEventDataFrom:(NSDictionary*) eventData {
    THEOplayerRCTViewEventEmitter::OnNativeAdEvent event;
    
    // Extract type
    event.type = [eventData[@"type"] UTF8String];
    
    // Extract ad
    NSDictionary *adData = eventData[@"ad"];
    if (adData) {
        THEOplayerRCTViewEventEmitter::OnNativeAdEventAd ad;
        ad.adSystem = [adData[@"adSystem"] UTF8String];
        ad.integration = [adData[@"integration"] UTF8String];
        ad.type = [adData[@"type"] UTF8String];
        ad.id = [adData[@"id"] UTF8String];
        ad.readyState = [adData[@"readyState"] UTF8String];
        ad.duration = [adData[@"duration"] doubleValue];
        ad.width = [adData[@"width"] doubleValue];
        ad.height = [adData[@"height"] doubleValue];
        ad.resourceURI = [adData[@"resourceURI"] UTF8String];
        ad.clickThrough = [adData[@"clickThrough"] UTF8String];
        ad.skipOffset = [adData[@"skipOffset"] doubleValue];
        ad.creativeId = [adData[@"creativeId"] UTF8String];
        ad.timeOffset = [adData[@"timeOffset"] doubleValue];
        ad.maxDuration = [adData[@"maxDuration"] doubleValue];
        ad.maxRemainingDuration = [adData[@"maxRemainingDuration"] doubleValue];
        
        // Extract adBreak
        NSDictionary *adBreakData = adData[@"adBreak"];
        if (adBreakData) {
            THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdBreak adBreak;
            adBreak.integration = [adBreakData[@"integration"] UTF8String];
            adBreak.timeOffset = [adBreakData[@"timeOffset"] doubleValue];
            adBreak.maxDuration = [adBreakData[@"maxDuration"] doubleValue];
            adBreak.maxRemainingDuration = [adBreakData[@"maxRemainingDuration"] doubleValue];
            
            ad.adBreak = adBreak;
        }
        
        // Extract companions
        NSDictionary *companionsData = adData[@"companions"];
        if (companionsData) {
            THEOplayerRCTViewEventEmitter::OnNativeAdEventAdCompanions companions;
            companions.adSlotId = [companionsData[@"adSlotId"] UTF8String];
            companions.altText = [companionsData[@"altText"] UTF8String];
            companions.contentHTML = [companionsData[@"contentHTML"] UTF8String];
            companions.clickThrough = [companionsData[@"clickThrough"] UTF8String];
            companions.width = [companionsData[@"width"] doubleValue];
            companions.height = [companionsData[@"height"] doubleValue];
            companions.resourceURI = [companionsData[@"resourceURI"] UTF8String];
            
            ad.companions = companions;
        }
        
        // Extract universalAdIds
        NSArray *universalAdIdsData = adData[@"universalAdIds"];
        if (universalAdIdsData) {
            for (NSDictionary *universalAdIdData in universalAdIdsData) {
                THEOplayerRCTViewEventEmitter::OnNativeAdEventAdUniversalAdIds universalAdId;
                universalAdId.adIdRegistry = [universalAdIdData[@"adIdRegistry"] UTF8String];
                universalAdId.adIdValue = [universalAdIdData[@"adIdValue"] UTF8String];
                
                ad.universalAdIds.push_back(universalAdId);
            }
        }
        
        // Extract ads
        NSArray *adsData = adData[@"ads"];
        if (adsData) {
            for (NSDictionary *adItemData in adsData) {
                THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAds adItem;
                adItem.adSystem = [adItemData[@"adSystem"] UTF8String];
                adItem.integration = [adItemData[@"integration"] UTF8String];
                adItem.type = [adItemData[@"type"] UTF8String];
                adItem.id = [adItemData[@"id"] UTF8String];
                adItem.readyState = [adItemData[@"readyState"] UTF8String];
                adItem.duration = [adItemData[@"duration"] doubleValue];
                adItem.width = [adItemData[@"width"] doubleValue];
                adItem.height = [adItemData[@"height"] doubleValue];
                adItem.resourceURI = [adItemData[@"resourceURI"] UTF8String];
                adItem.clickThrough = [adItemData[@"clickThrough"] UTF8String];
                adItem.skipOffset = [adItemData[@"skipOffset"] doubleValue];
                adItem.creativeId = [adItemData[@"creativeId"] UTF8String];
                
                // Extract companions for ads
                NSDictionary *companionsData = adItemData[@"companions"];
                if (companionsData) {
                    THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdsCompanions companions;
                    companions.adSlotId = [companionsData[@"adSlotId"] UTF8String];
                    companions.altText = [companionsData[@"altText"] UTF8String];
                    companions.contentHTML = [companionsData[@"contentHTML"] UTF8String];
                    companions.clickThrough = [companionsData[@"clickThrough"] UTF8String];
                    companions.width = [companionsData[@"width"] doubleValue];
                    companions.height = [companionsData[@"height"] doubleValue];
                    companions.resourceURI = [companionsData[@"resourceURI"] UTF8String];
                    
                    adItem.companions = companions;
                }
                
                // Extract universalAdIds for ads
                NSArray *universalAdIdsData = adItemData[@"universalAdIds"];
                if (universalAdIdsData) {
                    for (NSDictionary *universalAdIdData in universalAdIdsData) {
                        THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdsUniversalAdIds universalAdId;
                        universalAdId.adIdRegistry = [universalAdIdData[@"adIdRegistry"] UTF8String];
                        universalAdId.adIdValue = [universalAdIdData[@"adIdValue"] UTF8String];
                        
                        adItem.universalAdIds.push_back(universalAdId);
                    }
                }
                
                ad.ads.push_back(adItem);
            }
        }
        
        event.ad = ad;
    }
    
    return event;
}

@end
