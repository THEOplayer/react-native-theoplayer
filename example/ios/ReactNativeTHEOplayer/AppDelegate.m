#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
@import react_native_theoplayer;

#if !TARGET_OS_TV
#import <GoogleCast/GoogleCast.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ReactNativeTHEOplayer";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

#if !TARGET_OS_TV
  NSString *receiverAppID = @"CC1AD845"; // default receiver
  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:receiverAppID];
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
  options.startDiscoveryAfterFirstTapOnCastButton = false;
  options.suspendSessionsWhenBackgrounded = false;
  [GCKCastContext setSharedInstanceWithOptions:options];
#endif
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (UIViewController *)createRootViewController {
  return [HomeIndicatorViewController new];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
