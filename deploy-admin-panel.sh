#!/bin/bash

# Admin Panel Deployment Script for Recharge Travels
# This script builds and deploys the admin panel to Firebase

set -e

echo "=================================="
echo "🚀 Admin Panel Deployment"
echo "=================================="
echo ""

# Change to project root
cd "$(dirname "$0")"

echo "📍 Current directory: $(pwd)"
echo ""

# Step 1: Build the admin panel
echo "📦 Step 1: Building admin panel..."
cd admin
npm run build:fast
cd ..
echo "✅ Admin panel built successfully!"
echo ""

# Step 2: Deploy to Firebase
echo "🔥 Step 2: Deploying to Firebase..."
firebase deploy --only hosting:admin

echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "🌐 Your admin panel is now live at:"
echo "   https://recharge-travels-admin.web.app"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email: admin@rechargetravels.com"
echo "   Password: (check ADMIN_CREDENTIALS.md)"
echo ""
