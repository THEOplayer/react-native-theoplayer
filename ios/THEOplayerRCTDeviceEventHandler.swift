// THEOplayerRCTDeviceEventHandler.swift

import Foundation
import THEOplayerSDK

public class THEOplayerRCTDeviceEventHandler {
    // MARK: Events
    var onNativeDeviceOrientationChanged: RCTDirectEventBlock?
    
    init() {
#if os(iOS)
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.handleOrientationChange),
            name: UIDevice.orientationDidChangeNotification,
            object: nil
        )
#endif
    }
    
    func destroy() {
#if os(iOS)
        NotificationCenter.default.removeObserver(self, name: UIDevice.orientationDidChangeNotification, object: nil)
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
#endif
    }
  
#if os(iOS)
    @objc private func handleOrientationChange() {
        DispatchQueue.main.async {
            if let forwardedNativeOrientationChanged = self.onNativeDeviceOrientationChanged {
                forwardedNativeOrientationChanged([:])
            }
        }
    }
#endif
}
