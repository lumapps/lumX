#!/bin/bash

docker run --rm -it -p 8888:8888 -v "$PWD:/app" volnt/appengine ./launch.sh
