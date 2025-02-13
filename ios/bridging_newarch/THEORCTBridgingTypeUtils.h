#pragma once

#import "../newarch/rntheo/EventEmitters.h"

using namespace facebook::react;

class THEORCTBridgingTypeUtils {
 public:
    
    // BRIDGED_CUE_CONTENT
    struct BridgedCueContent {
        // TODO: IN PROGRESS
    };
    
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCueContent BridgedCueContent_2_OnNativeTextTrackEventCueContent(const BridgedCueContent& bridged) {
        return {};
    }
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCuesContent BridgedCueContent_2_OnNativeTextTrackListEventTrackCuesContent(const BridgedCueContent& bridged) {
        return {};
    }
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCuesContent BridgedCueContent_2_OnNativeLoadedMetadataTextTracksCuesContent(const BridgedCueContent& bridged) {
        return {};
    }
    
    // BRIDGED_CUE_CUSTOM_ATTRIBUTES
    struct BridgedCueCustomAttributes {
        // TODO: IN PROGRESS
    };
    
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCueCustomAttributes BridgedCueCustomAttributes_2_OnNativeTextTrackEventCueCustomAttributes(const BridgedCueCustomAttributes& bridged) {
        return {};
    }
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCuesCustomAttributes BridgedCueCustomAttributes_2_OnNativeTextTrackListEventTrackCuesCustomAttributes(const BridgedCueCustomAttributes& bridged) {
        return {};
    }
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCuesCustomAttributes BridgedCueCustomAttributes_2_OnNativeLoadedMetadataTextTracksCuesCustomAttributes(const BridgedCueCustomAttributes& bridged) {
        return {};
    }
    
