// THEOplayerRCTSourceDescriptionBuilder+Millicast.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerMillicastIntegration)
import THEOplayerMillicastIntegration
#endif

let SD_PROP_ACCOUNTID: String = "streamAccountId"

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a Millicast TypedSource.
     */
    static func buildMillicastDescription(_ millicastData: [String:Any]) -> TypedSource? {
#if canImport(THEOplayerMillicastIntegration)
      if let src = millicastData[SD_PROP_SRC] as? String, let accountID = millicastData[SD_PROP_ACCOUNTID] as? String {
        return MillicastSource(src: src, streamAccountId: accountID)
      }
#endif
        return nil
    }
}
