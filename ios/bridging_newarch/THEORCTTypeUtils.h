#ifndef THEORCTTypeUtils_h
#define THEORCTTypeUtils_h

#import "THEORCTBridgingTypeUtils.h"
#import "../newarch/rntheo/EventEmitters.h"
#import "../newarch/rntheo/Props.h"
#import "../newarch/rntheo/rntheo.h"

NS_ASSUME_NONNULL_BEGIN

using namespace facebook::react;
using namespace JS::NativeAdsModule;

@interface THEORCTTypeUtils: NSObject

// C++ struct => NSDictionary
+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData;
+ (NSDictionary *) scheduledAd:(ScheduledAd) scheduledAdData;
+ (NSDictionary *) obstruction:(FriendlyObstruction) obstructionData;

// NSDictionary => C++ struct
+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeReadyStateChange) nativeReadyStateChangeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeDurationChange) nativeDurationChangeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeVolumeChange) nativeVolumeChangeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeProgress) nativeProgressDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeTimeUpdate) nativeTimeUpdateDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeError) nativeErrorDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeRateChange) nativeRateChangeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeLoadedMetadata) nativeLoadedMetadataDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeResize) nativeResizeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativePresentationModeChange) nativePresentationModeChangeDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackListEvent) nativeTextTrackListEventDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeTextTrackEvent) nativeTextTrackEventDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackListEvent) nativeMediaTrackListEventDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeMediaTrackEvent) nativeMediaTrackEventDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeCastEvent) nativeCastEventDataFrom:(NSDictionary*) eventData;
+ (THEOplayerRCTViewEventEmitter::OnNativeAdEvent) nativeAdEventDataFrom:(NSDictionary*) eventData;

// INTERMEDIATE BRIDGING TYPES
//+ (THEORCTBridgingTypeUtils::BridgedCue) bridgedCueFrom:(NSDictionary*) eventData;

@end

NS_ASSUME_NONNULL_END

#endif /* THEORCTTypeUtils_h */
