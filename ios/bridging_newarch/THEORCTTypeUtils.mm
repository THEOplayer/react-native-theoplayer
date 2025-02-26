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
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *ppid = [NSString stringWithUTF8String:ima.ppid.c_str()];
    if (![ppid isEqual: @""]) {
        dict[@"ppid"] = ppid;
    }
    NSString *sessionID = [NSString stringWithUTF8String:ima.sessionID.c_str()];
    if (![sessionID isEqual: @""]) {
        dict[@"sessionID"] = sessionID;
    }
    NSNumber *maxRedirects = [NSNumber numberWithInt:ima.maxRedirects];
    if (maxRedirects.intValue >= 0) {
        dict[@"maxRedirects"] = maxRedirects;
    }
    NSNumber *bitrate = [NSNumber numberWithInt:ima.bitrate];
    if (bitrate.intValue >= 0) {
        dict[@"bitrate"] = bitrate;
    }
    
    dict[@"autoPlayAdBreaks"] = @(ima.autoPlayAdBreaks);
    dict[@"enableDebugMode"] = @(ima.enableDebugMode);
    
    return dict;
}

NSArray<NSString *> *convertVectorToNSArray(const std::vector<std::string> &vec) {
    NSMutableArray<NSString *> *array = [NSMutableArray arrayWithCapacity:vec.size()];
    for (const auto &str : vec) {
        [array addObject:[NSString stringWithUTF8String:str.c_str()]];
    }
    return [array copy];
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigAdsStruct &ads) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *preload = [NSString stringWithUTF8String:ads.preload.c_str()];
    if (![preload isEqual: @""]) {
        dict[@"preload"] = preload;
    }
    NSString *vpaidMode = [NSString stringWithUTF8String:ads.vpaidMode.c_str()];
    if (![vpaidMode isEqual: @""]) {
        dict[@"vpaidMode"] = vpaidMode;
    }
    
    dict[@"allowedMimeTypes"] = convertVectorToNSArray(ads.allowedMimeTypes);
    dict[@"ima"] = convertToNSDictionary(ads.ima);
    
    dict[@"uiEnabled"] = @(ads.uiEnabled);
    dict[@"theoads"] = @(ads.theoads);
    
    return dict;
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigCastChromecastStruct &chromecast) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *appID = [NSString stringWithUTF8String:chromecast.appID.c_str()];
    if (![appID isEqual: @""]) {
        dict[@"appID"] = appID;
    }
    
    return dict;
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigCastStruct &cast) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *strategy = [NSString stringWithUTF8String:cast.strategy.c_str()];
    if (![strategy isEqual: @""]) {
        dict[@"strategy"] = strategy;
    }
    dict[@"chromecast"] =  convertToNSDictionary(cast.chromecast);
    
    return dict;
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigUiStruct &ui) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *language = [NSString stringWithUTF8String:ui.language.c_str()];
    if (![language isEqual: @""]) {
        dict[@"language"] = language;
    }
    
    return dict;
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigMediaControlStruct &mediaControl) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSNumber *skipForwardInterval = [NSNumber numberWithInt:mediaControl.skipForwardInterval];
    if (skipForwardInterval.intValue >= 0) {
        dict[@"skipForwardInterval"] = skipForwardInterval;
    }
    NSNumber *skipBackwardInterval = [NSNumber numberWithInt:mediaControl.skipBackwardInterval];
    if (skipBackwardInterval.intValue >= 0) {
        dict[@"skipBackwardInterval"] = skipBackwardInterval;
    }
    
    dict[@"mediaSessionEnabled"] = @(mediaControl.mediaSessionEnabled);
    dict[@"convertSkipToSeek"] = @(mediaControl.convertSkipToSeek);
    
    return dict;
}

