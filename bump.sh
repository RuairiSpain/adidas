#!/bin/bash
version=$(docker images ruairispain/subscription-api --format "{{.Tag}}"| tail -n 2 | head -n 1 |  awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
echo $version
docker tag ruairispain/subscription-api:latest ruairispain/subscription-api:$version

docker images ruairispain/subscription-api