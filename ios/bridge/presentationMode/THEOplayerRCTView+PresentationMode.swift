// THEOplayerRCTView+PresentationMode.swift

import Foundation
import THEOplayerSDK

extension THEOplayerRCTView {
    
    func setPresentationMode(newPresentationMode: THEOplayerSDK.PresentationMode)  {
        self.presentationModeManager.setPresentationModeFromRN(newPresentationMode: newPresentationMode)
    }
}
