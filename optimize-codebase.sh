#!/bin/bash

# Codebase Optimization Script
# Removes unused code, cleans up files, and optimizes for performance

set -e

echo "🚀 Starting Codebase Optimization..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for tracking
REMOVED_COUNT=0

# 1. Remove .old backup files
echo -e "\n${YELLOW}📦 Step 1: Removing .old backup files...${NC}"
OLD_FILES=$(find src -name "*.old.*" 2>/dev/null || true)
if [ -n "$OLD_FILES" ]; then
    echo "$OLD_FILES" | while read file; do
        echo "  Removing: $file"
        rm -f "$file"
        ((REMOVED_COUNT++))
    done
    echo -e "${GREEN}✓ Removed backup files${NC}"
else
    echo "  No .old files found"
fi

# 2. Remove .DS_Store and system files
echo -e "\n${YELLOW}📦 Step 2: Removing system junk files...${NC}"
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true
find . -name "*.swp" -type f -delete 2>/dev/null || true
echo -e "${GREEN}✓ Removed system files${NC}"

# 3. Clean .superdesign folder if not in use
echo -e "\n${YELLOW}📦 Step 3: Cleaning .superdesign folder...${NC}"
if [ -d ".superdesign" ]; then
    echo "  .superdesign folder exists - keeping for design iterations"
else
    echo "  No .superdesign folder found"
fi

# 4. Remove unused markdown documentation (optional - commented out for safety)
echo -e "\n${YELLOW}📦 Step 4: Listing potentially unused documentation...${NC}"
echo "  Found the following documentation files:"
ls -1 *.md 2>/dev/null | head -10 || echo "  No markdown files in root"
echo "  (Not removing - manual review recommended)"

# 5. Clean build artifacts
echo -e "\n${YELLOW}📦 Step 5: Cleaning build artifacts...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✓ Removed dist folder${NC}"
fi
if [ -d "admin/dist" ]; then
    rm -rf admin/dist
    echo -e "${GREEN}✓ Removed admin/dist folder${NC}"
fi

# 6. Clean TypeScript build info
echo -e "\n${YELLOW}📦 Step 6: Cleaning TypeScript build info...${NC}"
rm -f tsconfig.*.tsbuildinfo 2>/dev/null || true
echo -e "${GREEN}✓ Removed .tsbuildinfo files${NC}"

# 7. Report on large files
echo -e "\n${YELLOW}📦 Step 7: Analyzing large source files...${NC}"
echo "  Top 5 largest source files:"
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + 2>/dev/null | \
    sort -rn | head -6 | tail -5 | \
    awk '{printf "    %5d lines: %s\n", $1, $2}'

echo -e "\n${GREEN}======================================"
echo -e "✅ Optimization Complete!"
echo -e "=====================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run build' to create optimized production build"
echo "  2. Check build size with 'du -sh dist'"
echo "  3. Test the application to ensure nothing broke"
echo ""
