#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Installing Launch Daemon for bun run hwir...${NC}"
echo "This requires sudo privileges."
echo ""

# Create logs directory
mkdir -p logs

# Copy plist to LaunchDaemons directory
sudo cp com.mikecann.effect-sim.hwir.plist /Library/LaunchDaemons/
sudo chown root:wheel /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist

# Unload if already loaded
sudo launchctl unload /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist 2>/dev/null

# Load the launch daemon
sudo launchctl load /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist

echo ""
echo -e "${GREEN}✓ Launch Daemon installed and started!${NC}"
echo ""
echo "The command will now run automatically when your Mac starts up (even without login)."
echo ""
echo "Useful commands:"
echo "  Check status:  sudo launchctl list | grep hwir"
echo "  Stop service:  sudo launchctl unload /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist"
echo "  Start service: sudo launchctl load /Library/LaunchDaemons/com.mikecann.effect-sim.hwir.plist"
echo "  View logs:     tail -f logs/hwir.log"
echo "  View errors:   tail -f logs/hwir.error.log"
echo ""
echo "Or use the check script: ./check-hwir-status.sh"
