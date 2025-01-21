//
//  THEOplayerRCTViewManager.swift
//

import Foundation
import UIKit

@objc(THEOplayerRCTViewManager)
class THEOplayerRCTViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return THEOplayerRCTView();
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
}
