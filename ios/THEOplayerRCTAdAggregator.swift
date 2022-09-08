// THEOplayerRCTAdAggregator.swift

import Foundation
import THEOplayerSDK

let PROP_AD_INTEGRATION: String = "integration"
let PROP_AD_TYPE: String = "type"
let PROP_AD_ID: String = "id"
let PROP_AD_BREAK: String = "adBreak"
let PROP_AD_SKIP_OFFSET: String = "skipOffset"
let PROP_AD_COMPANIONS: String = "companions"
let PROP_GOOGLE_AD_AD_SYSTEM: String = "adSystem"
let PROP_GOOGLE_AD_CREATIVE_ID: String = "creativeId"
let PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING: String = "traffickingParametersString"
let PROP_GOOGLE_AD_BITRATE: String = "bitrate"
let PROP_GOOGLE_AD_TITLE: String = "title"
let PROP_GOOGLE_AD_DURATION: String = "duration"
let PROP_GOOGLE_AD_WIDTH: String = "width"
let PROP_GOOGLE_AD_HEIGHT: String = "height"
let PROP_GOOGLE_AD_CONTENT_TYPE: String = "contentType"
let PROP_GOOGLE_AD_ID_REGISTRY: String = "adIdRegistry";
let PROP_GOOGLE_AD_ID_VALUE: String = "adIdValue"
let PROP_GOOLGE_AD_UNIVERSAL_AD_IDS: String = "universalAdIds"
let PROP_GOOLGE_AD_WRAPPER_AD_IDS: String = "wrapperAdIds"
let PROP_GOOLGE_AD_WRAPPER_AD_SYSTEMS: String = "wrapperAdSystems"
let PROP_GOOLGE_AD_WRAPPER_CREATIVE_IDS: String = "wrapperCreativeIds"
let PROP_ADBREAK_MAX_DURATION: String = "maxDuration"
let PROP_ADBREAK_TIME_OFFSET: String = "timeOffset"
let PROP_ADBREAK_MAX_REMAINING_DURATION: String = "maxRemainingDuration"
let PROP_ADBREAK_ADS: String = "ads"
let PROP_COMPANION_AD_SLOT_ID: String = "adSlotId";
let PROP_COMPANION_ALT_TEXT: String = "altText";
let PROP_COMPANION_CLICK_THROUGH: String = "clickThrough";
let PROP_COMPANION_WIDTH: String = "width";
let PROP_COMPANION_HEIGHT: String = "height";
let PROP_COMPANION_RESOURCE_URI: String = "resourceURI";

class THEOplayerRCTAdAggregator {

    class func aggregateAd(ad: Ad, processAdBreak: Bool = true) -> [String:Any] {
        var adData: [String:Any] = [:]
        adData[PROP_AD_INTEGRATION] = ad.integration._rawValue
        adData[PROP_AD_TYPE] = ad.type
        adData[PROP_AD_ID] = ad.id ?? ""
        if processAdBreak,
           let adBreak = ad.adBreak {
            adData[PROP_AD_BREAK] = THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adBreak)
        }
        adData[PROP_AD_COMPANIONS] = THEOplayerRCTAdAggregator.aggregateCompanionAds(companionAds: ad.companions)
        adData[PROP_AD_SKIP_OFFSET] = ad.skipOffset ?? 0
        
        // Add additional properties for GoogleIma Ads
        if let googleImaAd = ad as? GoogleImaAd {
            adData[PROP_GOOGLE_AD_AD_SYSTEM] = googleImaAd.adSystem ?? ""
            adData[PROP_GOOGLE_AD_CREATIVE_ID] = googleImaAd.creativeId ?? ""
            adData[PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING] = googleImaAd.traffickingParameters
            adData[PROP_GOOGLE_AD_BITRATE] = googleImaAd.vastMediaBitrate
            adData[PROP_GOOGLE_AD_TITLE] = ""                               // not available on iOS SDK
            adData[PROP_GOOGLE_AD_DURATION] = 0.0                           // not available on iOS SDK
            adData[PROP_GOOGLE_AD_WIDTH] = googleImaAd.width ?? 0
            adData[PROP_GOOGLE_AD_HEIGHT] = googleImaAd.height ?? 0
            adData[PROP_GOOGLE_AD_CONTENT_TYPE] = ""                        // not available on iOS SDK
        
            if !googleImaAd.universalAdIds.isEmpty {
                var adIdList: [[String:Any]] = []
                for adId in googleImaAd.universalAdIds {
                    var adIdData: [String:Any] = [:]
                    adIdData[PROP_GOOGLE_AD_ID_REGISTRY] = adId.adIdRegistry
                    adIdData[PROP_GOOGLE_AD_ID_VALUE] = adId.adIdValue
                    adIdList.append(adIdData)
                }
                adData[PROP_GOOLGE_AD_UNIVERSAL_AD_IDS] = adIdList
            }
            if !googleImaAd.wrapperAdIds.isEmpty {
                adData[PROP_GOOLGE_AD_WRAPPER_AD_IDS] = googleImaAd.wrapperAdIds
            }
            if !googleImaAd.wrapperAdSystems.isEmpty {
                adData[PROP_GOOLGE_AD_WRAPPER_AD_SYSTEMS] = googleImaAd.wrapperAdSystems
            }
            if !googleImaAd.wrapperCreativeIds.isEmpty {
                adData[PROP_GOOLGE_AD_WRAPPER_CREATIVE_IDS] = googleImaAd.wrapperCreativeIds
            }
        }
        
        return adData
    }
    
    class func aggregateAdBreak(adBreak: AdBreak) -> [String:Any] {
        var adBreakData: [String:Any] = [:]
        adBreakData[PROP_ADBREAK_MAX_DURATION] = adBreak.maxDuration
        adBreakData[PROP_ADBREAK_TIME_OFFSET] = adBreak.timeOffset
        adBreakData[PROP_ADBREAK_MAX_REMAINING_DURATION] = adBreak.maxRemainingDuration
        // process adds when adbreak contains them
        if !adBreak.ads.isEmpty {
            var adList: [[String:Any]] = []
            for ad in adBreak.ads {
                adList.append(THEOplayerRCTAdAggregator.aggregateAd(ad: ad, processAdBreak: false))
            }
            adBreakData[PROP_ADBREAK_ADS] = adList
        }
        return adBreakData
    }
    
    class private func aggregateCompanionAds(companionAds: [CompanionAd?]) -> [[String:Any]] {
        var companionAdsData: [[String:Any]] = []
        for cAd in companionAds {
            if let companionAd = cAd {
                var companionAdData: [String:Any] = [:]
                companionAdData[PROP_COMPANION_AD_SLOT_ID] = companionAd.adSlotId ?? ""
                companionAdData[PROP_COMPANION_ALT_TEXT] = companionAd.altText ?? ""
                companionAdData[PROP_COMPANION_CLICK_THROUGH] = companionAd.clickThrough ?? ""
                companionAdData[PROP_COMPANION_WIDTH] = companionAd.width ?? 0
                companionAdData[PROP_COMPANION_HEIGHT] = companionAd.height ?? 0
                companionAdData[PROP_COMPANION_RESOURCE_URI] = companionAd.resourceURI ?? ""
                companionAdsData.append(companionAdData)
            }
        }
        return companionAdsData
    }
}
