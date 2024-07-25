// THEOplayerRCTAdAdapter.swift

import Foundation
import THEOplayerSDK

let PROP_AD_INTEGRATION: String = "integration"
let PROP_AD_CUSTOM_INTEGRATION: String = "customIntegration"
let PROP_AD_TYPE: String = "type"
let PROP_AD_ID: String = "id"
let PROP_AD_BREAK: String = "adBreak"
let PROP_AD_DURATION: String = "duration"
let PROP_AD_SKIP_OFFSET: String = "skipOffset"
let PROP_AD_COMPANIONS: String = "companions"
let PROP_AD_CLICK_THROUGH: String = "clickThrough"
let PROP_AD_RESOURCE_URI: String = "resourceURI"
let PROP_AD_UNIVERSAL_AD_IDS: String = "universalAdIds"
let PROP_GOOGLE_AD_AD_SYSTEM: String = "adSystem"
let PROP_GOOGLE_AD_CREATIVE_ID: String = "creativeId"
let PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING: String = "traffickingParametersString"
let PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS: String = "traffickingParameters"
let PROP_GOOGLE_AD_BITRATE: String = "bitrate"
let PROP_GOOGLE_AD_WIDTH: String = "width"
let PROP_GOOGLE_AD_HEIGHT: String = "height"
let PROP_GOOGLE_AD_CONTENT_TYPE: String = "contentType"
let PROP_GOOGLE_AD_ID_REGISTRY: String = "adIdRegistry"
let PROP_GOOGLE_AD_ID_VALUE: String = "adIdValue"
let PROP_GOOGLE_AD_WRAPPER_AD_IDS: String = "wrapperAdIds"
let PROP_GOOGLE_AD_WRAPPER_AD_SYSTEMS: String = "wrapperAdSystems"
let PROP_GOOGLE_AD_WRAPPER_CREATIVE_IDS: String = "wrapperCreativeIds"
let PROP_ADBREAK_MAX_DURATION: String = "maxDuration"
let PROP_ADBREAK_TIME_OFFSET: String = "timeOffset"
let PROP_ADBREAK_MAX_REMAINING_DURATION: String = "maxRemainingDuration"
let PROP_ADBREAK_ADS: String = "ads"
let PROP_ADBREAK_INTEGRATION: String = "integration"
let PROP_ADBREAK_CUSTOM_INTEGRATION: String = "customIntegration"
let PROP_COMPANION_AD_SLOT_ID: String = "adSlotId"
let PROP_COMPANION_ALT_TEXT: String = "altText"
let PROP_COMPANION_CLICK_THROUGH: String = "clickThrough"
let PROP_COMPANION_WIDTH: String = "width"
let PROP_COMPANION_HEIGHT: String = "height"
let PROP_COMPANION_RESOURCE_URI: String = "resourceURI"

class THEOplayerRCTAdAdapter {

    class func fromAd(ad: Ad, processAdBreak: Bool = true) -> [String:Any] {
        var adData: [String:Any] = [:]
        adData[PROP_AD_INTEGRATION] = ad.integration._rawValue
        if let customIntegration = ad.customIntegration {
            adData[PROP_AD_CUSTOM_INTEGRATION] = customIntegration
        }
        adData[PROP_AD_TYPE] = ad.type
        if let adId = ad.id {
            adData[PROP_AD_ID] = adId
        }
        if let resourceURI = ad.resourceURI {
            adData[PROP_AD_RESOURCE_URI] = resourceURI
        }
        if let clickThrough = ad.clickThrough {
            adData[PROP_AD_CLICK_THROUGH] = clickThrough
        }
        if let skipOffset = ad.skipOffset {
            adData[PROP_AD_SKIP_OFFSET] = (skipOffset == -1) ? skipOffset : skipOffset
        }
        if processAdBreak,
           let adBreak = ad.adBreak {
            adData[PROP_AD_BREAK] = THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adBreak)
        }
        
#if os(iOS)
        adData[PROP_AD_COMPANIONS] = THEOplayerRCTAdAdapter.fromCompanionAds(companionAds: ad.companions)
#endif
        
        adData[PROP_AD_UNIVERSAL_AD_IDS] = []
        
