// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOlive TypedSource.
     */
    static func buildTHEOliveDescription(_ theoliveData: [String:Any]) -> TypedSource? {
#if canImport(THEOplayerTHEOliveIntegration)
      if let src = theoliveData[SD_PROP_SRC] as? String {
          return TheoLiveSource(channelId: src)
      }
#endif
        return nil
    }
}
