require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
theoconfigpath = File.join(__dir__ + "/../../", "react-native-theoplayer.json")
if File.exists?(theoconfigpath) 
  theoconfig = JSON.parse(File.read(theoconfigpath))
  theofeatures = theoconfig["ios"]["features"]
else
  theofeatures = []
end

Pod::Spec.new do |s|
  s.name         = "react-native-theoplayer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  
  s.platforms    = { :ios => "12.0", :tvos => "12.0" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }
  
  s.source_files = 'ios/*.{h,m,swift}', 'ios/ads/*.swift', 'ios/casting/*.swift', 'ios/contentprotection/*.swift', 'ios/pip/*.swift', 'ios/backgroundAudio/*.swift'
  s.resources = ['ios/*.css']
  
  # ReactNative Dependency
  s.dependency "React-Core"
  
  # THEOplayer Dependencies
  if theofeatures.include?("WEB") 
    s.dependency "THEOplayerSDK-basic"
    s.pod_target_xcconfig = {
      'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => theofeatures.join(' '),
      'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => theofeatures.join(' ')
    }
  else 
    s.dependency "THEOplayerSDK-core"
    if theofeatures.include?("GOOGLE_IMA") 
      s.dependency "THEOplayerGoogleIMAIntegration"
      s.ios.dependency "GoogleAds-IMA-iOS-SDK", "3.18.4"
      s.tvos.dependency "GoogleAds-IMA-tvOS-SDK", "4.8.2"
    end
    if theofeatures.include?("CHROMECAST")
      s.ios.dependency "THEOplayerGoogleCastIntegration"
      s.ios.dependency "google-cast-sdk-dynamic-xcframework-no-bluetooth"
    end
  end
  
end
