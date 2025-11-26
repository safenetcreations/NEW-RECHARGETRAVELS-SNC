#!/bin/bash

echo "████████████████████████████████████████████████████████████████████████████████"
echo "                    🚀 DEPLOYING TO PRODUCTION"
echo "████████████████████████████████████████████████████████████████████████████████"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if logged in to Firebase
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}STEP 1: Checking Firebase Authentication${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Running: firebase login"
    firebase login
else
    echo -e "${GREEN}✅ Already logged in to Firebase${NC}"
fi
echo ""

# Step 2: Security Warning
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${RED}⚠️  SECURITY WARNING${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your Firestore rules are currently OPEN (development mode)."
echo "This allows ANYONE to read/write your database!"
echo ""
echo -e "${YELLOW}RECOMMENDED: Deploy production security rules${NC}"
echo ""
read -p "Deploy secure production rules now? (y/n): " deploy_rules

if [ "$deploy_rules" = "y" ] || [ "$deploy_rules" = "Y" ]; then
    if [ -f "firestore.rules.production" ]; then
        echo -e "${BLUE}→ Copying production rules...${NC}"
        cp firestore.rules.production firestore.rules
        echo -e "${GREEN}✅ Production rules copied${NC}"
    else
        echo -e "${RED}❌ firestore.rules.production not found!${NC}"
        echo "Continuing with current rules..."
    fi
else
    echo -e "${YELLOW}⚠️  Continuing with current (insecure) rules${NC}"
    echo "Remember to update them soon!"
fi
echo ""

# Step 3: Clean previous build
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}STEP 2: Cleaning Previous Build${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
rm -rf dist
echo -e "${GREEN}✅ Build folder cleaned${NC}"
echo ""

# Step 4: Build for production
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}STEP 3: Building for Production${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "This may take 2-3 minutes..."
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Build failed!${NC}"
    echo "Check the errors above and try again."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

# Step 5: Deploy to Firebase
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}STEP 4: Deploying to Firebase Hosting${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$deploy_rules" = "y" ] || [ "$deploy_rules" = "Y" ]; then
    echo "Deploying hosting + Firestore rules..."
    firebase deploy --only hosting,firestore:rules
else
    echo "Deploying hosting only..."
    firebase deploy --only hosting
fi

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check the errors above."
    exit 1
fi

echo ""
echo "████████████████████████████████████████████████████████████████████████████████"
echo -e "${GREEN}                    🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}"
echo "████████████████████████████████████████████████████████████████████████████████"
echo ""
echo "Your Wild Tours page is now LIVE! 🦁"
echo ""
echo "📱 Visit your site:"
echo "   → https://recharge-travels-73e76.web.app"
echo "   → https://recharge-travels-73e76.firebaseapp.com"
echo ""
if [ -f ".firebaserc" ]; then
    CUSTOM_DOMAIN=$(cat .firebaserc | grep -o '"site".*' | cut -d'"' -f4)
    if [ ! -z "$CUSTOM_DOMAIN" ]; then
        echo "   → https://$CUSTOM_DOMAIN"
    fi
fi
echo ""
echo "🔍 Check Wild Tours page at:"
echo "   → https://your-domain.com/wildtours"
echo "   → https://your-domain.com/tours/wildtours"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. ✅ Test your live site"
echo "2. ✅ Check Wild Tours page works"
echo "3. ⚠️  Update Firestore rules if you didn't deploy them"
echo "4. ✅ Set up custom domain (if needed)"
echo "5. ✅ Monitor Firebase Console for usage"
echo ""
if [ "$deploy_rules" != "y" ] && [ "$deploy_rules" != "Y" ]; then
    echo -e "${YELLOW}⚠️  IMPORTANT: Your Firestore rules are still OPEN!${NC}"
    echo "   Deploy production rules ASAP:"
    echo "   $ firebase deploy --only firestore:rules"
    echo ""
fi
echo "████████████████████████████████████████████████████████████████████████████████"
