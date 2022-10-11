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

RCT_EXPORT_VIEW_PROPERTY(src, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL);
RCT_EXPORT_VIEW_PROPERTY(volume, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(muted, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playbackRate, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(selectedTextTrack, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(selectedAudioTrack, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(selectedVideoTrack, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(seek, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(fullscreen, BOOL);
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
RCT_EXPORT_VIEW_PROPERTY(onNativeLoadedMetadata, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerWillPresent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerDidPresent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerWillDismiss, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeFullscreenPlayerDidDismiss, RCTDirectEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNativeTextTrackListEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeTextTrackEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeMediaTrackListEvent, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeMediaTrackEvent, RCTDirectEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNativeAdEvent, RCTDirectEventBlock);

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node);

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
                  ad: NSDictionary)

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
