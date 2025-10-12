#!/bin/bash

# Deploy All Sites Script
# This script builds and deploys both the main website and admin panel

echo "🚀 Starting Complete Deployment Process..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed${NC}"
    echo "Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Please run: firebase login"
    exit 1
fi

echo -e "${GREEN}✓ Firebase authentication verified${NC}"

# Clean previous builds
echo ""
echo "🧹 Cleaning previous builds..."
rm -rf dist admin/dist

# Build main website
echo ""
echo "🏗️  Building main website..."
if npm run build; then
    echo -e "${GREEN}✓ Main website built successfully${NC}"
else
    echo -e "${RED}❌ Main website build failed${NC}"
    exit 1
fi

# Build admin panel
echo ""
echo "🏗️  Building admin panel..."
if npm run build:admin; then
    echo -e "${GREEN}✓ Admin panel built successfully${NC}"
else
    echo -e "${RED}❌ Admin panel build failed${NC}"
    exit 1
fi

# Deploy to Firebase
echo ""
echo "☁️  Deploying to Firebase..."
echo "This includes:"
echo "  - Main website hosting"
echo "  - Admin panel hosting"
echo "  - Firestore rules"
echo "  - Firestore indexes"

if firebase deploy; then
    echo ""
    echo -e "${GREEN}🎉 Deployment Successful!${NC}"
    echo "======================================="
    echo ""
    echo "📱 Your sites are now live at:"
    echo -e "${GREEN}Main Website:${NC} https://recharge-travels-73e76.web.app"
    echo -e "${GREEN}Admin Panel:${NC} https://recharge-travels-admin.web.app"
    echo ""
    echo "📊 View deployment details at:"
    echo "https://console.firebase.google.com/project/recharge-travels-73e76/hosting"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "Check the error messages above and try again"
    exit 1
fi

echo ""
echo "✅ All done! Your websites are deployed and ready to use."