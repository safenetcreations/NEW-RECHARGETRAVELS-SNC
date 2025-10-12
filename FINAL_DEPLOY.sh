#!/bin/bash

# Final Admin Panel Deployment - Fixed All Issues
# This script deploys the fully fixed admin panel

set -e

echo "=========================================="
echo "🎉 Final Admin Panel Deployment"
echo "=========================================="
echo ""
echo "✅ Issues Fixed:"
echo "   - React Context duplication"
echo "   - CSS/Tailwind configuration"
echo "   - Provider setup"
echo ""

# Change to project root
cd "$(dirname "$0")"

# Check Firebase auth
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list >/dev/null 2>&1; then
    echo ""
    echo "❌ Not logged in to Firebase."
    echo ""
    echo "Please run this command first:"
    echo "   firebase login --reauth"
    echo ""
    exit 1
fi

echo "✅ Firebase authentication OK"
echo ""

# Deploy
echo "🚀 Deploying to Firebase..."
echo ""
firebase deploy --only hosting:admin

echo ""
echo "=========================================="
echo "🎊 Deployment Successful!"
echo "=========================================="
echo ""
echo "🌐 Admin Panel Live at:"
echo "   https://recharge-travels-admin.web.app"
echo ""
echo "⚠️  IMPORTANT - Clear Browser Cache:"
echo "   Mac:     Cmd + Shift + R"
echo "   Windows: Ctrl + Shift + R"
echo "   Or use Incognito/Private mode"
echo ""
echo "🔐 Login with:"
echo "   Email: admin@rechargetravels.com"
echo "   (Check ADMIN_CREDENTIALS.md for password)"
echo ""
echo "✅ The admin panel now has:"
echo "   • Full styling and colors"
echo "   • Working React contexts"
echo "   • Dashboard with all features"
echo "   • Responsive design"
echo ""
