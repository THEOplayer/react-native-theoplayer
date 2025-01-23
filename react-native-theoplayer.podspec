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

new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
puts "New architecture is enabled: " + new_arch_enabled.to_s

Pod::Spec.new do |s|
  s.name         = "react-native-theoplayer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  
  s.platforms    = { :ios => "13.4", :tvos => "13.4" }
  s.source       = { :git => "https://www.theoplayer.com/.git", :tag => "#{s.version}" }
  
  if new_arch_enabled
    s.source_files = 'ios/bridge/**/*.swift', 'ios/bridging_newarch/*.{m,mm,swift}', 'ios/newarch/**/*.{m,mm,cpp,swift}'
  else
    s.source_files = 'ios/bridge/**/*.swift', 'ios/bridging_oldarch/*.{m,swift}', 'ios/Theoplayer-Bridging-Header.h'
  end
  
  if respond_to?(:install_modules_dependencies, true)
    # ReactNative Dependencies for RN >= 0.71 )
    install_modules_dependencies(s)
    s.pod_target_xcconfig = {
      "DEFINES_MODULE" => "YES",
      "HEADER_SEARCH_PATHS" => "\"${PODS_ROOT}/Headers/Private/Yoga\""
    }
  else
    # ReactNative Dependencies for RN < 0.71 )
    s.dependency "React-Core"
    
    # Don't install the dependencies when we run `pod install` in the old architecture.
    if new_arch_enabled
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      }
      s.dependency "React-RCTFabric"
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end
  
  # THEOplayer Dependency
  puts "Adding THEOplayerSDK-core"
  s.dependency "THEOplayerSDK-core", "~> 8.11"
  
  # THEOlive Dependency
  puts "Adding THEOplayer-Integration-THEOlive"
  s.dependency "THEOplayer-Integration-THEOlive", "~> 8.11"

  # Feature based dependencies
  if theofeatures.include?("GOOGLE_IMA")
	puts "Adding THEOplayer-Integration-GoogleIMA"
    s.dependency "THEOplayer-Integration-GoogleIMA", "~> 8.11"
  end
  
  if theofeatures.include?("CHROMECAST")
	puts "Adding THEOplayer-Integration-GoogleCast"
    s.ios.dependency "THEOplayer-Integration-GoogleCast", "~> 8.11"
  end

  if theofeatures.include?("THEO_ADS")
	puts "Adding THEOplayer-Integration-THEOads"
    s.ios.dependency "THEOplayer-Integration-THEOads", "~> 8.11"
  end

  if theofeatures.include?("SIDELOADED_TEXTTRACKS")
	puts "Adding THEOplayer-Connector-SideloadedSubtitle"
    s.dependency "THEOplayer-Connector-SideloadedSubtitle", "~> 8.11"
  end
  
end
