#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "           🔄 REFRESHING LOCAL DEV SERVER"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Kill any existing processes on port 5173
echo "1️⃣  Checking for existing processes on port 5173..."
PROCESS=$(lsof -ti:5173)
if [ ! -z "$PROCESS" ]; then
  echo "   → Killing process: $PROCESS"
  kill -9 $PROCESS
  sleep 2
else
  echo "   → No process found on port 5173"
fi

# Clean Vite cache
echo ""
echo "2️⃣  Cleaning Vite cache..."
rm -rf node_modules/.vite
rm -rf dist
echo "   → Cache cleared ✅"

# Check if node_modules exists
echo ""
echo "3️⃣  Checking node_modules..."
if [ ! -d "node_modules" ]; then
  echo "   → node_modules not found, installing..."
  npm install
else
  echo "   → node_modules found ✅"
fi

# Start dev server
echo ""
echo "4️⃣  Starting development server..."
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "   Server starting... Please wait..."
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📱 AFTER SERVER STARTS:"
echo "   1. Open: http://localhost:5173/wildtours"
echo "   2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo "   3. Or open in Incognito/Private window"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

npm run dev