NSDictionary *convertToNSDictionary(const THEOplayerRCTViewConfigStruct &config) {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    NSString *libraryLocation = [NSString stringWithUTF8String:config.libraryLocation.c_str()];
    if (![libraryLocation isEqual: @""]) {
        dict[@"libraryLocation"] = libraryLocation;
    }
    NSString *mutedAutoplay = [NSString stringWithUTF8String:config.mutedAutoplay.c_str()];
    if (![mutedAutoplay isEqual: @""]) {
        dict[@"mutedAutoplay"] = mutedAutoplay;
    }
    NSString *license = [NSString stringWithUTF8String:config.license.c_str()];
    if (![license isEqual: @""]) {
        dict[@"license"] = license;
    }
    NSString *licenseUrl = [NSString stringWithUTF8String:config.licenseUrl.c_str()];
    if (![licenseUrl isEqual: @""]) {
        dict[@"licenseUrl"] = licenseUrl;
    }
    NSNumber *liveOffset = [NSNumber numberWithDouble:config.liveOffset];
    if (liveOffset.doubleValue >= 0.0) {
        dict[@"liveOffset"] = liveOffset;
    }
    
    dict[@"ads"] =  convertToNSDictionary(config.ads);
    dict[@"cast"] = convertToNSDictionary(config.cast);
    dict[@"ui"] = convertToNSDictionary(config.ui);
    dict[@"mediaControl"] = convertToNSDictionary(config.mediaControl);
    
    dict[@"chromeless"] = @(config.chromeless);
    dict[@"hlsDateRange"] = @(config.hlsDateRange);
    
    return dict;
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

+ (std::string)stringFrom:(NSDictionary *)dict at:(NSString *)key {
    NSString *value = dict[key];
    return value ? [value UTF8String] : "";
}

+ (double)doubleFrom:(NSDictionary *)dict at:(NSString *)key {
    NSNumber *value = dict[key];
    return value ? [value doubleValue] : 0.0;
}

+ (bool)boolFrom:(NSDictionary *)dict at:(NSString *)key {
    NSNumber *value = dict[key];
    return value ? [value boolValue] : false;
}

+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*)dict {
    THEOplayerRCTViewEventEmitter::OnNativePlayerReady playerReadyData;
    NSDictionary *versionData = dict[@"version"];
    THEOplayerRCTViewEventEmitter::OnNativePlayerReadyVersion version;
    version.version = [self stringFrom:versionData at:@"version"];
    version.playerSuiteVersion = [self stringFrom:versionData at:@"playerSuiteVersion"];
    playerReadyData.version = version;
    THEOplayerRCTViewEventEmitter::OnNativePlayerReadyState state;
    playerReadyData.state = state;
    return playerReadyData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange) nativeReadyStateChangeDataFrom:(NSDictionary*)dict {
    THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange readyStateChangeData;
    readyStateChangeData.readyState = [self doubleFrom:dict at:@"readyState"];
    return readyStateChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeDurationChange)nativeDurationChangeDataFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeDurationChange durationChangeData;
    durationChangeData.duration = [self doubleFrom:dict at:@"duration"];
    return durationChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeVolumeChange)nativeVolumeChangeDataFrom:(NSDictionary*)dict {
    THEOplayerRCTViewEventEmitter::OnNativeVolumeChange volumeChangeData;
    volumeChangeData.volume = [self doubleFrom:dict at:@"volume"];
    volumeChangeData.muted = [self boolFrom:dict at:@"muted"];
    return volumeChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeProgress) nativeProgressDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeProgress progressData;
    NSArray *seekableArray = dict[@"seekable"];
    for (NSDictionary *seekableDict in seekableArray) {
        THEOplayerRCTViewEventEmitter::OnNativeProgressSeekable seekableItem;
        seekableItem.start = [self doubleFrom:seekableDict at:@"start"];
        seekableItem.end = [self doubleFrom:seekableDict at:@"end"];
        progressData.seekable.push_back(seekableItem);
    }
    NSArray *bufferedArray = dict[@"buffered"];
    for (NSDictionary *bufferedDict in bufferedArray) {
        THEOplayerRCTViewEventEmitter::OnNativeProgressBuffered bufferedItem;
        bufferedItem.start = [self doubleFrom:bufferedDict at:@"start"];
        bufferedItem.end = [self doubleFrom:bufferedDict at:@"end"];
        progressData.buffered.push_back(bufferedItem);
    }
    return progressData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate) nativeTimeUpdateDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate timeUpdateData;
    timeUpdateData.currentTime = [self doubleFrom:dict at:@"currentTime"];
    timeUpdateData.currentProgramDateTime = [self doubleFrom:dict at:@"currentProgramDateTime"];
    return timeUpdateData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeError)nativeErrorDataFrom:(NSDictionary*)dict {
    THEOplayerRCTViewEventEmitter::OnNativeError errorData;
    NSDictionary *errorErrorData = dict[@"error"];
    THEOplayerRCTViewEventEmitter::OnNativeErrorError error;
    error.errorCode = [self stringFrom:errorErrorData at:@"errorCode"];
    error.errorMessage = [self stringFrom:errorErrorData at:@"errorMessage"];
    errorData.error = error;
    return errorData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeRateChange) nativeRateChangeDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeRateChange rateChangeData;
    rateChangeData.playbackRate = [self doubleFrom:dict at:@"playbackRate"];
    return rateChangeData;
}

