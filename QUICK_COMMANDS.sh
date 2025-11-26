#!/bin/bash

# Wild Tours - Quick Commands Script
# Run these commands to fix and start your Wild Tours page

echo "================================"
echo "Wild Tours Quick Setup"
echo "================================"
echo ""

echo "📋 Available Commands:"
echo ""
echo "1. npm run dev          - Start development server"
echo "2. npm install          - Install dependencies"
echo "3. npx tsx scripts/seedWildToursData.ts  - Seed Firebase data"
echo ""
echo "Choose what to do:"
echo ""
read -p "Enter command number (1-3): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting development server..."
    npm run dev
    ;;
  2)
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo ""
    echo "✅ Done! Now run: npm run dev"
    ;;
  3)
    echo ""
    echo "⚠️  Make sure you've updated Firestore rules first!"
    echo "See FIX_NOW.md for instructions"
    echo ""
    read -p "Have you updated Firestore rules? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
      echo ""
      echo "🌱 Seeding Wild Tours data..."
      npx tsx scripts/seedWildToursData.ts
    else
      echo ""
      echo "❌ Please update Firestore rules first (see FIX_NOW.md Step 1)"
    fi
    ;;
  *)
    echo "Invalid choice. Please run again and choose 1, 2, or 3."
    ;;
esac

echo ""
echo "================================"
echo "Need help? Check these files:"
echo "- FIX_NOW.md (start here!)"
echo "- TROUBLESHOOTING_GUIDE.md"
echo "- WILD_TOURS_QUICKSTART.md"
echo "================================"
