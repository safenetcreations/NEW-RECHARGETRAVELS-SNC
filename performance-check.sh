#!/bin/bash

# Quick Performance Check Script
# Run this periodically to monitor build health

set -e

echo "🔍 Performance Health Check"
echo "============================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "📦 Building project first..."
    npm run build > /dev/null 2>&1
fi

# 1. Bundle Size Check
echo "📊 Bundle Size Analysis:"
echo "  Total: $(du -sh dist | awk '{print $1}')"
echo "  JavaScript: $(du -sh dist/assets/*.js 2>/dev/null | awk '{sum+=$1} END {print sum/1024 "MB"}' || echo '0')"
echo "  CSS: $(du -sh dist/assets/*.css 2>/dev/null | awk '{sum+=$1} END {print sum "KB"}' || echo '0')"
echo ""

# 2. Largest JS Chunks
echo "🎯 Largest JavaScript Chunks:"
du -sh dist/assets/*.js 2>/dev/null | sort -h | tail -5 | awk '{printf "  %s → %s\n", $2, $1}' || echo "  No JS files found"
echo ""

# 3. Source Code Stats
echo "📝 Source Code Statistics:"
echo "  Total Files: $(find src -type f \( -name "*.tsx" -o -name "*.ts" \) | wc -l | xargs)"
echo "  Total Lines: $(find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo '0')"
echo "  Largest File: $(find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + 2>/dev/null | sort -rn | head -2 | tail -1 | awk '{print $2 " (" $1 " lines)"}' || echo 'N/A')"
echo ""

# 4. Console.log Check
CONSOLE_COUNT=$(grep -r "console\\.log" src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    echo "⚠️  Console.log Statements: $CONSOLE_COUNT (will be removed in production)"
else
    echo "✅ Console.log Statements: 0"
fi
echo ""

# 5. Old Files Check
OLD_FILES=$(find src -name "*.old.*" 2>/dev/null | wc -l | xargs)
if [ "$OLD_FILES" -gt 0 ]; then
    echo "⚠️  Old Backup Files: $OLD_FILES (run optimize-codebase.sh to clean)"
else
    echo "✅ Old Backup Files: 0"
fi
echo ""

# 6. TypeScript Build Check
echo "🔧 TypeScript Check:"
if npm run typecheck > /tmp/ts-check.log 2>&1; then
    echo "  ✅ No type errors"
else
    ERROR_COUNT=$(grep -c "error TS" /tmp/ts-check.log 2>/dev/null || echo "0")
    echo "  ⚠️  Type errors found: $ERROR_COUNT"
    echo "  Run 'npm run typecheck' for details"
fi
echo ""

# 7. Dependencies Check
echo "📦 Dependencies:"
DEPS_COUNT=$(cat package.json | grep -c '"' || echo "0")
echo "  Total packages: $(npm list --depth=0 2>/dev/null | wc -l | xargs)"
echo ""

# 8. Build Time Estimate
echo "⏱️  Last Build Time: $(stat -f %Sm -t "%Y-%m-%d %H:%M:%S" dist/index.html 2>/dev/null || echo 'Not available')"
echo ""

# Summary
echo "============================"
echo "✅ Health Check Complete!"
echo ""
echo "Tips:"
echo "  • Bundle size under 15MB: Good for travel site"
echo "  • Run 'npm run optimize-codebase.sh' to clean old files"
echo "  • Run 'npm run build' to test production build"
echo "  • Run 'npx lighthouse http://localhost:4173' for performance audit"
echo ""
