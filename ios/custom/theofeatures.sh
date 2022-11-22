#!/bin/bash
platform=$1
framework_path=$2
infoplist_path="${framework_path}THEOplayerSDK.xcframework/${platform}-arm64/THEOplayerSDK.framework/Info.plist"
all_features=""

info=$(/usr/libexec/PlistBuddy -c "Print :\"THEOplayer build information\":Features" "${infoplist_path}")
IFS=',' read -ra arrInfo <<< "$info"
for i in "${arrInfo[@]}"; do
	feature=$(echo $i | tr '[:lower:]' '[:upper:]' | tr '-' '_')
 	all_features="${all_features} ${feature}"
done

echo "$all_features"