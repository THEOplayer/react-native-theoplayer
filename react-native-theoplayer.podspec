require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
theoconfigpath = File.join(__dir__ + "/../../", "react-native-theoplayer.json")
if File.exist?(theoconfigpath) 
  theoconfig = JSON.parse(File.read(theoconfigpath))
  theofeatures = theoconfig["ios"]["features"]
else
  theofeatures = ["NONE"]
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
  	puts "Using THEOplayer-basic SDK, marked features: #{theofeatures.join(' ')}"
    s.dependency "THEOplayerSDK-basic"
    s.pod_target_xcconfig = {
      'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Release]' => theofeatures.join(' '),
      'SWIFT_ACTIVE_COMPILATION_CONDITIONS[config=Debug]' => theofeatures.join(' ')
    }
  else 
  	puts "Using THEOplayer-core SDK"
    s.dependency "THEOplayerSDK-core", "~> 5.9"
    if theofeatures.include?("GOOGLE_IMA") 
	  puts "Adding THEOplayer-Integration-GoogleIMA"
      s.dependency "THEOplayer-Integration-GoogleIMA"
    end
    if theofeatures.include?("CHROMECAST")
	  puts "Adding THEOplayer-Integration-GoogleCast"
      s.ios.dependency "THEOplayer-Integration-GoogleCast"
    end
    if theofeatures.include?("SIDELOADED_TEXTTRACKS") 
	  puts "Adding THEOplayer-Connector-SideloadedSubtitle"
      s.dependency "THEOplayer-Connector-SideloadedSubtitle"
    end
  end
  
end
