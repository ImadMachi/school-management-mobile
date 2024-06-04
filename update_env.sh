  #!/bin/bash

  # Check if wlo1 exists, otherwise use wlp0s20f3
  if ip link show wlo1 &> /dev/null; then
    interface="wlo1"
  elif ip link show wlp0s20f3 &> /dev/null; then
    interface="wlp0s20f3"
  else
    echo "Neither wlo1 nor wlp0s20f3 found."
    exit 1
  fi

  # Get the IP address of the selected interface
  ip_address=$(ip addr show $interface | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

  # Update the .env file with the IP address
  sed -i "s#^EXPO_PUBLIC_BASE_URL=.*#EXPO_PUBLIC_BASE_URL=http://$ip_address:8000#" .env