    // BRIDGED_CUE
    struct BridgedCue {
        std::string id;
        double uid;
        double startTime;
        double endTime;
        BridgedCueContent content;
        double startDate;
        double endDate;
        std::string classString;
        double duration;
        double plannedDuration;
        bool endOnNext;
        BridgedCueCustomAttributes customAttributes;
    };
    
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCue BridgedCue_2_OnNativeTextTrackEventCue(const BridgedCue& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeTextTrackEventCue (
                                                                         bridged.id,
                                                                         bridged.uid,
                                                                         bridged.startTime,
                                                                         bridged.endTime,
                                                                         BridgedCueContent_2_OnNativeTextTrackEventCueContent(bridged.content),
                                                                         bridged.startDate,
                                                                         bridged.endDate,
                                                                         bridged.classString,
                                                                         bridged.duration,
                                                                         bridged.plannedDuration,
                                                                         bridged.endOnNext,
                                                                         BridgedCueCustomAttributes_2_OnNativeTextTrackEventCueCustomAttributes(bridged.customAttributes));
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues BridgedCue_2_OnNativeTextTrackListEventTrackCues(const BridgedCue& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEventTrackCues(
                                                                                  bridged.id,
                                                                                  bridged.uid,
                                                                                  bridged.startTime,
                                                                                  bridged.endTime,
                                                                                  BridgedCueContent_2_OnNativeTextTrackListEventTrackCuesContent(bridged.content),
                                                                                  bridged.startDate,
                                                                                  bridged.endDate,
                                                                                  bridged.classString,
                                                                                  bridged.duration,
                                                                                  bridged.plannedDuration,
                                                                                  bridged.endOnNext,
                                                                                  BridgedCueCustomAttributes_2_OnNativeTextTrackListEventTrackCuesCustomAttributes(bridged.customAttributes));
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues BridgedCue_2_OnNativeLoadedMetadataTextTracksCues(const BridgedCue& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataTextTracksCues(
                                                                                   bridged.id,
                                                                                   bridged.uid,
                                                                                   bridged.startTime,
                                                                                   bridged.endTime,
                                                                                   BridgedCueContent_2_OnNativeLoadedMetadataTextTracksCuesContent(bridged.content),
                                                                                   bridged.startDate,
                                                                                   bridged.endDate,
                                                                                   bridged.classString,
                                                                                   bridged.duration,
                                                                                   bridged.plannedDuration,
                                                                                   bridged.endOnNext,
                                                                                   BridgedCueCustomAttributes_2_OnNativeLoadedMetadataTextTracksCuesCustomAttributes(bridged.customAttributes));
    }
    
    // BRIDGED_QUALITY
    struct BridgedQuality {
        double averageBandwidth;
        double bandwidth;
        std::string codecs;
        std::string id;
        double uid;
        std::string name;
        std::string label;
        bool available;
        double width;
        double height;
    };
    
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksActiveQuality BridgedQuality_2_OnNativeLoadedMetadataAudioTracksActiveQuality(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksActiveQuality (
                                                                                              bridged.averageBandwidth,
                                                                                              bridged.bandwidth,
                                                                                              bridged.codecs,
                                                                                              bridged.id,
                                                                                              bridged.uid,
                                                                                              bridged.name,
                                                                                              bridged.label,
                                                                                              bridged.available,
                                                                                              bridged.width,
                                                                                              bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities BridgedQuality_2_OnNativeLoadedMetadataAudioTracksQualities(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataAudioTracksQualities (
                                                                                          bridged.averageBandwidth,
                                                                                          bridged.bandwidth,
                                                                                          bridged.codecs,
                                                                                          bridged.id,
                                                                                          bridged.uid,
                                                                                          bridged.name,
                                                                                          bridged.label,
                                                                                          bridged.available,
                                                                                          bridged.width,
                                                                                          bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksActiveQuality BridgedQuality_2_OnNativeLoadedMetadataVideoTracksActiveQuality(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksActiveQuality (
                                                                                              bridged.averageBandwidth,
                                                                                              bridged.bandwidth,
                                                                                              bridged.codecs,
                                                                                              bridged.id,
                                                                                              bridged.uid,
                                                                                              bridged.name,
                                                                                              bridged.label,
                                                                                              bridged.available,
                                                                                              bridged.width,
                                                                                              bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities BridgedQuality_2_OnNativeLoadedMetadataVideoTracksQualities(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadataVideoTracksQualities (
                                                                                          bridged.averageBandwidth,
                                                                                          bridged.bandwidth,
                                                                                          bridged.codecs,
                                                                                          bridged.id,
                                                                                          bridged.uid,
                                                                                          bridged.name,
                                                                                          bridged.label,
                                                                                          bridged.available,
                                                                                          bridged.width,
                                                                                          bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality BridgedQuality_2_OnNativeMediaTrackListEventTrackActiveQuality(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackActiveQuality (
                                                                                          bridged.averageBandwidth,
                                                                                          bridged.bandwidth,
                                                                                          bridged.codecs,
                                                                                          bridged.id,
                                                                                          bridged.uid,
                                                                                          bridged.name,
                                                                                          bridged.label,
                                                                                          bridged.available,
                                                                                          bridged.width,
                                                                                          bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackQualities BridgedQuality_2_OnNativeMediaTrackListEventTrackQualities(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEventTrackQualities (
                                                                                          bridged.averageBandwidth,
                                                                                          bridged.bandwidth,
                                                                                          bridged.codecs,
                                                                                          bridged.id,
                                                                                          bridged.uid,
                                                                                          bridged.name,
                                                                                          bridged.label,
                                                                                          bridged.available,
                                                                                          bridged.width,
                                                                                          bridged.height);
    }
    
    static THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities BridgedQuality_2_OnNativeMediaTrackEventQualities(const BridgedQuality& bridged) {
        return THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEventQualities (
                                                                                          bridged.averageBandwidth,
                                                                                          bridged.bandwidth,
                                                                                          bridged.codecs,
                                                                                          bridged.id,
                                                                                          bridged.uid,
                                                                                          bridged.name,
                                                                                          bridged.label,
                                                                                          bridged.available,
                                                                                          bridged.width,
                                                                                          bridged.height);
    }
};
