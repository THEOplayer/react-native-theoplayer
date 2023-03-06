// THEOplayerRCTPresentationModeContext.swift

import Foundation
import THEOplayerSDK

enum PipContext: String {
    case PIP_CLOSED = "closed"
    case PIP_RESTORED = "restored"
}

class THEOplayerRCTPresentationModeContext {
    // MARK: Members
    var currentPresentationMode: THEOplayerSDK.PresentationMode = .inline // TheoPlayer's initial presentationMode
    var pipContext: PipContext = .PIP_CLOSED
    
    func eventContextForNewPresentationMode(_ newPresentationMode: PresentationMode) -> [String:Any] {
        let previousPresentationMode = self.currentPresentationMode
        self.currentPresentationMode = newPresentationMode
        
        var eventContext: [String:Any] = [
            "presentationMode": THEOplayerRCTTypeUtils.presentationModeToString(self.currentPresentationMode),
            "previousPresentationMode": THEOplayerRCTTypeUtils.presentationModeToString(previousPresentationMode),
        ]
        if previousPresentationMode == .pictureInPicture {
            eventContext["context"] = ["pip" : self.pipContext.rawValue]
        }
        return eventContext
    }
}
