#!/bin/bash

# Script to fix remaining Supabase imports that weren't caught by the first script

set -e

echo "🔧 Fixing remaining Supabase imports..."

# List of files that still need to be updated
files=(
    "src/contexts/auth/useAuthState.ts"
    "src/contexts/auth/useAuthMethods.ts"
    "src/utils/sampleHotelData.ts"
    "src/components/hotels/HotelGrid.tsx"
    "src/components/hotels/HotelFilters.tsx"
    "src/components/hotels/HotelCategoryFilter.tsx"
    "src/components/hotels/EnhancedHotelGrid.tsx"
    "src/components/hotels/EnhancedHotelSearch.tsx"
    "src/components/hotels/services/localHotelService.ts"
    "src/hooks/useDashboardData.ts"
    "src/hooks/useActivities.ts"
    "src/hooks/useActivityAvailability.ts"
    "src/hooks/useDestinations.ts"
    "src/hooks/useHotelFilterData.ts"
    "src/hooks/usePhotographyTours.ts"
    "src/hooks/useActivityCategories.ts"
    "src/hooks/useHotelAvailability.ts"
    "src/hooks/useAIScoreUpdater.ts"
    "src/lib/supabase-cms.ts"
    "admin/src/lib/supabase-cms.ts"
)

# Update each file
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating: $file"
        sed -i '' 's|from '\''@/integrations/supabase/client'\''|from '\''@/lib/supabase-compat'\''|g' "$file"
        echo "✅ Updated: $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 All remaining Supabase imports have been fixed!" 