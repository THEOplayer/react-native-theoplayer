// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTHEOliveIntegration)
@_spi(Experimental) import THEOplayerTHEOliveIntegration
#endif

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOlive TypedSource.
     */
    static func buildTHEOliveDescription(_ theoliveData: [String:Any]) -> TypedSource? {
#if canImport(THEOplayerTHEOliveIntegration)
      if let src = theoliveData[SD_PROP_SRC] as? String {
          //let headers = typedSourceData[SD_PROP_HEADERS] as? [String:String]
          if let type = theoliveData[SD_PROP_TYPE] as? String,
             type == "application/vnd.theo.hesp+json" {
              return HespSource(src: src)
          } else {
              return TheoLiveSource(channelId: src)
          }
      }
#endif
        return nil
    }
}
