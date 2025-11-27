#!/bin/bash

# Culinary Tours Enhanced - Build & Deploy Script
echo "🍽️  Building Enhanced Culinary Tours Page..."
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build Main App
echo -e "\n${BLUE}Step 1: Building Main Application${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Main app build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Main app built successfully${NC}"

# Step 2: Build Admin Panel
echo -e "\n${BLUE}Step 2: Building Admin Panel${NC}"
cd admin
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Admin panel build failed${NC}"
  exit 1
fi
cd ..
echo -e "${GREEN}✅ Admin panel built successfully${NC}"

# Step 3: Deploy Main App to Firebase
echo -e "\n${BLUE}Step 3: Deploying Main App to Firebase${NC}"
firebase deploy --only hosting:main
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Main app deployment failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Main app deployed successfully${NC}"

# Step 4: Deploy Admin Panel to Firebase
echo -e "\n${BLUE}Step 4: Deploying Admin Panel to Firebase${NC}"
firebase deploy --only hosting:admin
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Admin panel deployment failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Admin panel deployed successfully${NC}"

echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE! 🎉${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "\n${YELLOW}📱 Live URLs:${NC}"
echo -e "${BLUE}Main Site:${NC} https://recharge-travels-73e76.web.app"
echo -e "${BLUE}Culinary Tours:${NC} https://recharge-travels-73e76.web.app/tours/culinary"
echo -e "${BLUE}Admin Panel:${NC} https://recharge-travels-admin.web.app/culinary"
echo -e "\n${YELLOW}🔑 Admin Access:${NC}"
echo -e "Navigate to admin panel and login, then visit /culinary route"
echo ""
