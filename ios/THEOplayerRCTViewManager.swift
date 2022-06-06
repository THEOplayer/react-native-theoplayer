//
//  THEOplayerRCTViewManager.swift
//  Theoplayer
//
//  Created by William van Haevre on 14/01/2022.
//  Copyright © 2022 Facebook. All rights reserved.
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
