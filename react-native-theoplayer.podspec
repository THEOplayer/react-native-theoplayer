require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

theo_features_ios = `sh ./ios/theofeatures.sh ios ../../ios/TheoSDK/Frameworks/ios/`
theo_features_tvos = `sh ./ios/theofeatures.sh tvos ../../ios/TheoSDK/Frameworks/tvos/`

Pod::Spec.new do |s|
  s.name         = "react-native-theoplayer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0", :tvos => "12.0" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }

  s.source_files = 'ios/*.{h,m,swift}', 'ios/ads/*.swift', 'ios/casting/*.swift', 'ios/contentprotection/*.swift', 'ios/pip/*.swift', 'ios/backgroundAudio/*.swift'
  s.resources = ['ios/*.css']

  s.dependency "React-Core"
  s.dependency "THEOplayerSDK-basic"
  
  s.ios.pod_target_xcconfig = {
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => "#{theo_features_ios}",
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => "DEBUG #{theo_features_ios}"
  }
  s.tvos.pod_target_xcconfig = {
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => "#{theo_features_tvos}",
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => "DEBUG #{theo_features_tvos}"
  }

end
