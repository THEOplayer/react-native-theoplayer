// TTHEOplayerRCTPipManager.swift

import Foundation
import AVKit
import THEOplayerSDK

class THEOplayerRCTPipManager: NSObject, AVPictureInPictureControllerDelegate {
  
  // MARK: Members
  private weak var view: THEOplayerRCTView?

  // MARK: - player setup / breakdown
  func setView(view: THEOplayerRCTView?) {
      self.view = view
  }
  
  func destroy() {}
  
  // MARK: - AVPictureInPictureControllerDelegate
  @available(tvOS 14.0, *)
  public func pictureInPictureControllerWillStartPictureInPicture(_ pictureInPictureController: AVPictureInPictureController) {
      if let view = self.view {
          view.presentationModeManager.presentationModeContext.pipContext = .PIP_CLOSED
          view.pipControlsManager.willStartPip()
      }
  }
  
  @available(tvOS 14.0, *)
  public func pictureInPictureController(_ pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
      if let view = self.view {
           view.presentationModeManager.presentationModeContext.pipContext = .PIP_RESTORED
      }
  }
}
