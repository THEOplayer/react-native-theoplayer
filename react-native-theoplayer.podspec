require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

theofeatures = []
theoconfigfiles = ["theoplayer-config.json", "react-native-theoplayer.json"]
theoconfigfiles.each do |configfile|
  configpath = File.join(__dir__ + "/../../", configfile)
  if File.exist?(configpath) 
    puts "THEOplayer config found: #{configfile}"
    theoconfig = JSON.parse(File.read(configpath))
    theofeatures = theoconfig["ios"]["features"]
  end
  break if theofeatures.length() > 0 
end

Pod::Spec.new do |s|
  s.name         = "react-native-theoplayer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  
  s.platforms    = { :ios => "13.0", :tvos => "13.0" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }
  
  s.source_files = 'ios/*.{h,m,swift}', 'ios/ads/*.swift', 'ios/casting/*.swift', 'ios/contentprotection/*.swift', 'ios/pip/*.swift', 'ios/backgroundAudio/*.swift', 'ios/cache/*.swift', 'ios/sideloadedMetadata/*.swift', 'ios/eventBroadcasting/*.swift' , 'ios/ui/*.swift', 'ios/presentationMode/*.swift'
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
    s.dependency "THEOplayerSDK-core", "~> 6.11", "!= 6.12.0"
    if theofeatures.include?("GOOGLE_IMA") 
	  puts "Adding THEOplayer-Integration-GoogleIMA"
      s.dependency "THEOplayer-Integration-GoogleIMA/Base", "~> 6.11", "!= 6.12.0"
	  s.dependency "THEOplayer-Integration-GoogleIMA/Dependencies", "~> 6.11", "!= 6.12.0"
    end
    if theofeatures.include?("CHROMECAST")
	  puts "Adding THEOplayer-Integration-GoogleCast"
      s.ios.dependency "THEOplayer-Integration-GoogleCast/Base", "~> 6.11", "!= 6.12.0"
	  s.ios.dependency "google-cast-sdk-dynamic-xcframework", "~> 4.8"
    end
    if theofeatures.include?("SIDELOADED_TEXTTRACKS") 
	  puts "Adding THEOplayer-Connector-SideloadedSubtitle"
      s.dependency "THEOplayer-Connector-SideloadedSubtitle", "~> 6.11", "!= 6.12.0"
    end
  end
  
end
