#!/bin/bash

docker build ./adidas -t ruairispain/subscription-api
#docker build ./subscription -t ruairispain/subscription-service
#docker build ./email -t ruairispain/email-service
docker images ls

docker run -p 3000:3000 --env-file .env -d ruairispain/subscription-api

cat ~/docker_hub_password.txt | docker login --username ruairispain --password-stdin

docker push ruairispain/subscription-api
#docker push ruairispain/subscription-service
#docker push ruairispain/email-service