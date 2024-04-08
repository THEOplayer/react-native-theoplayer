# Getting started

## Prerequisites:
* [Prepare the React Native development environment](https://reactnative.dev/docs/environment-setup?guide=native)
    * Install Node (Recommended: use [nvm](https://github.com/nvm-sh/nvm))
    * Install Watchman
    * [Android] Install OpenJDK
    * [Android] Install Android Studio and Android SDK, ensure the ANDROID_HOME env var is configured correctly
    * [Mac/iOS] Install Xcode, Xcode CLI tools and an iOS Simulator
    * [Mac/iOS] [Install CocoaPods](https://guides.cocoapods.org/using/getting-started.html)
* Run `npm install` in the root directory


## Running the example apps
* Acquire and configure a valid [THEOplayer license](https://portal.theoplayer.com/) in the player configuration in `example/src/App.tsx`
* Run
    ```
    cd example
    npm install
    ```

### Web
*   ```
    npm run web
    ```
    This will run the webpack dev server with test page at `localhost:8080`

### Android
* Option 1:
    ```
    npm run android
    ```
    This will
    * Set up the android gradle build environment
    * Try to launch the android example app on an emulator or connected device
    * Launch the Metro dev server and console, this can also now be used to launch the Android app on your device or emulator
* Option 2:
    ```
    npm start
    ```
    This will launch the Metro dev server and console, you can now use
    * `a` to launch the android example app on an emulator or connected device
    * `r` to reload launched apps


*   
### iOS
* Option 1:
    ```
    cd ios && pod install
    cd .. && npm run ios
    ```
    This will
    * Try to launch the ios example app on a simulator or connected device
    * Launch the Metro dev server and console, this can also now be used to launch the iOS app on your device or emulator
* Option 2:
    ```
    npm start
    ```
    This will launch the Metro dev server and console, you can now use
    * `i` to launch the ios example app on an emulator or connected device
    * `r` to reload launched apps
