#!/bin/sh
echo "Updating..."
set -x

apk add git
git reset --hard
git checkout master
git pull

rm -rf node_modules
npm install