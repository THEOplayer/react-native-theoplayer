//  THEOplayerRCTAdsAPI+Omid.swift

import Foundation
import THEOplayerSDK
import UIKit

let PROP_OMID_VIEW: String = "view"
let PROP_OMID_PURPOSE: String = "purpose"
let PROP_OMID_REASON: String = "reason"

extension THEOplayerRCTAdsAPI {
    
#if canImport(THEOplayerGoogleIMAIntegration)
    func addFriendlyObstruction(_ view: THEOplayerRCTView? = nil, obstructionView: UIView, obstruction: NSDictionary) {
        if let theView = view,
           let purposeString = obstruction[PROP_OMID_PURPOSE] as? String,
           let ads = theView.ads() {
            let obstruction = OmidFriendlyObstruction(view: obstructionView,
                                                      purpose: THEOplayerRCTTypeUtils.omidFriendlyObstructionPurposeFromString(purposeString),
                                                      detailedReason: obstruction[PROP_OMID_REASON] as? String)
            ads.omid.addFriendlyObstruction(friendlyObstruction: obstruction)
        }
    }
    
    func removeAllFriendlyObstructions(_ view: THEOplayerRCTView? = nil) {
        if let theView = view,
           let ads = theView.ads() {
            ads.omid.removeFriendlyObstructions()
        }
    }
    
#else
    
    func addFriendlyObstruction(_ view: THEOplayerRCTView? = nil, obstruction: NSDictionary) {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
    }
    
    func removeAllFriendlyObstructions(_ view: THEOplayerRCTView? = nil) {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
    }
    
#endif
}