+ (THEORCTBridgingTypeUtils::BridgedCue)BridgedCueFrom:(NSDictionary *)dict {
    THEORCTBridgingTypeUtils::BridgedCue cue;
    cue.id = [self stringFrom:dict at:@"id"];
    cue.uid = [self doubleFrom:dict at:@"uid"];
    cue.startTime = [self doubleFrom:dict at:@"startTime"];
    cue.endTime = [self doubleFrom:dict at:@"endTime"];
    cue.startDate = [self doubleFrom:dict at:@"startDate"];
    cue.endDate = [self doubleFrom:dict at:@"endDate"];
    cue.classString = [self stringFrom:dict at:@"classString"];
    cue.duration = [self doubleFrom:dict at:@"duration"];
    cue.plannedDuration = [self doubleFrom:dict at:@"plannedDuration"];
    cue.endOnNext = [self boolFrom:dict at:@"endOnNext"];
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
    quality.averageBandwidth = [self doubleFrom:dict at:@"averageBandwidth"];
    quality.bandwidth = [self doubleFrom:dict at:@"bandwidth"];
    quality.codecs = [self stringFrom:dict at:@"codecs"];
    quality.id = [self stringFrom:dict at:@"id"];
    quality.uid = [self doubleFrom:dict at:@"uid"];
    quality.name = [self stringFrom:dict at:@"name"];
    quality.label = [self stringFrom:dict at:@"label"];
    quality.available = [self boolFrom:dict at:@"available"];
    quality.width = [self doubleFrom:dict at:@"width"];
    quality.height = [self doubleFrom:dict at:@"height"];
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
    textTrack.kind = [self stringFrom:dict at:@"kind"];
    textTrack.label = [self stringFrom:dict at:@"label"];
    textTrack.language = [self stringFrom:dict at:@"language"];
    textTrack.id = [self stringFrom:dict at:@"id"];
    textTrack.uid = [self doubleFrom:dict at:@"uid"];
    textTrack.mode = [self stringFrom:dict at:@"mode"];
    textTrack.type = [self stringFrom:dict at:@"type"];
    textTrack.cues = [self nativeLoadedMetadataTextTracksCuesArrayFrom:dict[@"cues"]];
    textTrack.src = [self stringFrom:dict at:@"src"];
    textTrack.forced = [self boolFrom:dict at:@"forced"];
    return textTrack;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks)nativeLoadedMetadataAudioTracksFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracks audioTrack;
    audioTrack.id = [self stringFrom:dict at:@"id"];
    audioTrack.uid = [self doubleFrom:dict at:@"uid"];
    audioTrack.kind = [self stringFrom:dict at:@"kind"];
    audioTrack.label = [self stringFrom:dict at:@"label"];
    audioTrack.language = [self stringFrom:dict at:@"language"];
    audioTrack.activeQuality = [self nativeLoadedMetadataAudioTracksActiveQualityFrom:dict[@"activeQuality"]];
    audioTrack.qualities = [self nativeLoadedMetadataAudioTracksQualitiesArrayFrom:dict[@"qualities"]];
    audioTrack.enabled = [self boolFrom:dict at:@"enabled"];
    return audioTrack;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks)nativeLoadedMetadataVideoTracksFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracks videoTrack;
    videoTrack.id = [self stringFrom:dict at:@"id"];
    videoTrack.uid = [self doubleFrom:dict at:@"uid"];
    videoTrack.kind = [self stringFrom:dict at:@"kind"];
    videoTrack.label = [self stringFrom:dict at:@"label"];
    videoTrack.language = [self stringFrom:dict at:@"language"];
    videoTrack.activeQuality = [self nativeLoadedMetadataVideoTracksActiveQualityFrom:dict[@"activeQuality"]];
    videoTrack.qualities = [self nativeLoadedMetadataVideoTracksQualitiesArrayFrom:dict[@"qualities"]];
    videoTrack.enabled = [self boolFrom:dict at:@"enabled"];
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

