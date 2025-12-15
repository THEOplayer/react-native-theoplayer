// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let SD_PROP_PROFILE: String = "profile"
let SD_PROP_WEBRTC: String = "webrtc"
let SD_PROP_PLAYOUT_DELAY: String = "playoutDelayMs"
let SD_PROP_PLAYOUT_DELAY_MIN: String = "minimum"
let SD_PROP_PLAYOUT_DELAY_MAX: String = "maximum"

extension THEOplayerRCTSourceDescriptionBuilder {

    private static func buildWebrtcOptions(_ theoliveData: [String: Any]) -> WebrtcOptions? {
          let webrtc = theoliveData[SD_PROP_WEBRTC] as? [String: Any]
          let playoutDelay = webrtc?[SD_PROP_PLAYOUT_DELAY] as? [String: Int]
          let playoutDelayMin = playoutDelay?[SD_PROP_PLAYOUT_DELAY_MIN]
          let playoutDelayMax = playoutDelay?[SD_PROP_PLAYOUT_DELAY_MAX]
          guard let playoutDelayMin, let playoutDelayMax else { return nil }
          return WebrtcOptions(playoutDelayMs: PlayoutDelay(minimum: playoutDelayMin, maximum: playoutDelayMax))
    }
  
    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOlive TypedSource.
     */
    static func buildTHEOliveDescription(_ theoliveData: [String:Any], contentProtection: MultiplatformDRMConfiguration?) -> TypedSource? {
#if canImport(THEOplayerTHEOliveIntegration)
      if let src = theoliveData[SD_PROP_SRC] as? String {
          let profile = theoliveData[SD_PROP_PROFILE] as? String;
          let webrtc = buildWebrtcOptions(theoliveData)
          return TheoLiveSource(channelId: src, drm: contentProtection, profile: profile, webrtc: webrtc)
      }
#endif
        return nil
    }
}
