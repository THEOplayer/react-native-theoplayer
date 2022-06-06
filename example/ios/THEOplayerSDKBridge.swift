//
//  THEOplayerSDKBridge.swift
//  ReactNativeTHEOplayer
//
//  Created by William Van Haevre on 28/01/2022.
//

import Foundation
import UIKit
import THEOplayerSDK

@objc
class THEOplayerSDKBridge: NSObject {
  @objc
  static func prepare(firstViewController: UIViewController) {
    THEOplayer.prepare(withFirstViewController: firstViewController)
  }
}


