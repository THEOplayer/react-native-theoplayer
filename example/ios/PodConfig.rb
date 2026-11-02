def google_cast_redirect
  pod 'react-native-google-cast', :git => 'https://github.com/Danesz/react-native-google-cast.git', branch: 'feature/guestmode_apple_silicon'
end

def resource_bundle_post_install(installer)
  # React Native does not raise the iOS 9.0 target of Google Cast's PromisesObjC privacy bundle.
  installer.pods_project.targets.each do |target|
    next unless target.name == 'PromisesObjC-FBLPromises_Privacy'

    target.build_configurations.each do |build_configuration|
      build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios_version_supported
    end
  end
end
