#!/bin/bash

# Luxury Experiences Setup Script
# This script helps you set up Firebase Admin SDK for seeding data

echo "════════════════════════════════════════════════════════"
echo "  Luxury Experiences - Admin SDK Setup"
echo "════════════════════════════════════════════════════════"
echo ""

# Check if firebase-admin is installed
if ! npm list firebase-admin &> /dev/null; then
    echo "📦 firebase-admin not found. Installing..."
    npm install firebase-admin
    echo "✅ firebase-admin installed"
else
    echo "✅ firebase-admin already installed"
fi

echo ""
echo "📄 Checking for service account key..."
echo ""

if [ -f "scripts/firebase-admin-key.json" ]; then
    echo "✅ Service account key found!"
    echo ""
    echo "🎯 You're ready to seed data!"
    echo ""
    echo "Run: npx tsx scripts/seed-with-admin.ts"
    echo ""
else
    echo "❌ Service account key not found"
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "  SETUP INSTRUCTIONS"
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "1. Open Firebase Console:"
    echo "   https://console.firebase.google.com/project/recharge-travels-73e76/settings/serviceaccounts"
    echo ""
    echo "2. Click 'Generate new private key'"
    echo ""
    echo "3. Save the downloaded JSON file as:"
    echo "   ./scripts/firebase-admin-key.json"
    echo ""
    echo "4. Run this script again:"
    echo "   ./scripts/setup-admin-seed.sh"
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "⚠️  SECURITY NOTE:"
    echo "   The service account key is already in .gitignore"
    echo "   NEVER commit this file to version control!"
    echo ""
fi

echo "════════════════════════════════════════════════════════"
