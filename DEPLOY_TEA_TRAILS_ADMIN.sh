#!/bin/bash

# Complete Tea Trails Admin Control Deployment Script
# This script deploys the admin panel and seeds the Tea Trails experience data

set -e

echo "=================================="
echo "🚀 Tea Trails Admin Control Deployment"
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

# Build the main application
echo "🔨 Building main application..."
npm run build

echo "✅ Main application built successfully"
echo ""

# Build the admin panel
echo "🔨 Building admin panel..."
npm run build:admin

echo "✅ Admin panel built successfully"
echo ""

# Deploy Firestore rules and indexes first
echo "🔥 Deploying Firestore rules and indexes..."
firebase deploy --only firestore:rules,firestore:indexes

echo "✅ Firestore rules and indexes deployed"
echo ""

# Seed the Tea Trails experience data
echo "🌱 Seeding Tea Trails experience data..."
npm run seed:tea-trails

echo "✅ Tea Trails data seeded successfully"
echo ""

# Deploy hosting
echo "🔥 Deploying hosting (main site and admin panel)..."
firebase deploy --only hosting

echo ""
echo "=================================="
echo "✅ Complete Deployment Successful!"
echo "=================================="
echo ""
echo "🌐 Your sites are now live:"
echo "   Main Site: https://recharge-travels.web.app"
echo "   Admin Panel: https://recharge-travels-admin.web.app"
echo ""
echo "🎯 Tea Trails Admin Features:"
echo "   • Full content management for Tea Trails experience"
echo "   • Dynamic editing of all page sections"
echo "   • Real-time content updates"
echo "   • Enhanced design with interactive elements"
echo ""
echo "📝 Admin Panel Access:"
echo "   URL: https://recharge-travels-admin.web.app"
echo "   Navigate to: Experience Pages > Tea Trails"
echo ""
echo "🔐 Admin Credentials:"
echo "   Email: admin@rechargetravels.com"
echo "   Password: (check ADMIN_CREDENTIALS.md)"
echo ""
echo "🧪 Testing:"
echo "   See TEA_TRAILS_ADMIN_TESTING_GUIDE.md for comprehensive testing instructions"
echo ""
echo "📞 Support:"
echo "   If you encounter issues:"
echo "   1. Check browser console (F12 > Console)"
echo "   2. Clear browser cache (Cmd+Shift+R)"
echo "   3. Try incognito mode"
echo "   4. Verify Firebase project settings"
echo ""

echo "🎉 Tea Trails admin control implementation complete!"
echo ""