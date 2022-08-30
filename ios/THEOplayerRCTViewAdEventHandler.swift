// THEOplayerRCTViewAdEventHandler.swift

import Foundation
import THEOplayerSDK

class THEOplayerRCTViewAdEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
        
    // MARK: Events
    
    // MARK: Ad Listeners
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player;
        
        // attach listeners
        self.attachListeners()
    }
    
    // MARK: - attach/dettach Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
    }
    
}
