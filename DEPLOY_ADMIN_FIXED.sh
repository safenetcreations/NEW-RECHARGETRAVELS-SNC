#!/bin/bash

# Fixed Admin Panel Deployment Script
# This script deploys the properly built admin panel to Firebase

set -e

echo "=================================="
echo "🚀 Admin Panel Fixed Deployment"
echo "=================================="
echo ""

# Change to project root
cd "$(dirname "$0")"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if user is logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list >/dev/null 2>&1; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "   firebase login --reauth"
    echo ""
    exit 1
fi

echo "✅ Firebase authentication OK"
echo ""

# Deploy to Firebase
echo "🔥 Deploying admin panel to Firebase..."
firebase deploy --only hosting:admin

echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "🌐 Your admin panel should now be live at:"
echo "   https://recharge-travels-admin.web.app"
echo ""
echo "📝 If you still see issues:"
echo "   1. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)"
echo "   2. Try incognito/private browsing mode"
echo "   3. Check browser console for any errors (F12 > Console tab)"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email: admin@rechargetravels.com"
echo "   Password: (check ADMIN_CREDENTIALS.md)"
echo ""
