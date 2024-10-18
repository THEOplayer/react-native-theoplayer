#!/bin/bash

FILE='../react-native-theoplayer.podspec'

if [[ ! -f $FILE ]]; then
  echo "File not found!"
  exit 1
fi

# Replace '/../..' with '.' to find the file react-native-theoplayer.json
if [[ "$OSTYPE" == "darwin"* ]]; then
  # For macOS, use sed with an empty backup extension
  sed -i '' 's|\.\./\.\.|e2e|g' "$FILE"
else
  # For Linux/Ubuntu, no backup extension is required
  sed -i 's|\.\./\.\.|e2e|g' "$FILE"
fi

echo "Replacement done in $FILE"
