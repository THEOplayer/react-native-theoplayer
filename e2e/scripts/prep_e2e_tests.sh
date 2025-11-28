#!/bin/sh
cd ..

echo "##### clear old screenshots #####"
rm -rf ./screenshots/*.*

echo "##### npm i #####"
echo clearing node_modules ...
rm -rf node_modules
echo npm i ...
npm i

echo "##### pods update #####"
cd ios
echo clearing pods ...
pod deintegrate
echo pod update ...
pod update --no-repo-update
cd ..

echo "##### prep index.ts #####"
mv -v index.js index_old.js
mv -v index.test.js index.js

echo "##### PREP done #####"
