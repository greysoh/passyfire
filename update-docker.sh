#!/bin/sh
echo "Updating..."
set -x

apk add git
git reset --hard
git checkout master

# Stash local changes anyways
git add * 
git stash
git pull

rm -rf node_modules
npm install