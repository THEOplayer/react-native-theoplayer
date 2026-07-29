//  THEOplayerRCTAdsAPI+Omid.swift

import Foundation
import THEOplayerSDK
import UIKit

let PROP_OMID_VIEW: String = "view"
let PROP_OMID_PURPOSE: String = "purpose"
let PROP_OMID_REASON: String = "reason"

extension THEOplayerRCTAdsAPI {
  
#if canImport(THEOplayerGoogleIMAIntegration)
  @objc(addFriendlyObstruction:obstruction:)
  func addFriendlyObstruction(_ node: NSNumber, obstruction: NSDictionary) {
    withViewAndAds(node) { _, ads in
      if let obstructionNode = obstruction[PROP_OMID_VIEW] as? NSNumber,
         let purposeString = obstruction[PROP_OMID_PURPOSE] as? String,
         let obstructionView = self.bridge.uiManager.view(forReactTag: obstructionNode) {
        let obstruction = OmidFriendlyObstruction(view: obstructionView,
                                                  purpose: THEOplayerRCTTypeUtils.omidFriendlyObstructionPurposeFromString(purposeString),
                                                  detailedReason: obstruction[PROP_OMID_REASON] as? String)
        ads.omid.addFriendlyObstruction(friendlyObstruction: obstruction)
      }
    }
  }
  
  @objc(removeAllFriendlyObstructions:)
  func removeAllFriendlyObstructions(_ node: NSNumber) {
    withViewAndAds(node) { _, ads in
      ads.omid.removeFriendlyObstructions()
    }
  }
  
#else
  
  @objc(addFriendlyObstruction:obstruction:)
  func addFriendlyObstruction(_ node: NSNumber, obstruction: NSDictionary) {
    if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
  }
  
  @objc(removeAllFriendlyObstructions:)
  func removeAllFriendlyObstructions(_ node: NSNumber) {
    if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
  }
  
#endif
}


