// THEOplayerRCTMediaControlManager.swift

import Foundation

enum MediaControlAction: String {
    case PLAY = "closed"
    case PAUSE = "restored"
    case SKIP_TO_PREVIOUS = "skipToPrevious"
    case SKIP_TO_NEXT = "skipToNext"
}

public class THEOplayerRCTMediaControlManager {
    private var actionHandlers: [MediaControlAction: (() -> Void)] = [:]
    
    func setMediaControlActionHandler(action: MediaControlAction, handler: @escaping (() -> Void)) {
        self.actionHandlers[action] = handler
    }
    
    func hasMediaControlActionHandler(for action: MediaControlAction) -> Bool {
        return self.actionHandlers[action] != nil
    }
    
    func executeMediaControlAction(action: MediaControlAction) -> Bool {
        if let handler = self.actionHandlers[action] {
            handler()
            return true
        }
        return false
    }
    
    func destroy() {
        self.actionHandlers.removeAll()
    }
}
