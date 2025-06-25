// THEOplayerRCTView+THEOads.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif

extension THEOplayerRCTView {
    func initTHEOadsIntegration() {
        guard let player = self.player else {
            return
        }
        
#if canImport(THEOplayerTHEOadsIntegration)
        // setup integration
      self.THEOadsIntegration = THEOadsIntegrationFactory.createIntegration(on: player)
      player.addIntegration(self.THEOadsIntegration!)
#endif
        
    }
}
