#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#if TARGET_OS_TV
#import <THEOplayerSDK/THEOplayerSDK-Swift.h>
#endif

// uncomment for react-native-google-cast
//#import <GoogleCast/GoogleCast.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ReactNativeTHEOplayer"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  
#if TARGET_OS_TV
  [THEOplayer prepareWithFirstViewController: [UIViewController new]];
#endif
  
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
// uncomment for react-native-google-cast
// NSString *receiverAppID = @"CC1AD845"; // default receiver
//  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:receiverAppID];
//  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
//  options.startDiscoveryAfterFirstTapOnCastButton = false;
//  [GCKCastContext setSharedInstanceWithOptions:options];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
