// RCTBridgeModule+ViewHelpers.swift

import Foundation
import THEOplayerSDK

extension RCTBridgeModule {

    /// Resolves the THEOplayerRCTView for the given react tag on the main thread and invokes the action.
    /// If the view cannot be resolved, the optional onFailure callback is invoked instead.
    func withView(_ node: NSNumber, _ action: @escaping (THEOplayerRCTView) -> Void, onFailure: (() -> Void)? = nil) {
        DispatchQueue.main.async { [self] in
            if let bridge = self.bridge as? RCTBridge,
               let theView = bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                action(theView)
            } else {
                onFailure?()
            }
        }
    }

    /// Resolves the THEOplayerRCTView and its THEOplayer instance for the given react tag on the main thread.
    /// If the view or player cannot be resolved, the optional onFailure callback is invoked instead.
    func withViewAndPlayer(_ node: NSNumber, _ action: @escaping (THEOplayerRCTView, THEOplayer) -> Void, onFailure: (() -> Void)? = nil) {
        withView(node, { theView in
            if let player = theView.player {
                action(theView, player)
            } else {
                onFailure?()
            }
        }, onFailure: onFailure)
    }

    /// Resolves the THEOplayerRCTView and its Ads module for the given react tag on the main thread.
    /// If the view or ads module cannot be resolved, the optional onFailure callback is invoked instead.
    func withViewAndAds(_ node: NSNumber, _ action: @escaping (THEOplayerRCTView, Ads) -> Void, onFailure: (() -> Void)? = nil) {
        withView(node, { theView in
            if let ads = theView.ads() {
                action(theView, ads)
            } else {
                onFailure?()
            }
        }, onFailure: onFailure)
    }

#if os(iOS)
    /// Resolves the THEOplayerRCTView and its Cast module for the given react tag on the main thread.
    /// If the view or cast module cannot be resolved, the optional onFailure callback is invoked instead.
    func withViewAndCast(_ node: NSNumber, _ action: @escaping (THEOplayerRCTView, Cast) -> Void, onFailure: (() -> Void)? = nil) {
        withView(node, { theView in
            if let cast = theView.cast() {
                action(theView, cast)
            } else {
                onFailure?()
            }
        }, onFailure: onFailure)
    }
#endif

}
