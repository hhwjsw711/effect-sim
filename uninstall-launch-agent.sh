#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Uninstalling Launch Daemon...${NC}"
echo "This requires sudo privileges."
echo ""

# Unload the launch daemon
sudo launchctl unload /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist 2>/dev/null

# Remove plist file
sudo rm /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist

echo -e "${GREEN}✓ Launch Daemon uninstalled!${NC}"
echo "The service will no longer run at startup."
