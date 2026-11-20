# Migrating react-native-theoplayer from CocoaPods to Swift Package Manager

This guide moves the Apple native dependencies from CocoaPods to Swift Package
Manager (SPM). Optional THEOplayer integrations move from JSON feature flags to
Xcode package traits.

For a new application, see the [iOS/tvOS setup guide](./creating-minimal-app.md#getting-started-on-ios-and-tvos).
This guide focuses on converting an existing CocoaPods application.

There are two separate tasks:

1. Migrate the React Native app's native dependency setup to SPM.
2. Disable THEOplayer autolinking and add its installed package directly in Xcode.

There is no THEOplayer-specific generator. React Native's tooling still manages
React binaries, code generation, and the app's other autolinked libraries.

## 1. Experimental Status and Prerequisites

SPM itself is an established Apple dependency manager. The experimental part is
React Native's integration with it: native-module discovery, generated packages,
React binaries, code generation, and Xcode project setup.

These instructions target React Native 0.88's experimental SPM tooling.
Commands and generated project layouts can change between React Native releases.
Check the help from the version installed in your app before starting:

```sh
npx --no-install react-native spm --help
```

Before starting:

- Use a `react-native-theoplayer` version that includes its SPM manifest.
- Use a React Native version that provides the experimental SPM tooling.
- Use Xcode with Swift tools 6.1 or later and package trait selection in its
  Package Dependencies settings.
- Set the app's deployment target to iOS 16 or later, or tvOS 15.1 or later.
- For Apple TV, use `react-native-tvos` and matching tvOS React binaries.
  The standard iOS React binary is not a tvOS runtime.
- Check every other native React Native dependency for SPM support. THEOplayer's
  support does not automatically make the rest of the application compatible.
- Save a working CocoaPods baseline in version control before changing the native
  project, and keep a way to return to it.

The current manifest assumes a normal npm installation at
`<app>/node_modules/react-native-theoplayer` and RN's generated React package at
`<app>/ios/build/xcframeworks`. Linked source checkouts, hoisted dependencies, and
custom native directory layouts require separate validation.

## 2. Translate JSON Features to Xcode Traits

Use your existing CocoaPods feature list to choose the matching traits later:

| CocoaPods JSON flag | Xcode package trait |
| --- | --- |
| `GOOGLE_IMA` | `GoogleIMA` |
| `THEO_ADS` | `THEOads` |
| `MILLICAST` | `Millicast` |
| `SIDELOADED_TEXTTRACKS` | `SideloadedTextTracks` |
| `CHROMECAST` | `GoogleCast` |

Leave optional traits unselected for core playback and THEOlive only.
`GoogleIMA` and `THEOads` automatically enable the supporting `GoogleIMASDK`
trait; it does not need a separate selection.

SPM does not read `react-native-theoplayer.json` or `theoplayer-config.json`.
Keep the JSON if other CocoaPods builds or unrelated settings still use it;
otherwise it is no longer needed for Apple feature selection.

The same traits can be selected for iOS and tvOS. `GoogleCast` is excluded from
tvOS builds, and advertising uses the appropriate platform's IMA SDK.
SwiftPM may resolve additional packages without linking all of their products.

## 3. Why the Package Is Added Manually

React Native's experimental SPM autolinking does not currently provide the
trait-selection controls needed here. Add THEOplayer directly to the Xcode
project so its traits are configurable in Package Dependencies.

Disable autolinking for this library first: do not combine RN's generated alias
reference with a direct `node_modules` reference. They use different locations
for the same package, and the current manifest expects the direct npm location.

Use this one manual-reference setup for all SPM apps, including core-only apps,
until RN supports selecting package traits through autolinking.
No generated feature package or edits to the installed manifest are needed.

## 4. Migration Steps

Run the following commands from your application's root directory unless noted
otherwise.

### Step A: Prepare the App

Complete any required React Native upgrade, install the app's npm dependencies,
and confirm that its installed RN CLI exposes the SPM command.
Set the deployment targets before bootstrapping SPM.

Review the existing Podfile and native project for:

- THEOplayer pods and connectors added explicitly.
- Vendor SDKs such as Google IMA, Google Cast, or Millicast.
- Podfile overrides and post-install hooks.
- Other native libraries that still require CocoaPods.

Do not simply remove every pod or the workspace. The application's remaining
dependencies determine whether a full migration is possible.
Do not install the same THEOplayer or vendor framework through both dependency
managers.

### Step B: Disable THEOplayer Autolinking

Merge this into the app's `react-native.config.js`, preserving other dependency
configuration and project settings:

```js
module.exports = {
  dependencies: {
    'react-native-theoplayer': {
      platforms: {
        ios: null,
      },
    },
  },
};
```

Use this `ios` setting for iOS and tvOS apps. It opts out only THEOplayer, not
React itself or the app's other libraries.
Use this opt-out only for builds moving to SPM; builds that remain on CocoaPods
still need their normal autolinking.

If you used an earlier experimental `THEOplayerFeatures` setup, remove its
`swiftpmConfig.modules` registration and generated package. Preserve any
unrelated app-owned module registrations.

### Step C: Migrate the React Native Project

Follow the migration flow supported by your installed RN tooling. For React Native
0.88, migrate a CocoaPods-integrated project with:

```sh
npx --no-install react-native spm add --deintegrate
```

This command changes the native project. Its `--deintegrate` option invokes
`pod deintegrate` and removes RN integration lines from the Podfile, so CocoaPods
must still be installed for this migration step. Custom pods, Podfile hooks, and
third-party dependencies require their own migration review and, where necessary,
replacement with SPM-compatible dependencies.

Review the resulting project and Podfile changes before continuing.
If there are multiple Xcode projects or app targets, consult
`react-native spm --help` and specify the project and target explicitly.
Command options and generated layouts are RN-version-dependent.

Keep application-level setup such as licenses, app capabilities, resource
configuration, Cast receiver initialization, and local-network permissions.
Changing the dependency manager does not replace those settings.

### Step D: Sync and Add THEOplayer in Xcode

Once RN SPM bootstrap has completed, run:

```sh
npx --no-install react-native spm sync
```

This refreshes RN's code generation and the other libraries' autolinking.
It does not add THEOplayer to the app.

1. Open the `.xcodeproj` configured by RN's SPM tooling.
2. Select **Project > Package Dependencies > + > Add Local**.
3. Select `<app>/node_modules/react-native-theoplayer`.
   Do not select a folder under `ios/build/generated/autolinking/libs`.
4. Add the **react-native-theoplayer** library product to the **app target**,
   not **None**. This product includes the Swift implementation and Objective-C
   registration bridge; do not add their source files manually.
5. In the package entry's **Traits** dropdown, select the integrations from the
   [feature mapping](#2-translate-json-features-to-xcode-traits).

The usual relative location in the Xcode project is
`../node_modules/react-native-theoplayer`. Keep that reference when npm updates
the package's contents, and resolve packages again in Xcode.
SwiftPM adds the selected connectors and vendor SDKs automatically; do not add
separate dependencies for normal feature selection.

### Step E: Build and Test

Open the Xcode project configured by RN's SPM tooling, select the app scheme and
an appropriate simulator or device, then build and run.
For an app fully migrated away from CocoaPods, use its `.xcodeproj` rather than
assuming the old CocoaPods workspace remains the entry point.

Do not rerun `pod install` for a fully SPM-migrated app. If unrelated dependencies
still require CocoaPods, their coexistence needs a deliberate, separately
validated setup.

Check every selected integration, not just basic playback. On tvOS, verify that
Cast frameworks are absent even with the `GoogleCast` trait selected.
For Chromecast on iOS, retain the receiver setup and discovery permissions
described in the [casting guide](./cast.md#setup).

Change features through the same Traits dropdown and rebuild the native app.
Reloading JavaScript does not change native dependencies.
RN sync remains part of normal RN dependency maintenance, but there is no
THEOplayer feature-generation step.

## 5. Pinning Integration or Connector Versions

Feature selection and version selection are separate:

- Xcode package traits choose which features are enabled.
- An app-owned Swift package can constrain which compatible native versions are
  resolved.
- `Package.resolved` records the versions selected for the application.

Do not edit `react-native-theoplayer` under `node_modules` or patch RN's generated autolinking manifest.
Those files are not stable places for application policy.

### What Can Be Versioned Separately?

The native THEOplayer core and its integration products belong to the same
`theoplayer-sdk-apple` package. Pinning that package selects the shared release
for core and the enabled integrations; you cannot independently pin a different
THEOads or THEOlive release from that same package.

Connectors and vendor SDKs published as separate Swift packages can have their
own pins, provided the combined requirements remain compatible.

### Example: An App-Owned Version Package

This advanced, optional package is only needed when your app requires additional
version constraints. It is not part of normal feature selection.
Create these app-owned files:

```text
ios/AppNativeVersions/
  Package.swift
  Sources/
    AppNativeVersions/
      AppNativeVersions.swift
```

The following example pins the shared native THEOplayer release and the
sideloaded-subtitle connector. It assumes `SideloadedTextTracks` is selected in
Xcode. Omit the connector dependency and product if that feature is
not used; a version package should not introduce features you did not select.

The exact versions below are examples, not a list of current requirements or
recommended latest releases. Replace them with versions you have tested that
satisfy the constraints of your installed `react-native-theoplayer` version and other packages.

`ios/AppNativeVersions/Package.swift`:

```swift
// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "AppNativeVersions",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "AppNativeVersions",
            targets: ["AppNativeVersions"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
            exact: "11.15.1"
        ),
        .package(
            url: "https://github.com/THEOplayer/iOS-Connector",
            exact: "11.0.7"
        ),
    ],
    targets: [
        .target(
            name: "AppNativeVersions",
            dependencies: [
                .product(
                    name: "THEOplayerSDK",
                    package: "theoplayer-sdk-apple"
                ),
                .product(
                    name: "THEOplayerConnectorSideloadedSubtitle",
                    package: "ios-connector"
                ),
            ]
        ),
    ]
)
```

`ios/AppNativeVersions/Sources/AppNativeVersions/AppNativeVersions.swift`:

```swift
public enum AppNativeVersions {}
```

This source file keeps the library target nonempty.
The enum has no runtime purpose; version constraints belong in `Package.swift`.

The package must participate in the application's resolved dependency graph.
Merely saving a `Package.swift` beside the project is not enough.
Use Xcode's **Add Local** flow to add `ios/AppNativeVersions`, and add its
`AppNativeVersions` library product to the app target.
This is separate from the existing `react-native-theoplayer` reference.
No RN module registration or THEOplayer generator is involved.

Resolve packages and build in Xcode. SwiftPM combines requirements from
`react-native-theoplayer`, the version package, and other dependencies.
It uses one compatible version per package.

An exact pin narrows the allowed versions; it does not override an incompatible
requirement. If there is no compatible version, resolution fails. Choose a
compatible pin or update the dependency imposing the conflicting requirement,
rather than editing generated files.

To pin a separate vendor SDK, use the same pattern with its actual package URL
and product. Preserve any platform conditions: an iOS-only SDK such as Google
Cast must not gain an unconditional tvOS product dependency through your custom
package.

### Version Control and Updates

Commit `react-native.config.js`, `package.json`, the npm lockfile, reviewed Xcode
project changes (including package references, product links, and traits), and
the app's Xcode `Package.resolved`. Commit an app-owned version package only if used.
In a clean checkout or CI, install npm dependencies and restore or generate the
RN SPM packages and matching React binaries before building. There is no
THEOplayer selector to generate.

Changing a pin requires package resolution and testing again. Broadening an
allowed range does not automatically upgrade an already-compatible locked
version. Use Xcode's package update flow when you intentionally want to update,
and review the resulting `Package.resolved` change.

## 6. Migration Checklist

- The app uses RN tooling and native libraries compatible with experimental SPM.
- Deployment targets and React binaries match iOS or tvOS as appropriate.
- The app disables iOS autolinking only for `react-native-theoplayer`.
- Xcode directly references the normal npm folder and links its library product
  to the app target.
- The intended optional traits are selected; core and THEOlive need no extra trait.
- Any old generated feature package and its registration are removed.
- Optional custom pins live in an app-owned package added to Xcode.
- No THEOplayer or vendor framework is supplied twice by CocoaPods and SPM.
- App-level initialization and permissions are retained.
- Xcode Debug and Release builds, device builds, playback, and selected
  integrations are tested before considering the migration complete.
- Package resolution and the clean-checkout/CI RN setup are
  reproducible.
