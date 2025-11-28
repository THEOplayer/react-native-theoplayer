#!/bin/sh

echo "##### reset index.ts #####"
cd ..
mv -v index.js index.test.js
mv -v index_old.js index.js

echo "##### RESET done #####"
