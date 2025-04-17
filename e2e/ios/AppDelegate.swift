import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

#if !TARGET_OS_TV
import GoogleCast
#endif

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    #if !TARGET_OS_TV
      let receiverAppID = "CC1AD845" // default receiver
      let criteria = GCKDiscoveryCriteria(applicationID: receiverAppID)
      let options = GCKCastOptions(discoveryCriteria: criteria)
      options.startDiscoveryAfterFirstTapOnCastButton = false
      options.suspendSessionsWhenBackgrounded = false
      GCKCastContext.setSharedInstanceWith(options)
    #endif

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "ReactNativeTHEOplayerE2E",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
