// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "ReactNativeTHEOplayer",
    platforms: [.iOS("16.0")],
	products: [
	    .library(
	        name: "ReactNativeTHEOplayer",
	        targets: [
	            "ReactNativeTHEOplayer",
	            "ReactNativeTHEOplayerBridge"
	        ]
	    ),
	],
	traits: [
	    .trait(
	        name: "GoogleIMA",
	        description: "Enable Google IMA advertising support",
	        enabledTraits: ["GoogleIMASDK"]
	    ),
	    .trait(
	        name: "THEOads",
	        description: "Enable THEOads advertising support",
	        enabledTraits: ["GoogleIMASDK"]
	    ),
	    .trait(
	        name: "Millicast",
	        description: "Enable Millicast streaming support"
	    ),
	    .trait(
	        name: "SideloadedTextTracks",
	        description: "Enable sideloaded subtitle support"
	    ),
	    .trait(
	        name: "GoogleCast",
	        description: "Enable Chromecast support"
	    ),
	    .trait(
	        name: "GoogleIMASDK",
	        description: "Include the Google IMA SDK shared by advertising integrations"
	    ),
	],
	dependencies: [
	    .package(
	        url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
	        .upToNextMajor(from: "11.14.0")
	    ),
		.package(
		    url: "https://github.com/googleads/swift-package-manager-google-interactive-media-ads-ios",
		    .upToNextMajor(from: "3.31.0")
		),
		.package(
		    url: "https://github.com/millicast/millicast-sdk-swift-package",
		    .upToNextMinor(from: "2.7.0")
		),
		.package(
		    url: "https://github.com/THEOplayer/iOS-Connector",
		    .upToNextMajor(from: "11.0.2")
		),
		.package(
		    url: "https://github.com/googlecast/google-cast-ios-sdk",
		    .upToNextMajor(from: "4.8.0")
		),
		.package(
		    name: "ReactNative",
		    path: "../../../../xcframeworks"
		),
	],
	targets: [
	    .target(
	        name: "ReactNativeTHEOplayerBridge",
	        dependencies: [
	            .product(name: "ReactHeaders", package: "ReactNative"),
	            .product(name: "ReactNativeHeaders", package: "ReactNative"),
	            .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
	        ],
	        path: "ios",
	        sources: ["THEOplayerRCTBridge.m"],
	        publicHeadersPath: "spm/include",
	        cSettings: [
	            .define("RCT_NEW_ARCH_ENABLED", to: "1"),
	        ]
	    ),
		.target(
		    name: "ReactNativeTHEOplayer",
		    dependencies: [
		        .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
		        .product(name: "THEOplayerTHEOliveIntegration", package: "theoplayer-sdk-apple"),
				.product(name: "THEOplayerGoogleIMAIntegration", package: "theoplayer-sdk-apple", condition: .when(traits: ["GoogleIMA"])),
				.product(name: "THEOplayerTHEOadsIntegration", package: "theoplayer-sdk-apple", condition: .when(traits: ["THEOads"])),
				.product(name: "THEOplayerMillicastIntegration", package: "theoplayer-sdk-apple", condition: .when(traits: ["Millicast"])),
				.product(name: "GoogleInteractiveMediaAds", package: "swift-package-manager-google-interactive-media-ads-ios", condition: .when(traits: ["GoogleIMASDK"])),
				.product(name: "MillicastSDK", package: "millicast-sdk-swift-package", condition: .when(traits: ["Millicast"])),
				.product(name: "THEOplayerConnectorSideloadedSubtitle", package: "ios-connector", condition: .when(traits: ["SideloadedTextTracks"])),
				.product(name: "THEOplayerGoogleCastIntegration", package: "theoplayer-sdk-apple", condition: .when(platforms: [.iOS], traits: ["GoogleCast"])),
				.product(name: "GoogleCastDynamic", package: "google-cast-ios-sdk", condition: .when(platforms: [.iOS], traits: ["GoogleCast"])),
		        .product(name: "ReactHeaders", package: "ReactNative"),
		        .product(name: "ReactNativeHeaders", package: "ReactNative"),
		        .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
		    ],
		    path: "ios",
		    exclude: [
		        "THEOplayerRCTBridge.m",
		        "Theoplayer-Bridging-Header.h",
		        "Theoplayer.xcodeproj",
		        "theofeatures.sh",
		        "spm",
		    ],
		    resources: [
		        .copy("style.css"),
		    ],
		    swiftSettings: [
		        .swiftLanguageMode(.v5),
		    ]
		),
	],
)