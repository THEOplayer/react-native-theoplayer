//
//  THEOplayerRCTBridge.m
//  Theoplayer
//
//  Created by William van Haevre on 14/01/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

// View Manager
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

RCT_EXPORT_VIEW_PROPERTY(onNativeAdEvent, RCTDirectEventBlock);

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node);

@end

// Ads Module
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

@end