        // Add additional properties for Linear Ads
        if let adDuration = ad.duration {
            adData[PROP_AD_DURATION] = adDuration
        }
        
        // Add additional properties for NonLinear Ads
        if let adClickThrough = ad.clickThrough {
            adData[PROP_AD_CLICK_THROUGH] = adClickThrough
        }

        // Add additional properties for GoogleIma Ads
        if let googleImaAd = ad as? GoogleImaAd {
            if let adSystem = googleImaAd.adSystem {
                adData[PROP_GOOGLE_AD_AD_SYSTEM] = adSystem
            }
            if let creativeId = googleImaAd.creativeId {
                adData[PROP_GOOGLE_AD_CREATIVE_ID] = creativeId
            }
            let traffickingParametersString = googleImaAd.traffickingParameters
            adData[PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING] = traffickingParametersString
            if let traffickingParameters = THEOplayerRCTAdAdapter.fromTraffickingParameters(traffickingParametersString: traffickingParametersString) {
                adData[PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS] = traffickingParameters
            }
            adData[PROP_GOOGLE_AD_BITRATE] = googleImaAd.vastMediaBitrate
            if let width = googleImaAd.width {
                adData[PROP_GOOGLE_AD_WIDTH] = width
            }
            if let height = googleImaAd.height {
                adData[PROP_GOOGLE_AD_HEIGHT] = height
            }
            if !googleImaAd.universalAdIds.isEmpty {
                adData[PROP_AD_UNIVERSAL_AD_IDS] = THEOplayerRCTAdAdapter.fromUniversalAdIds(universalAdIds: googleImaAd.universalAdIds)
            }
            adData[PROP_GOOGLE_AD_WRAPPER_AD_IDS] = googleImaAd.wrapperAdIds
            adData[PROP_GOOGLE_AD_WRAPPER_AD_SYSTEMS] = googleImaAd.wrapperAdSystems
            adData[PROP_GOOGLE_AD_WRAPPER_CREATIVE_IDS] = googleImaAd.wrapperCreativeIds
        }
        
