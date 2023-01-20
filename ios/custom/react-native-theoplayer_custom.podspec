require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

### Collect player feature flags
theo_features_ios = `sh ./ios/custom/theofeatures.sh ios ./ios/custom/Frameworks/ios/`
theo_features_tvos = `sh ./ios/custom/theofeatures.sh tvos ./ios/custom/Frameworks/tvos/`

Pod::Spec.new do |s|
	s.name         = "react-native-theoplayer"
  	s.version      = package["version"]
  	s.summary      = package["description"]
  	s.homepage     = package["homepage"]
  	s.license      = package["license"]
  	s.authors      = package["author"]

  	s.platforms    = { :ios => "12.0", :tvos => "12.0" }
  	s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }

  	s.source_files = "ios/*.{h,m,mm,swift}"
  	s.resources = ['ios/*.css']

  	s.dependency "React-Core"

	### Setup feature flags as compiler directives
  	s.ios.pod_target_xcconfig = {
  		'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => "#{theo_features_ios}",
  		'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => "DEBUG #{theo_features_ios}"
	}
  	s.tvos.pod_target_xcconfig = {
  		'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => "#{theo_features_tvos}",
  		'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => "DEBUG #{theo_features_tvos}"
	}

 	### Set custom player SDK
	s.ios.vendored_frameworks = 'ios/custom/Frameworks/ios/THEOplayerSDK.xcframework'
  	s.tvos.vendored_frameworks = 'ios/custom/Frameworks/tvos/THEOplayerSDK.xcframework'

  	### Set Ads dependencies
  	s.ios.dependency "GoogleAds-IMA-iOS-SDK", "3.14.1"
	s.tvos.dependency "GoogleAds-IMA-tvOS-SDK", "4.4.1"
	
	### Set ChromeCast dependency (iOS only)
	s.ios.dependency "google-cast-sdk-dynamic-xcframework-no-bluetooth"
	
end