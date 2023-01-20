// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

extension THEOplayerRCTView {
    
    func ads() -> Ads? {
        guard let player = self.player else {
            return nil
        }
        return player.ads
    }

}
