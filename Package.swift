// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "ReactNativeTHEOplayer",
    platforms: [.iOS("15.1")],
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
	        description: "Enable Google IMA advertising support"
	    ),
	],
	dependencies: [
	    .package(
	        url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
	        .upToNextMajor(from: "11.14.0")
	    ),
		.package(
		    url: "https://github.com/googleads/swift-package-manager-google-interactive-media-ads-ios",
		    exact: "3.33.0"
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
				.product(name: "THEOplayerGoogleIMAIntegration", package: "theoplayer-sdk-apple", condition: .when(traits: ["GoogleIMA"])),
				.product(name: "GoogleInteractiveMediaAds", package: "swift-package-manager-google-interactive-media-ads-ios", condition: .when(traits: ["GoogleIMA"])),
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