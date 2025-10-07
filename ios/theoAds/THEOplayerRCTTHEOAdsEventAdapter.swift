// THEOplayerRCTTHEOadsEventAdapter.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOadsIntegration)
@_spi(Core) import THEOplayerTHEOadsIntegration
#endif

// general
let PROP_INTERSTITIAL_ID: String = "id"
let PROP_INTERSTITIAL_TYPE: String = "type"
let PROP_INTERSTITIAL_START_TIME: String = "startTime"
let PROP_INTERSTITIAL_DURATION: String = "duration"
let PROP_AD_TAG_PARAMETERS: String = "adTagParameters"

// adbreak specific
let PROP_ADBREAK_INTERSTITIAL_LAYOUT: String = "layout"
let PROP_ADBREAK_INTERSTITIAL_BACKDROPURI: String = "backdropUri"
let PROP_ADBREAK_INTERSTITIAL_ADS: String = "ads"

// overlay specific
let PROP_OVERLAY_INTERSTITIAL_IMAGE_URL: String = "imageUrl"
let PROP_OVERLAY_INTERSTITIAL_CLICKTHROUGH: String = "clickThrough"
let PROP_OVERLAY_INTERSTITIAL_POSITION: String = "position"
let PROP_OVERLAY_INTERSTITIAL_SIZE: String = "size"

class THEOplayerRCTTHEOadsEventAdapter {

#if canImport(THEOplayerTHEOadsIntegration)
    class func fromInterstitial(_ interstitial: THEOplayerTHEOadsIntegration.Interstitial?) -> [String:Any] {
        guard let interstitial = interstitial else {
            return [:]
        }
        
        var interstitialData: [String:Any] = [:]
        interstitialData[PROP_INTERSTITIAL_ID] = interstitial.id
        interstitialData[PROP_INTERSTITIAL_TYPE] = THEOplayerRCTTHEOadsEventAdapter.fromInterstitialType(interstitial.type)
        interstitialData[PROP_INTERSTITIAL_START_TIME] = interstitial.startTime
        if let duration = interstitial.duration {
            interstitialData[PROP_INTERSTITIAL_DURATION] = duration
        }
        interstitialData[PROP_AD_TAG_PARAMETERS] = interstitial.adTagParameters

        // ADBREAK-INTERSTITIAL SPECIFIC:
        if let adBreakInterstitial = interstitial as? THEOplayerTHEOadsIntegration.AdBreakInterstitial {
            interstitialData[PROP_ADBREAK_INTERSTITIAL_LAYOUT] = THEOplayerRCTTHEOadsEventAdapter.fromInterstitialLayout(adBreakInterstitial.layout)
            if let backdropUri = adBreakInterstitial.backdropUri {
                interstitialData[PROP_ADBREAK_INTERSTITIAL_BACKDROPURI] = backdropUri
            }
            let interstitialAds = adBreakInterstitial.ads
            var ads: [[String:Any]] = []
            for ad in interstitialAds {
                ads.append(THEOplayerRCTAdAdapter.fromAd(ad: ad))
            }
            interstitialData[PROP_ADBREAK_INTERSTITIAL_ADS] = ads
        }
        
        // OVERLAY-INTERSTITIAL SPECIFIC
        if let overlayInterstitial = interstitial as? THEOplayerTHEOadsIntegration.OverlayInterstitial {
            if let imageUrl = overlayInterstitial.imageUrl {
                interstitialData[PROP_OVERLAY_INTERSTITIAL_IMAGE_URL] = imageUrl
            }
            if let clickThrough = overlayInterstitial.clickThrough {
                interstitialData[PROP_OVERLAY_INTERSTITIAL_CLICKTHROUGH] = clickThrough
            }
            interstitialData[PROP_OVERLAY_INTERSTITIAL_POSITION] = THEOplayerRCTTHEOadsEventAdapter.fromOverlayPosition(overlayInterstitial.position)
            interstitialData[PROP_OVERLAY_INTERSTITIAL_SIZE] = THEOplayerRCTTHEOadsEventAdapter.fromOverlaySize(overlayInterstitial.size)
        }
        
        return interstitialData
    }
    
    class func fromInterstitialType(_ interstitialType: THEOplayerTHEOadsIntegration.InterstitialType) -> String {
        switch interstitialType {
        case InterstitialType.adbreak:
            return "adbreak"
        default:
            return "overlay"
        }
    }

    class func fromInterstitialLayout(_ interstitialLayout: THEOplayerTHEOadsIntegration.THEOadsLayout) -> String {
        switch interstitialLayout {
        case THEOadsLayout.single:
            return "single"
        case THEOadsLayout.double:
            return "double"
        default:
            return "l-shape"
        }
    }
    
    class func fromOverlayPosition(_ overlayPosition: THEOplayerTHEOadsIntegration.OverlayPosition) -> [String:Any] {
        var overlayPositionData: [String:Any] = [:]
        if let left = overlayPosition.left {
            overlayPositionData["left"] = left
        }
        if let right = overlayPosition.right {
            overlayPositionData["right"] = right
        }
        if let top = overlayPosition.top {
            overlayPositionData["top"] = top
        }
        if let bottom = overlayPosition.bottom {
            overlayPositionData["bottom"] = bottom
        }
        return overlayPositionData
    }
    
    class func fromOverlaySize(_ overlaySize: THEOplayerTHEOadsIntegration.OverlaySize) -> [String:Any] {
        var overlaySizeData: [String:Any] = [:]
        overlaySizeData["width"] = overlaySize.width
        overlaySizeData["height"] = overlaySize.height
        return overlaySizeData
    }

#endif
    
}
