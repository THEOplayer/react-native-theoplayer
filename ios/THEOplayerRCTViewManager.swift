//
//  THEOplayerRCTViewManager.swift
//  Theoplayer
//

import Foundation
import UIKit
import React

@objc(THEOplayerRCTViewManager)
class THEOplayerRCTViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return THEOplayerRCTView();
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
}
