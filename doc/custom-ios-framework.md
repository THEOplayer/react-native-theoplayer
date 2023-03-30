# React Native THEOplayer - custom THEOplayer portal build for iOS

To use a custom THEOplayerSDK xcframework for iOS, you need to change the dependency of the react-native-package on the THEOplayerSDK-basic pod into a dependency on a custom xcframework build.

## Generate/download custom THEOplayerSDK.xcframework
Create in your application's ios folder a new folder named TheoSDK, to store the custom xcframeworks (**[YourApplicationFolder]/ios/TheoSdk**). This should be at the same level as the Podfile of your application (**[YourApplicationFolder]/ios/Podfile**)

### Prepare custom builds
Generate the custom xcframeworks (with the required features) on [portal.theoplayer.com](http://portal.theoplayer.com), and
- copy the generated xcframework for iOS to **[YourApplicationFolder]/ios/TheoSdk/Frameworks/ios/THEOplayerSDK.xcframework**. 
- copy the generated xcframework for tvOS to **[YourApplicationFolder]/ios/TheoSdk/Frameworks/tvos/THEOplayerSDK.xcframework**. 

### Prepare TheoSDK/THEOplayerSDK-basic.podscpec
Add a new THEOplayerSDK-basic.podspec file to the new TheoSDK folder (**[YourApplicationFolder]/ios/THEOplayerSDK-basic.podspec**) with the following contents:
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
Make sure the paths in the podspec point to your downloaded xcframeworks, which should be good after following the above steps.

### Update your Podfile
In your application's Podfile, located at **[YourApplicationFolder]/ios/Podfile**, add the following line to redirect all dependencies for the THEOplayerSDK-basic within your project to the newly created podspec:
```
pod 'THEOplayerSDK-basic', :path => './TheoSDK'
```

## Link to new SDK
Run **pod install** to update the SDK dependencies in your application. This will regenerate the pod project for your application that now depends on the generated xcframeworks
```
> cd [YourProjectFolder]/ios
> pod install
```

## 4.x SDK Feature flags
When using a custom 4.x SDK for THEOplayer, the react-native-theoplayer package needs to be notified of the features that were added to that custom build. This is done by a script that evaluates the generated xcframeworks. This script targets by default the above mentioned TheoSDK folder. If you move your custom frameworks to a different location (than the suggested TheoSDK folder), you must update that location in the react-native-theoplayer.podspec in your react-native-theoplayer node_module folder. 