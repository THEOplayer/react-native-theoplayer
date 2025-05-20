// THEOplayerRCTView+Millicast.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerMillicastIntegration)
import THEOplayerMillicastIntegration
#endif

extension THEOplayerRCTView {
    func initMillicastIntegration() {
        guard let player = self.player else {
            return
        }

#if canImport(THEOplayerMillicastIntegration)
        self.millicastIntegration = MillicastIntegrationFactory.createIntegration()
        player.addIntegration(self.millicastIntegration!)
#endif
    }
}
