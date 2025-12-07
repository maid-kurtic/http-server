#!/bin/bash

# Check if a container named 'http' is running
if [ $(docker ps -q -f name=http) ]; then
    echo "Stopping container..."
    docker stop http
    echo "Container stopped."
else
    echo "No container named 'http' is running."
fi
