// THEOplayerRCTView+AppState.swift

import Foundation

extension THEOplayerRCTView {
    func setupAppStateObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidEnterBackground),
            name: UIApplication.didEnterBackgroundNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillEnterForeground),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
    }
    
    func clearAppStateObservers() {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func applicationDidEnterBackground() {
        self.isApplicationInBackground = true
    }

    @objc private func applicationWillEnterForeground() {
        self.isApplicationInBackground = false
    }
}
