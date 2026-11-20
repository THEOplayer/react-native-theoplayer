import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

#if !os(tvOS)
import GoogleCast
#endif

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    self.launchOptions = launchOptions

    #if !os(tvOS)
      let receiverAppID = "87169DE4"
      let criteria = GCKDiscoveryCriteria(applicationID: receiverAppID)
      let options = GCKCastOptions(discoveryCriteria: criteria)
      options.startDiscoveryAfterFirstTapOnCastButton = false
      options.suspendSessionsWhenBackgrounded = false
      GCKCastContext.setSharedInstanceWith(options)
    #endif

    return true
  }
}
