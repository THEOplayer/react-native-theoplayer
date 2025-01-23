// THEOplayerRCTAdEventAdapter.swift

import Foundation
import THEOplayerSDK

let ADEVENT_PROP_SUBTYPE: String = "subType"
let ADEVENT_PROP_AD: String = "ad"

class THEOplayerRCTAdEventAdapter {
    class func toAdEvent(eventData: NSDictionary) -> THEOplayerSDK.EventProtocol? {
        if let subtype = eventData[ADEVENT_PROP_SUBTYPE] as? String {
            let adData = eventData[ADEVENT_PROP_AD] as? [String:Any]
            switch (subtype) {
            case "adloaded": return THEOplayerSDK.AdLoadedEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "adbreakbegin": return THEOplayerSDK.AdBreakBeginEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAdBreak(adBreakData: adData))
            case "adbegin": return THEOplayerSDK.AdBeginEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "adfirstquartile": return THEOplayerSDK.AdFirstQuartileEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "admidpoint": return THEOplayerSDK.AdMidpointEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "adthirdquartile": return THEOplayerSDK.AdThirdQuartileEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "adend": return THEOplayerSDK.AdEndEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAd(adData: adData))
            case "adbreakend": return THEOplayerSDK.AdBreakEndEvent(date: Date(), ad: THEOplayerRCTAdAdapter.toAdBreak(adBreakData: adData))
            default: return nil
            }
        }
        return nil
    }
}