        return adData
    }
    
    private class func fromUniversalAdIds(universalAdIds: [THEOplayerSDK.UniversalAdId]?) -> [[String:Any]] {
        guard let universalAdIds = universalAdIds else {
            return []
        }
        
        var adIdList: [[String:Any]] = []
        for adId in universalAdIds {
            var adIdData: [String:Any] = [:]
            adIdData[PROP_GOOGLE_AD_ID_REGISTRY] = adId.adIdRegistry
            adIdData[PROP_GOOGLE_AD_ID_VALUE] = adId.adIdValue
            adIdList.append(adIdData)
        }
        
        return adIdList
    }
    
    class func toAd(adData: [String:Any]?) -> NativeAd? {
        guard let adData = adData else {
            return nil
        }
        
        return NativeLinearGoogleImaAd(adBreak: THEOplayerRCTAdAdapter.toAdBreak(adBreakData: adData[PROP_AD_BREAK] as? [String:Any]),
                                       companions: THEOplayerRCTAdAdapter.toCompanionAds(companiondAdsData: adData[PROP_AD_COMPANIONS] as? [[String : Any]]),
                                       type: (adData[PROP_AD_TYPE] as? String) ?? "",
                                       id: adData[PROP_AD_ID] as? String,
                                       skipOffset: adData[PROP_AD_SKIP_OFFSET] as? Int,
                                       resourceURI: adData[PROP_AD_RESOURCE_URI] as? String,
                                       width: adData[PROP_GOOGLE_AD_WIDTH] as? Int,
                                       height: adData[PROP_GOOGLE_AD_HEIGHT] as? Int,
                                       integration: THEOplayerRCTTypeUtils.adIntegrationKind((adData[PROP_AD_INTEGRATION] as? String) ?? ""),
                                       duration: lround((adData[PROP_AD_DURATION] as? Double) ?? 0.0),
                                       clickThrough: adData[PROP_AD_CLICK_THROUGH] as? String,
                                       customIntegration: adData[PROP_AD_CUSTOM_INTEGRATION] as? String,
                                       mediaFiles: [], // TODO
                                       adSystem: adData[PROP_GOOGLE_AD_AD_SYSTEM] as? String,
                                       creativeId: adData[PROP_GOOGLE_AD_CREATIVE_ID] as? String,
                                       wrapperAdIds: (adData[PROP_GOOGLE_AD_WRAPPER_AD_IDS] as? [String]) ?? [],
                                       wrapperAdSystems: (adData[PROP_GOOGLE_AD_WRAPPER_AD_SYSTEMS] as? [String]) ?? [],
                                       wrapperCreativeIds: (adData[PROP_GOOGLE_AD_WRAPPER_CREATIVE_IDS] as? [String] ?? []),
                                       vastMediaBitrate: (adData[PROP_GOOGLE_AD_BITRATE] as? Int) ?? 0,
                                       universalAdIds: THEOplayerRCTAdAdapter.toUniversalAdIds(universalAdIdsData: adData[PROP_AD_UNIVERSAL_AD_IDS] as? [[String:Any]]),
                                       traffickingParameters: "") // TODO
    }
    
    private class func toUniversalAdIds(universalAdIdsData: [[String:Any]]?) -> [THEOplayerSDK.UniversalAdId] {
        guard let universalAdIdsData = universalAdIdsData else {
            return []
        }
        
        var adIdList: [THEOplayerSDK.UniversalAdId] = []
        
        for adIdData in universalAdIdsData {
            adIdList.append(NativeUniversalAdId(adIdValue: (adIdData[PROP_GOOGLE_AD_ID_VALUE] as? String) ?? "",
                                                adIdRegistry: (adIdData[PROP_GOOGLE_AD_ID_REGISTRY] as? String) ?? ""))
        }
        
        return adIdList
    }
    
    class func fromAdBreak(adBreak: AdBreak) -> [String:Any] {
        var adBreakData: [String:Any] = [:]
        adBreakData[PROP_ADBREAK_MAX_DURATION] = adBreak.maxDuration
        adBreakData[PROP_ADBREAK_TIME_OFFSET] = adBreak.timeOffset
        adBreakData[PROP_ADBREAK_MAX_REMAINING_DURATION] = adBreak.maxRemainingDuration
        adBreakData[PROP_ADBREAK_INTEGRATION] = adBreak.integration
        adBreakData[PROP_ADBREAK_CUSTOM_INTEGRATION] = adBreak.customIntegration
        // process adds when adbreak contains them
        if !adBreak.ads.isEmpty {
            var adList: [[String:Any]] = []
            for ad in adBreak.ads {
                adList.append(THEOplayerRCTAdAdapter.fromAd(ad: ad, processAdBreak: false))
            }
            adBreakData[PROP_ADBREAK_ADS] = adList
        }
        return adBreakData
    }
    
    class func toAdBreak(adBreakData: [String:Any]?) -> NativeAdBreak? {
        guard let adBreakData = adBreakData else {
            return nil
        }
        
        var ads: [NativeAd] = []
        if let adsData = adBreakData[PROP_ADBREAK_ADS] as? [[String:Any]] {
            for adData in adsData {
                if let ad = THEOplayerRCTAdAdapter.toAd(adData: adData) {
                    ads.append(ad)
                }
            }
        }
        
        return NativeAdBreak(ads: ads,
                             maxDuration: lround((adBreakData[PROP_ADBREAK_MAX_DURATION] as? Double) ?? 0),
                             maxRemainingDuration: (adBreakData[PROP_ADBREAK_MAX_REMAINING_DURATION] as? Double) ?? 0,
                             timeOffset: lround((adBreakData[PROP_ADBREAK_TIME_OFFSET] as? Double) ?? 0),
                             integration: THEOplayerRCTTypeUtils.adIntegrationKind((adBreakData[PROP_ADBREAK_INTEGRATION] as? String) ?? ""),
                             customIntegration: adBreakData[PROP_ADBREAK_CUSTOM_INTEGRATION] as? String)
    }
    
    class private func fromCompanionAds(companionAds: [CompanionAd?]) -> [[String:Any]] {
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
    
    class func toCompanionAds(companiondAdsData: [[String:Any]]?) -> [CompanionAd?] {
        return []
    }
    
    class private func fromTraffickingParameters(traffickingParametersString: String) -> [String:Any]? {
        if let data = traffickingParametersString.data(using: .utf8) {
            return try? JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String:Any]
        }
        return nil
    }
    
}
