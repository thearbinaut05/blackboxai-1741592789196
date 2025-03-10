#!/bin/bash

# Start DeFi trading agent
echo "Starting DeFi trading agent..."
node scripts/defi-agent.js &
DEFI_PID=$!

# Start mining optimizer
echo "Starting mining optimizer..."
node scripts/miner.js &
MINER_PID=$!

# Start web server
echo "Starting web server..."
cd public && python3 -m http.server 8000 &
SERVER_PID=$!

# Handle shutdown
trap 'kill $DEFI_PID $MINER_PID $SERVER_PID; exit' INT TERM

# Keep script running and monitor processes
while true; do
    if ! ps -p $DEFI_PID > /dev/null; then
        echo "DeFi agent crashed, restarting..."
        node scripts/defi-agent.js &
        DEFI_PID=$!
    fi
    if ! ps -p $MINER_PID > /dev/null; then
        echo "Mining optimizer crashed, restarting..."
        node scripts/miner.js &
        MINER_PID=$!
    fi
    sleep 5
done
