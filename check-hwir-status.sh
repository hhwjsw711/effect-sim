#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== HWIR Service Status ===${NC}"
echo ""

# Check if service is loaded
SERVICE_INFO=$(sudo launchctl list | grep hwir)

if [ -z "$SERVICE_INFO" ]; then
    echo -e "${RED}✗ Service is NOT running${NC}"
    echo ""
    echo "To start the service, run: ./install-launch-agent.sh"
    exit 1
else
    PID=$(echo $SERVICE_INFO | awk '{print $1}')
    STATUS_CODE=$(echo $SERVICE_INFO | awk '{print $2}')
    
    if [ "$PID" = "-" ]; then
        echo -e "${RED}✗ Service is loaded but NOT running${NC}"
        echo -e "  Status Code: ${STATUS_CODE}"
        echo ""
        echo "Check error logs: tail -f logs/hwir.error.log"
    else
        echo -e "${GREEN}✓ Service is running${NC}"
        echo -e "  PID: ${PID}"
        echo -e "  Status Code: ${STATUS_CODE}"
        echo ""
        echo "Recent logs:"
        echo -e "${YELLOW}--- stdout ---${NC}"
        tail -n 10 logs/hwir.log 2>/dev/null || echo "No logs yet"
        echo ""
        echo -e "${YELLOW}--- stderr ---${NC}"
        tail -n 10 logs/hwir.error.log 2>/dev/null || echo "No errors"
    fi
fi

echo ""
echo "Full service info:"
sudo launchctl list | grep hwir
