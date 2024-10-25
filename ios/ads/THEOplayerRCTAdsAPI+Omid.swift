//  THEOplayerRCTAdsAPI+Omid.swift

import Foundation
import THEOplayerSDK
import UIKit

extension THEOplayerRCTAdsAPI {
  
#if canImport(THEOplayerGoogleIMAIntegration)
  @objc(addFriendlyObstruction:obstruction:)
  func addFriendlyObstruction(_ node: NSNumber, obstruction: NSDictionary) {
  }
  
  @objc(removeAllFriendlyObstructions:)
  func removeAllFriendlyObstructions(_ node: NSNumber) {
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


