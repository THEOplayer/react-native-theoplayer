//
//  THEOplayerRCTBridge.m
//  Theoplayer
//
//  Created by William van Haevre on 14/01/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// View Manager
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_MODULE(THEOplayerRCTViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(onNativePause, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativePlay, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeSourceChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeLoadStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeReadyStateChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeDurationChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeProgress, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeTimeUpdate, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativePlaying, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeSeeking, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeSeeked, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeEnded, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeLoadedData, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeRateChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeVolumeChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeLoadedMetadata, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerWillPresent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerDidPresent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerWillDismiss, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerDidDismiss, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeWaiting, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeCanPlay, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeTextTrackListEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeTextTrackEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeMediaTrackListEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeMediaTrackEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativePlayerReady, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativePresentationModeChange, RCTDirectEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNativeAdEvent, RCTDirectEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNativeCastEvent, RCTDirectEventBlock);

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node);

@end

// ----------------------------------------------------------------------------
// Player Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(PlayerModule, THEOplayerRCTPlayerAPI, NSObject)

RCT_EXTERN_METHOD(setPaused:(nonnull NSNumber *)node
                  paused:(BOOL)paused)

RCT_EXTERN_METHOD(setSource:(nonnull NSNumber *)node
                  src:(NSDictionary)src)

RCT_EXTERN_METHOD(setABRConfig:(nonnull NSNumber *)node
                  abrConfig:(NSDictionary)abrConfig)

RCT_EXTERN_METHOD(setCurrentTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)time)

RCT_EXTERN_METHOD(setMuted:(nonnull NSNumber *)node
                  muted:(BOOL)muted)

RCT_EXTERN_METHOD(setVolume:(nonnull NSNumber *)node
                  volume:(nonnull NSNumber *)volume)

RCT_EXTERN_METHOD(setPlaybackRate:(nonnull NSNumber *)node
                  playbackRate:(nonnull NSNumber *)playbackRate)

RCT_EXTERN_METHOD(setPresentationMode:(nonnull NSNumber *)node
                  presentationMode:(nonnull NSString *)presentationMode)

RCT_EXTERN_METHOD(setPipConfig:(nonnull NSNumber *)node
                  pipConfig:(NSDictionary)pipConfig)

RCT_EXTERN_METHOD(setBackgroundAudioConfig:(nonnull NSNumber *)node
                  backgroundAudioConfig:(NSDictionary)backgroundAudioConfig)

RCT_EXTERN_METHOD(setSelectedTextTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid)

RCT_EXTERN_METHOD(setSelectedAudioTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid)

RCT_EXTERN_METHOD(setSelectedVideoTrack:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid)

RCT_EXTERN_METHOD(setTargetVideoQuality:(nonnull NSNumber *)node
                  uid:(nonnull NSNumber *)uid)

RCT_EXTERN_METHOD(setPreload:(nonnull NSNumber *)node
                  type:(nonnull NSString *)type)

@end

// ----------------------------------------------------------------------------
// Ads Module
// ----------------------------------------------------------------------------

@interface RCT_EXTERN_REMAP_MODULE(AdsModule, THEOplayerRCTAdsAPI, NSObject)

RCT_EXTERN_METHOD(skip:(nonnull NSNumber *)node)

RCT_EXTERN_METHOD(playing:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(currentAdBreak:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(currentAds:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(scheduledAdBreaks:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(schedule:(nonnull NSNumber *)node
                  ad:(NSDictionary)ad)

RCT_EXTERN_METHOD(daiSnapback:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(daiSetSnapback:(nonnull NSNumber *)node
                  enabled:(BOOL)enabled)

RCT_EXTERN_METHOD(daiContentTimeForStreamTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)timeValue
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(daiStreamTimeForContentTime:(nonnull NSNumber *)node
                  time:(nonnull NSNumber *)timeValue
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

// ----------------------------------------------------------------------------
// ContentProtection Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ContentProtectionModule, THEOplayerRCTContentProtectionAPI, RCTEventEmitter)

RCT_EXTERN_METHOD(onBuildProcessed:(NSDictionary)result)
RCT_EXTERN_METHOD(onCertificateRequestProcessedAsRequest:(NSDictionary)result)
RCT_EXTERN_METHOD(onCertificateRequestProcessedAsCertificate:(NSDictionary)result)
RCT_EXTERN_METHOD(onCertificateResponseProcessed:(NSDictionary)result)
RCT_EXTERN_METHOD(onLicenseRequestProcessedAsRequest:(NSDictionary)result)
RCT_EXTERN_METHOD(onLicenseRequestProcessedAsLicense:(NSDictionary)result)
RCT_EXTERN_METHOD(onLicenseResponseProcessed:(NSDictionary)result)
RCT_EXTERN_METHOD(onExtractFairplayContentIdProcessed:(NSDictionary)result)
RCT_EXTERN_METHOD(registerContentProtectionIntegration:(nonnull NSString *)integrationId
                  keySystemId:(nonnull NSString *)keySystemId)

@end

// ----------------------------------------------------------------------------
// Cast Module
// ----------------------------------------------------------------------------

@interface RCT_EXTERN_REMAP_MODULE(CastModule, THEOplayerRCTCastAPI, NSObject)

RCT_EXTERN_METHOD(casting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// chromecast specific
RCT_EXTERN_METHOD(chromecastCasting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(chromecastState:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(chromecastStart:(nonnull NSNumber *)node)

RCT_EXTERN_METHOD(chromecastStop:(nonnull NSNumber *)node)

RCT_EXTERN_METHOD(chromecastJoin:(nonnull NSNumber *)node)

RCT_EXTERN_METHOD(chromecastLeave:(nonnull NSNumber *)node)

// airplay specific
RCT_EXTERN_METHOD(airplayCasting:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(airplayState:(nonnull NSNumber *)node
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(airplayStart:(nonnull NSNumber *)node)

RCT_EXTERN_METHOD(airplayStop:(nonnull NSNumber *)node)

@end
