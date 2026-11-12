// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "ReactNativeTHEOplayer",
    platforms: [.iOS("15.1")],
	products: [],
	dependencies: [
	    .package(
	        url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
	        .upToNextMajor(from: "11.14.0")
	    ),
		.package(
		    name: "ReactNative",
		    path: "../../../../xcframeworks"
		),
	],
	targets: []
)