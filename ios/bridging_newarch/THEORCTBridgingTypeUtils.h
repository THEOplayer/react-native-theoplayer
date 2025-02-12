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
};
