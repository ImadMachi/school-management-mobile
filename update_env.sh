#!/bin/bash

# Get the IP address of the wlo1 interface
ip_address=$(ip addr show wlo1 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

# Update the .env file with the IP address
sed -i "s#^EXPO_PUBLIC_BASE_URL=.*#EXPO_PUBLIC_BASE_URL=http://$ip_address:8000#" .env