#!/bin/sh

echo "##### run ios tests #####"
cd ..
echo npx cavynext run-ios ...
npx cavynext run-ios --terminal bash --scheme ReactNativeTHEOplayer --simulator "iPhone 16" > ./scripts/ios_output.txt 2>&1

echo results:
grep -E "^[0-9]+\)" ./scripts/ios_output.txt

echo "##### RUN done #####"