+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata)nativeLoadedMetadataDataFrom:(NSDictionary *)dict {
    THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata metadata;
    metadata.textTracks = [self nativeLoadedMetadataTextTracksArrayFrom:dict[@"textTracks"]];
    metadata.audioTracks = [self nativeLoadedMetadataAudioTracksArrayFrom:dict[@"audioTracks"]];
    metadata.videoTracks = [self nativeLoadedMetadataVideoTracksArrayFrom:dict[@"videoTracks"]];
    metadata.duration = [self doubleFrom:dict at:@"duration"];
    metadata.selectedTextTrack = [self doubleFrom:dict at:@"selectedTextTrack"];
    metadata.selectedVideoTrack = [self doubleFrom:dict at:@"selectedVideoTrack"];
    metadata.selectedAudioTrack = [self doubleFrom:dict at:@"selectedAudioTrack"];
    return metadata;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeResize) nativeResizeDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeResize resizeData;
    resizeData.width = [self doubleFrom:dict at:@"width"];
    resizeData.height = [self doubleFrom:dict at:@"height"];
    return resizeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange) nativePresentationModeChangeDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange presentationModeChangeData;
    presentationModeChangeData.presentationMode = [self stringFrom:dict at:@"presentationMode"];
    presentationModeChangeData.previousPresentationMode = [self stringFrom:dict at:@"previousPresentationMode"];
    if ([dict objectForKey:@"context"]) {
        NSDictionary *contextData = dict[@"context"];
        if ([contextData objectForKey:@"pip"]) {
            presentationModeChangeData.context.pip = [self stringFrom:contextData at:@"pip"];
        }
    }
    return presentationModeChangeData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent)nativeTextTrackListEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent textTrackListEventData;
    textTrackListEventData.type = [self doubleFrom:dict at:@"type"];
    NSDictionary *trackData = dict[@"track"];
    if (trackData) {
        THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrack track;
        track.kind = [self stringFrom:trackData at:@"kind"];
        track.label = [self stringFrom:trackData at:@"label"];
        track.language = [self stringFrom:trackData at:@"language"];
        track.id = [self stringFrom:trackData at:@"id"];
        track.uid = [self doubleFrom:trackData at:@"uid"];
        track.mode = [self stringFrom:trackData at:@"mode"];
        track.type = [self stringFrom:trackData at:@"type"];
        track.src = [self stringFrom:trackData at:@"src"];
        track.forced = [self boolFrom:trackData at:@"forced"];
        NSArray *cuesData = trackData[@"cues"];
        if (cuesData) {
            for (NSDictionary *cueData in cuesData) {
                THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [self BridgedCueFrom:cueData];
                THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues cue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackListEventTrackCues(bridgedCue);
                track.cues.push_back(cue);
            }
        }
        textTrackListEventData.track = track;
    }
    return textTrackListEventData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent)nativeTextTrackEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent textTrackEventData;
    textTrackEventData.type = [self doubleFrom:dict at:@"type"];
    textTrackEventData.trackUid = [self doubleFrom:dict at:@"trackUid"];
    NSDictionary *cueData = dict[@"cue"];
    if (cueData) {
        THEORCTBridgingTypeUtils::BridgedCue bridgedCue = [self BridgedCueFrom:cueData];
        THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCue cue = THEORCTBridgingTypeUtils::BridgedCue_2_OnNativeTextTrackEventCue(bridgedCue);
        textTrackEventData.cue = cue;
    }
    return textTrackEventData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent)nativeMediaTrackListEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent mediaTrackListEventData;
    mediaTrackListEventData.type = [self doubleFrom:dict at:@"type"];
    mediaTrackListEventData.trackType = [self doubleFrom:dict at:@"trackType"];
    NSDictionary *trackData = dict[@"track"];
    if (trackData) {
        THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrack track;
        track.id = [self stringFrom:trackData at:@"id"];
        track.uid = [self doubleFrom:trackData at:@"uid"];
        track.kind = [self stringFrom:trackData at:@"kind"];
        track.label = [self stringFrom:trackData at:@"label"];
        track.language = [self stringFrom:trackData at:@"language"];
        track.enabled = [self boolFrom:trackData at:@"enabled"];
        NSDictionary *activeQualityData = trackData[@"activeQuality"];
        if (activeQualityData) {
            THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:activeQualityData];
            THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeMediaTrackListEventTrackActiveQuality(bridgedQuality);
            track.activeQuality = quality;
        }
        NSArray *qualitiesData = trackData[@"qualities"];
        if (qualitiesData) {
            for (NSDictionary *qualityData in qualitiesData) {
                THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:qualityData];
                THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackQualities quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeMediaTrackListEventTrackQualities(bridgedQuality);
                track.qualities.push_back(quality);
            }
        }
        mediaTrackListEventData.track = track;
    }
    return mediaTrackListEventData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent)nativeMediaTrackEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent mediaTrackEventData;
    mediaTrackEventData.type = [self doubleFrom:dict at:@"type"];
    mediaTrackEventData.trackType = [self doubleFrom:dict at:@"trackType"];
    mediaTrackEventData.trackUid = [self doubleFrom:dict at:@"trackUid"];
    NSArray *qualitiesData = dict[@"qualities"];
    if (qualitiesData) {
        for (NSDictionary *qualityData in qualitiesData) {
            THEORCTBridgingTypeUtils::BridgedQuality bridgedQuality = [self BridgedQualityFrom:qualityData];
            THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities quality = THEORCTBridgingTypeUtils::BridgedQuality_2_OnNativeMediaTrackEventQualities(bridgedQuality);
            mediaTrackEventData.qualities.push_back(quality);
        }
    }
    return mediaTrackEventData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeCastEvent)nativeCastEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeCastEvent castEventData;
    castEventData.type = [self stringFrom:dict at:@"type"];
    castEventData.state = [self stringFrom:dict at:@"state"];
    NSDictionary *errorData = dict[@"error"];
    if (errorData) {
        THEOplayerRCTViewEventEmitter::OnNativeCastEventError error;
        error.errorCode = [self stringFrom:errorData at:@"errorCode"];
        error.description = [self stringFrom:errorData at:@"description"];
        castEventData.error = error;
    }
    return castEventData;
}

