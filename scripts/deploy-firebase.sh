#!/bin/bash
# Firebase Deployment Script for Recharge Travels

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Firebase deployment for Recharge Travels...${NC}"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}❌ Firebase CLI is not installed. Installing now...${NC}"
    npm install -g firebase-tools
fi

# Function to check Firebase login
check_firebase_login() {
    if ! firebase projects:list &> /dev/null; then
        echo -e "${RED}❌ Not logged in to Firebase. Please run: firebase login${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Firebase authentication verified${NC}"
}

# Function to build main app
build_main_app() {
    echo -e "${BLUE}📦 Installing main app dependencies...${NC}"
    npm ci
    
    echo -e "${BLUE}🏗️  Building main application...${NC}"
    npm run build
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Main app build failed - dist directory not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Main app build completed successfully${NC}"
}

# Function to build admin app
build_admin_app() {
    if [ -d "admin" ]; then
        echo -e "${BLUE}📦 Installing admin app dependencies...${NC}"
        cd admin
        npm ci
        
        echo -e "${BLUE}🏗️  Building admin application...${NC}"
        npm run build
        
        if [ ! -d "dist" ]; then
            echo -e "${RED}❌ Admin app build failed - dist directory not found${NC}"
            exit 1
        fi
        cd ..
        echo -e "${GREEN}✅ Admin app build completed successfully${NC}"
    fi
}

# Function to build functions
build_functions() {
    if [ -d "functions" ]; then
        echo -e "${BLUE}📦 Building Firebase Functions...${NC}"
        cd functions
        npm ci
        npm run build
        cd ..
        echo -e "${GREEN}✅ Functions build completed successfully${NC}"
    fi
}

# Function to deploy based on target
deploy_target() {
    local target=$1
    
    case $target in
        "all")
            echo -e "${BLUE}🚀 Deploying everything...${NC}"
            firebase deploy
            ;;
        "hosting")
            echo -e "${BLUE}🌐 Deploying hosting only...${NC}"
            firebase deploy --only hosting
            ;;
        "hosting:main")
            echo -e "${BLUE}🌐 Deploying main site...${NC}"
            firebase deploy --only hosting:main
            ;;
        "hosting:admin")
            echo -e "${BLUE}🔧 Deploying admin site...${NC}"
            firebase deploy --only hosting:admin
            ;;
        "functions")
            echo -e "${BLUE}⚡ Deploying functions...${NC}"
            firebase deploy --only functions
            ;;
        "rules")
            echo -e "${BLUE}🔒 Deploying Firestore rules...${NC}"
            firebase deploy --only firestore:rules
            ;;
        "indexes")
            echo -e "${BLUE}📑 Deploying Firestore indexes...${NC}"
            firebase deploy --only firestore:indexes
            ;;
        *)
            echo -e "${RED}❌ Invalid target: $target${NC}"
            show_usage
            exit 1
            ;;
    esac
}

# Function to show usage
show_usage() {
    echo -e "${YELLOW}Usage: ./deploy-firebase.sh [target]${NC}"
    echo ""
    echo "Targets:"
    echo "  all           - Deploy everything"
    echo "  hosting       - Deploy all hosting targets"
    echo "  hosting:main  - Deploy main site only"
    echo "  hosting:admin - Deploy admin site only"
    echo "  functions     - Deploy functions only"
    echo "  rules         - Deploy Firestore rules only"
    echo "  indexes       - Deploy Firestore indexes only"
    echo ""
    echo "If no target is specified, 'hosting' will be used by default."
}

# Main execution
main() {
    local target=${1:-"hosting"}
    
    # Check Firebase login
    check_firebase_login
    
    # Build based on target
    if [[ "$target" == "all" || "$target" == "hosting" || "$target" == "hosting:main" ]]; then
        build_main_app
    fi
    
    if [[ "$target" == "all" || "$target" == "hosting" || "$target" == "hosting:admin" ]]; then
        build_admin_app
    fi
    
    if [[ "$target" == "all" || "$target" == "functions" ]]; then
        build_functions
    fi
    
    # Deploy
    deploy_target "$target"
    
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 Main site: https://recharge-travels-73e76.web.app${NC}"
    echo -e "${BLUE}🔧 Admin panel: https://recharge-travels-73e76-admin.web.app${NC}"
    echo -e "${BLUE}📱 Firebase Console: https://console.firebase.google.com/project/recharge-travels-73e76${NC}"
}

# Check for help flag
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    show_usage
    exit 0
fi

# Run main function
main "$@"