# React Native THEOplayer - custom 4.x THEOplayer portal build for iOS

To use a custom THEOplayerSDK xcframework for iOS, you need to change the dependency of the react-native-package on the THEOplayerSDK-basic pod into a dependency on a custom xcframework build.

## Generate/download custom THEOplayerSDK.xcframework
Create in your application's ios folder a new folder named TheoSDK, to store the custom xcframeworks (**[YourApplicationFolder]/ios/TheoSdk**). This should be at the same level as the Podfile of your application (**[YourApplicationFolder]/ios/Podfile**)

### Prepare custom builds
Generate the custom xcframeworks (with the required features) on [portal.theoplayer.com](http://portal.theoplayer.com), and
- copy the generated xcframework for iOS to **[YourApplicationFolder]/ios/TheoSdk/Frameworks/ios/THEOplayerSDK.xcframework**. 
- copy the generated xcframework for tvOS to **[YourApplicationFolder]/ios/TheoSdk/Frameworks/tvos/THEOplayerSDK.xcframework**. 

### Prepare TheoSDK/THEOplayerSDK-basic.podscpec
Add a new THEOplayerSDK-basic.podspec file to the new TheoSDK folder (**[YourApplicationFolder]/ios/THEOplayerSDK-basic.podspec**) with the following example contents (below has Ads feature added in the custom build):
```
Pod::Spec.new do |s|

  s.name         = "THEOplayerSDK-basic"
  s.version      = "1.0"
  s.summary      = "A custom build of THEOplayerSDK"
  s.description  = "A custom build of THEOplayerSDK"
  s.homepage     = "https://theoplayer.com"
  s.license      = "MIT"
  s.author       = { "THEO" => "theo@theoplayer.com" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }
  s.platforms    = { :ios => "12.0", :tvos => "12.0" }

  ### Set custom player SDK
  s.ios.vendored_frameworks = 'Frameworks/ios/THEOplayerSDK.xcframework',
  s.tvos.vendored_frameworks = 'Frameworks/tvos/THEOplayerSDK.xcframework',

  ### Set Ads dependencies
  s.ios.dependency "GoogleAds-IMA-iOS-SDK", "3.18.4"
  s.tvos.dependency "GoogleAds-IMA-tvOS-SDK", "4.8.2"
end
```
Make sure the paths in the podspec point to your downloaded xcframeworks, which should be good when following the above steps.

### Update your Podfile
In your application's Podfile, located at **[YourApplicationFolder]/ios/Podfile**, add the following line to redirect all dependencies for the THEOplayerSDK-basic within your project to the newly created podspec:
```
pod 'THEOplayerSDK-basic', :path => './TheoSDK'
```

## Mark your custom 4.x SDK Features
When using a custom 4.x SDK for THEOplayer, the react-native-theoplayer package needs to be notified of the features that were added to that custom build. You can specify the features that were added to the custom build in a file in your application folder:

Create/modify the json file located at **[YourApplicationFolder]/react-native-theoplayer.json** (Should be same level as the node_modules folder)

Edit the file to reflect your custom features (all uppercase, with dashes replaced by underscores):
```
{
	"ios": {
		"features": [
			"WEB",
			"GOOGLE_IMA",
			"GOOGLE_DAI",
			"CHROMECAST"
		]
	}
}
```
- **WEB** Indicates a 4.x custom build is used
- **GOOGLE_IMA** enables the Google IMA functionality in the 4.x SDK
- **GOOGLE_DAI** enables the Google DAI functionality in the 4.x SDK
- **CHROMECAST** enables the chromecsting functionality in the 4.x SDK

Make sure to add the **'WEB'** feature to indicate a custom **4.x** build is being used. Otherwise a more recent 5.x player is expected which could support a different set of features.

## Finalize the project
Run **pod install** to update the SDK dependencies in your application. This will regenerate the pod project for your application that now depends on the generated xcframeworks and supports the indicated features.
```
> cd [YourProjectFolder]/ios
> pod install
```
