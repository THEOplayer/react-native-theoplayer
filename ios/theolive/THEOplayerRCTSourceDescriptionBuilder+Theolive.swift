// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let SD_PROP_PROFILE: String = "profile"

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOlive TypedSource.
     */
    static func buildTHEOliveDescription(_ theoliveData: [String:Any], contentProtection: MultiplatformDRMConfiguration?) -> TypedSource? {
#if canImport(THEOplayerTHEOliveIntegration)
      if let src = theoliveData[SD_PROP_SRC] as? String {
          let profile = theoliveData[SD_PROP_PROFILE] as? String;
          return TheoLiveSource(channelId: src, drm: contentProtection, profile: profile)
      }
#endif
        return nil
    }
}
