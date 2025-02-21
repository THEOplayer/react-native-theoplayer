def nielsen_source
  source 'https://github.com/NielsenDigitalSDK/nielsenappsdk-ios-specs-dynamic.git'
end

def google_cast_redirect
  pod 'react-native-google-cast', :git => 'https://github.com/Danesz/react-native-google-cast.git', branch: 'feature/guestmode_apple_silicon'
end

def include_slider
  pod 'react-native-slider', :path => '../node_modules/@react-native-community/slider'
end

def nielsen_post_install(installer, targetName)
  # modify XCFramework configuration files to update NielsenAppApi.framework -> NielsenTVAppApi.framework
  installer.pods_project.targets.each do |target|
    if target.name == targetName
      target.build_configurations.each do |config|
        xcconfig_path = config.base_configuration_reference.real_path
        puts "post_install: Found #{File.basename(xcconfig_path)}"
        xcconfig = File.read(xcconfig_path)
        new_xcconfig = xcconfig.sub('-framework "NielsenAppApi"', '-framework "NielsenTVAppApi"')
        File.open(xcconfig_path, "w") { |file| file << new_xcconfig }
        puts "post_install: Updated #{File.basename(xcconfig_path)} file with a value: NielsenTVAppApi.framework"
      end
      # update Pods-ReactNativeTHEOplayer-tvOS-frameworks.sh file
      frameworksh_path = "Pods/Target Support Files/#{target.name}/#{target.name}-frameworks.sh"
      if File.exist?(frameworksh_path)
        puts "post_install: Found #{File.basename(frameworksh_path)}"
        text = File.read(frameworksh_path)
        new_contents = text.gsub('NielsenAppApi.framework', 'NielsenTVAppApi.framework')
        File.open(frameworksh_path, "w") {|file| file.puts new_contents}
        puts "post_install: Updated #{File.basename(frameworksh_path)} file with a value: NielsenTVAppApi.framework"
      end
    end
  end
end
