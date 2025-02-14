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

  s.platforms    = { :ios => "13.4", :tvos => "13.4" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }

  s.source_files = 'ios/*.{h,m,swift}', 'ios/ads/*.swift', 'ios/casting/*.swift', 'ios/contentprotection/*.swift', 'ios/pip/*.swift', 'ios/backgroundAudio/*.swift', 'ios/cache/*.swift', 'ios/sideloadedMetadata/*.swift', 'ios/eventBroadcasting/*.swift' , 'ios/ui/*.swift', 'ios/presentationMode/*.swift', 'ios/viewController/*.swift', 'ios/theolive/*.swift', 'ios/theoAds/*.swift'
  s.resources = ['ios/*.css']

  # ReactNative Dependency
  s.dependency "React-Core"

  # THEOplayer Dependency
  puts "Adding THEOplayerSDK-core"
  s.dependency "THEOplayerSDK-core", "~> 8.6"
  
  # THEOlive Dependency
  puts "Adding THEOplayer-Integration-THEOlive"
  s.dependency "THEOplayer-Integration-THEOlive", "~> 8.6", ">= 8.6.3"

  # Feature based dependencies
  if theofeatures.include?("GOOGLE_IMA")
	puts "Adding THEOplayer-Integration-GoogleIMA"
    s.dependency "THEOplayer-Integration-GoogleIMA", "~> 8.6"
  end

  if theofeatures.include?("CHROMECAST")
	puts "Adding THEOplayer-Integration-GoogleCast"
    s.ios.dependency "THEOplayer-Integration-GoogleCast", "~> 8.6"
  end

  if theofeatures.include?("THEO_ADS")
	puts "Adding THEOplayer-Integration-THEOads"
    s.ios.dependency "THEOplayer-Integration-THEOads", "~> 8.6"
  end

  if theofeatures.include?("SIDELOADED_TEXTTRACKS")
	puts "Adding THEOplayer-Connector-SideloadedSubtitle"
    s.dependency "THEOplayer-Connector-SideloadedSubtitle", "~> 8.6"
  end

end
