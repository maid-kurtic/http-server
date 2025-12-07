#!/bin/bash


if [ $(docker ps -aq -f name=http) ]; then

    docker rm -f http
fi


docker run -d \
    --name http \
    --network=host \
    -e DB_NAME=myusers_db \
    -e DB_USER=maid \
    -e DB_PASSWORD=mk2908002 \
    793523315841.dkr.ecr.us-east-1.amazonaws.com/http-server-server:latest

echo "Container is started."

