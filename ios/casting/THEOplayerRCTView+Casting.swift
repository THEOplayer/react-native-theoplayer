// THEOplayerRCTView+Casting.swift

import Foundation
import THEOplayerSDK

extension THEOplayerRCTView {
    
#if os(iOS)
    func cast() -> Cast? {
        guard let player = self.player else {
            return nil
        }
        return player.cast
    }
#endif
    
}
