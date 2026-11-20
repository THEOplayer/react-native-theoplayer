// THEOplayerRCTViewTapHandler.swift

import Foundation
import UIKit

/// Reports taps on the player view to JS, without taking them away from other recognizers in the player view, such as
/// the one that opens a THEOads overlay clickthrough.
public class THEOplayerRCTViewTapHandler: NSObject, UIGestureRecognizerDelegate {
    // MARK: Events
    var onNativeViewTap: RCTDirectEventBlock?

#if os(iOS)
    private lazy var tapGestureRecognizer: UITapGestureRecognizer = {
        let recognizer = UITapGestureRecognizer(target: self, action: #selector(self.handleTap))
        recognizer.cancelsTouchesInView = false
        recognizer.delaysTouchesEnded = false
        recognizer.delegate = self
        return recognizer
    }()
#endif

    /// Starts observing taps on the given view and its subviews.
    func attach(to view: UIView) {
#if os(iOS)
        view.addGestureRecognizer(self.tapGestureRecognizer)
#endif
    }

    /// Stops observing taps.
    func destroy() {
#if os(iOS)
        self.tapGestureRecognizer.view?.removeGestureRecognizer(self.tapGestureRecognizer)
#endif
    }

#if os(iOS)
    @objc private func handleTap(_ recognizer: UITapGestureRecognizer) {
        if recognizer.state == .ended {
            self.onNativeViewTap?([:])
        }
    }

    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
#endif
}
