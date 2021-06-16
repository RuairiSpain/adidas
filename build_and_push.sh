#!/bin/bash

docker build ./adidas -t ruairispain/subscription-api
api_version=$(./bump_$1.sh subscription-api)
docker build ./subscription -t ruairispain/subscription-service
subscription_version=$(./bump_$1.sh subscription-service)
docker build ./email -t ruairispain/email-service
email_version=$(./bump_$1.sh email-service)

docker images ls

docker run -p 3000:3000 --env-file .env -d ruairispain/subscription-api

cat ~/docker_hub_password.txt | docker login --username ruairispain --password-stdin

docker push ruairispain/subscription-api:$api_version
docker push ruairispain/subscription-service:$subscription_version
docker push ruairispain/email-service:$email_version