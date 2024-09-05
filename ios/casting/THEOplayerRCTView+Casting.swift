// THEOplayerRCTView+Casting.swift

import Foundation
import THEOplayerSDK
#if canImport(THEOplayerGoogleCastIntegration)
import THEOplayerGoogleCastIntegration
#endif

extension THEOplayerRCTView {
    
#if os(iOS)
    func cast() -> Cast? {
        guard let player = self.player else {
            return nil
        }
        return player.cast
    }
#endif
    
    func initCastIntegration() {
        guard let player = self.player else {
            return
        }
#if os(iOS) && canImport(THEOplayerGoogleCastIntegration)
        if let castConfiguration = self.playerCastConfiguration() {
            self.castIntegration = GoogleCastIntegrationFactory.createIntegration(on: player, with: castConfiguration)
            if let newCastIntegration = self.castIntegration {
                player.addIntegration(newCastIntegration)
            }
        }
#endif
    }
    
}
