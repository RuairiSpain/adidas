#!/bin/bash
version=$(docker images ruairispain/$1 --format "{{.Tag}}"| tail -n 2 | head -n 1 |  awk -F. '{$(NF-1) = $(NF-1) + 1;} 1' | sed 's/ /./g')
echo $version
docker tag ruairispain/$1:latest ruairispain/$1:$version

# docker images ruairispain/$1