+ (THEOplayerRCTViewEventEmitter::OnNativeAdEvent)nativeAdEventDataFrom:(NSDictionary*) dict {
    THEOplayerRCTViewEventEmitter::OnNativeAdEvent adEventData;
    adEventData.type = [self stringFrom:dict at:@"type"];
    NSDictionary *adData = dict[@"ad"];
    if (adData) {
        THEOplayerRCTViewEventEmitter::OnNativeAdEventAd ad;
        ad.adSystem = [self stringFrom:adData at:@"adSystem"];
        ad.integration = [self stringFrom:adData at:@"integration"];
        ad.type = [self stringFrom:adData at:@"type"];
        ad.id = [self stringFrom:adData at:@"id"];
        ad.readyState = [self stringFrom:adData at:@"readyState"];
        ad.duration = [self doubleFrom:adData at:@"duration"];
        ad.width = [self doubleFrom:adData at:@"width"];
        ad.height = [self doubleFrom:adData at:@"height"];
        ad.resourceURI = [self stringFrom:adData at:@"resourceURI"];
        ad.clickThrough = [self stringFrom:adData at:@"clickThrough"];
        ad.skipOffset = [self doubleFrom:adData at:@"skipOffset"];
        ad.creativeId = [self stringFrom:adData at:@"creativeId"];
        ad.timeOffset = [self doubleFrom:adData at:@"timeOffset"];
        ad.maxDuration = [self doubleFrom:adData at:@"maxDuration"];
        ad.maxRemainingDuration = [self doubleFrom:adData at:@"maxRemainingDuration"];
        NSDictionary *adBreakData = adData[@"adBreak"];
        if (adBreakData) {
            THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdBreak adBreak;
            adBreak.integration = [self stringFrom:adBreakData at:@"integration"];
            adBreak.timeOffset = [self doubleFrom:adBreakData at:@"timeOffset"];
            adBreak.maxDuration = [self doubleFrom:adBreakData at:@"maxDuration"];
            adBreak.maxRemainingDuration = [self doubleFrom:adBreakData at:@"maxRemainingDuration"];
            ad.adBreak = adBreak;
        }
        NSDictionary *companionsData = adData[@"companions"];
        if (companionsData) {
            THEOplayerRCTViewEventEmitter::OnNativeAdEventAdCompanions companions;
            companions.adSlotId = [self stringFrom:companionsData at:@"adSlotId"];
            companions.altText = [self stringFrom:companionsData at:@"altText"];
            companions.contentHTML =[self stringFrom:companionsData at:@"contentHTML"];
            companions.clickThrough = [self stringFrom:companionsData at:@"clickThrough"];
            companions.width = [self doubleFrom:companionsData at:@"width"];
            companions.height = [self doubleFrom:companionsData at:@"height"];
            companions.resourceURI = [self stringFrom:companionsData at:@"resourceURI"];
            ad.companions = companions;
        }
        NSArray *universalAdIdsData = adData[@"universalAdIds"];
        if (universalAdIdsData) {
            for (NSDictionary *universalAdIdData in universalAdIdsData) {
                THEOplayerRCTViewEventEmitter::OnNativeAdEventAdUniversalAdIds universalAdId;
                universalAdId.adIdRegistry = [self stringFrom:universalAdIdData at:@"adIdRegistry"];
                universalAdId.adIdValue = [self stringFrom:universalAdIdData at:@"adIdValue"];
                ad.universalAdIds.push_back(universalAdId);
            }
        }
        NSArray *adsData = adData[@"ads"];
        if (adsData) {
            for (NSDictionary *adItemData in adsData) {
                THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAds adItem;
                adItem.adSystem = [self stringFrom:adItemData at:@"adSystem"];
                adItem.integration = [self stringFrom:adItemData at:@"integration"];
                adItem.type = [self stringFrom:adItemData at:@"type"];
                adItem.id = [self stringFrom:adItemData at:@"id"];
                adItem.readyState = [self stringFrom:adItemData at:@"readyState"];
                adItem.duration = [self doubleFrom:adItemData at:@"duration"];
                adItem.width = [self doubleFrom:adItemData at:@"width"];
                adItem.height = [self doubleFrom:adItemData at:@"height"];
                adItem.resourceURI = [self stringFrom:adItemData at:@"resourceURI"];
                adItem.clickThrough = [self stringFrom:adItemData at:@"clickThrough"];
                adItem.skipOffset = [self doubleFrom:adItemData at:@"skipOffset"];
                adItem.creativeId = [self stringFrom:adItemData at:@"creativeId"];
                NSDictionary *adsCompanionsData = adItemData[@"companions"];
                if (adsCompanionsData) {
                    THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdsCompanions adsCompanions;
                    adsCompanions.adSlotId = [self stringFrom:adsCompanionsData at:@"adSlotId"];
                    adsCompanions.altText = [self stringFrom:adsCompanionsData at:@"altText"];
                    adsCompanions.contentHTML =[self stringFrom:adsCompanionsData at:@"contentHTML"];
                    adsCompanions.clickThrough = [self stringFrom:adsCompanionsData at:@"clickThrough"];
                    adsCompanions.width = [self doubleFrom:adsCompanionsData at:@"width"];
                    adsCompanions.height = [self doubleFrom:adsCompanionsData at:@"height"];
                    adsCompanions.resourceURI = [self stringFrom:adsCompanionsData at:@"resourceURI"];
                    adItem.companions = adsCompanions;
                }
                NSArray *adsUniversalAdIdsData = adItemData[@"universalAdIds"];
                if (adsUniversalAdIdsData) {
                    for (NSDictionary *adsUniversalAdIdData in universalAdIdsData) {
                        THEOplayerRCTViewEventEmitter::OnNativeAdEventAdAdsUniversalAdIds adsUniversalAdId;
                        adsUniversalAdId.adIdRegistry = [self stringFrom:adsUniversalAdIdData at:@"adIdRegistry"];
                        adsUniversalAdId.adIdValue = [self stringFrom:adsUniversalAdIdData at:@"adIdValue"];
                        adItem.universalAdIds.push_back(adsUniversalAdId);
                    }
                }
                ad.ads.push_back(adItem);
            }
        }
        adEventData.ad = ad;
    }
    return adEventData;
}

@end
