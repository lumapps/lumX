#!/bin/bash

set -x

if [ -z "$release_version" ] && [ -n "$1" ]; then
    release_version="$1"
fi

if [ -z "$release_version" ]; then
    exit -1
fi

if [[ ! $release_version == v* ]]; then
    release_version="v${release_version}"
fi

npm install
if [ $? != 0 ]; then
    echo "Error during npm install"
    exit -2
fi

gulp clean
rm -rf libs

bower install --allow-root
if [ $? != 0 ]; then
    echo "Error during bower install"
    exit -3
fi

gulp build
if [ $? != 0 ]; then
    echo "Error during gulp build"
    exit -4
fi

gulp dist --version "$release_version"
if [ $? != 0 ]; then
    echo "Error during gulp dist"
    exit -5
fi

if [ -n "$release_version" ]; then
    chmod +x release.py
    ./release.py "$release_version"

    if [ $? != 0 ]; then
        exit -6
    fi
fi

gulp demo
if [ $? != 0 ]; then
    echo "Error during gulp demo"
    exit -7
fi