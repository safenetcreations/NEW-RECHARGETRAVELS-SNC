#!/bin/bash

# Script to update all Supabase imports to use Firebase compatibility layer
# This script will replace all Supabase imports with the compatibility layer

set -e

echo "🔄 Updating Supabase imports to Firebase compatibility layer..."

# Function to update imports in a file
update_imports() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Update different import patterns
    sed -E 's|import \{ supabase \} from '\''@/lib/supabase'\'';|import { supabase } from '\''@/lib/supabase-compat'\'';|g' "$file" > "$temp_file"
    sed -E 's|import \{ supabase \} from '\''@/integrations/supabase/client'\'';|import { supabase } from '\''@/lib/supabase-compat'\'';|g' "$temp_file" > "$file"
    sed -E 's|import \{ supabase \} from '\''\./supabase'\'';|import { supabase } from '\''@/lib/supabase-compat'\'';|g' "$file" > "$temp_file"
    sed -E 's|import \{ supabase \} from '\''\.\./supabase'\'';|import { supabase } from '\''@/lib/supabase-compat'\'';|g' "$temp_file" > "$file"
    sed -E 's|import \{ supabase \} from '\''\.\./\.\./supabase'\'';|import { supabase } from '\''@/lib/supabase-compat'\'';|g' "$file" > "$temp_file"
    
    # Update User type imports
    sed -E 's|import \{ User \} from '\''@supabase/supabase-js'\'';|import { User } from '\''firebase/auth'\'';|g' "$file" > "$temp_file"
    
    # Clean up temp file
    rm -f "$temp_file"
    
    echo "✅ Updated: $file"
}

# Find all TypeScript/JavaScript files with Supabase imports and update them
find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "import.*supabase" "$file"; then
        update_imports "$file"
    fi
done

# Also check admin directory
find admin/src -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "import.*supabase" "$file"; then
        update_imports "$file"
    fi
done

echo "🎉 All Supabase imports have been updated to use the Firebase compatibility layer!"
echo "📝 Please review the changes and test the application." 