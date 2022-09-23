# React Native THEOplayer - custom THEOplayer portal build for iOS

![](../../doc/logo-react-native.png) ![](../../doc/logo-theo.png)

## Move to local npm module setup

To use a custom THEOplayerSDK for iOS, you need to change the dependency of the react-native-package on the THEOplayerSDK-basic pod into a dependency on a custom xcframework build. The easiest approach te prevent undoing your work with a later **npm install** is to create a local module dependency ([npm local paths](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#local-paths)). 

## Generate/download custom THEOplayerSDK.xcframework
Generate a custom xcframework with the required features on [portal.theoplayer.com](http://portal.theoplayer.com), and copy the downloaded xcframework for iOS to **ios/custom/Frameworks/ios/THEOplayerSDK.xcframework** in your local module's folder.

Replace the content of react-native-theoplayer.podspec in **[YourLocalModulesFolder]/react-native-theoplayer.podspec** with the contents of **[YourLocalModulesFolder]/react-native-theoplayer/ios/custom/react-native-theoplayer_custom_ios.podspec**.
```
> cd [YourProjectFolder]
> cp [YourLocalModulesFolder]/react-native-theoplayer/ios/custom/react-native-theoplayer_custom_ios.podspec [yourLocalModulesFolder]/react-native-theoplayer.podspec
```
And make sure that after copying the paths in the updated podspec of your module point to your downloaded xcframeworks.

## Link to new SDK
Run **pod install** to update the SDK dependencies in your application. This will regenerate the pod project for your application that now depends on the generated xcframework
```
> cd [YourProjectFolder]/ios
> pod install
```
