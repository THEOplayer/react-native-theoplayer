// THEOplayerRCTPresentationModeContext.swift

import Foundation
import THEOplayerSDK

enum PipContext: String {
    case PIP_CLOSED = "closed"
    case PIP_RESTORED = "restored"
}

class THEOplayerRCTPresentationModeContext {
    // MARK: Members
    var pipContext: PipContext = .PIP_CLOSED
    
    func eventContextForNewPresentationMode(oldPresentationMode: PresentationMode, newPresentationMode: PresentationMode) -> [String:Any] {
        var eventContext: [String:Any] = [
            "presentationMode": THEOplayerRCTTypeUtils.presentationModeToString(newPresentationMode),
            "previousPresentationMode": THEOplayerRCTTypeUtils.presentationModeToString(oldPresentationMode),
        ]
        if oldPresentationMode == .pictureInPicture {
            eventContext["context"] = ["pip" : self.pipContext.rawValue]
        }
        return eventContext
    }
}
