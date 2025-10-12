#!/bin/bash

# Script to migrate from Supabase to Firebase

echo "🔄 Starting Supabase to Firebase migration..."

# Replace Supabase imports with Firebase services
echo "📝 Updating imports..."

# Find all files with supabase imports and replace them
find src admin/src -name "*.ts" -o -name "*.tsx" | while read file; do
  # Replace supabase imports
  sed -i '' "s|from '@/lib/supabase'|from '@/lib/firebase-services'|g" "$file"
  sed -i '' "s|from '@/lib/supabase-compat'|from '@/lib/firebase-services'|g" "$file"
  sed -i '' "s|from '@/lib/supabase-cms'|from '@/lib/firebase-services'|g" "$file"
  sed -i '' "s|import { supabase }|import { dbService, authService, storageService }|g" "$file"
  sed -i '' "s|from '@/integrations/supabase/client'|from '@/lib/firebase-services'|g" "$file"
  
  # Replace supabase usage patterns
  sed -i '' "s|supabase\.from(\([^)]*\))\.insert|dbService.create(\1,|g" "$file"
  sed -i '' "s|supabase\.from(\([^)]*\))\.select|dbService.list(\1|g" "$file"
  sed -i '' "s|supabase\.from(\([^)]*\))\.update|dbService.update(\1,|g" "$file"
  sed -i '' "s|supabase\.from(\([^)]*\))\.delete|dbService.delete(\1,|g" "$file"
  sed -i '' "s|supabase\.auth\.signUp|authService.signUp|g" "$file"
  sed -i '' "s|supabase\.auth\.signIn|authService.signIn|g" "$file"
  sed -i '' "s|supabase\.auth\.signOut|authService.signOut|g" "$file"
  sed -i '' "s|supabase\.storage|storageService|g" "$file"
done

echo "✅ Import updates complete!"

# Update environment variables
echo "📝 Updating environment variables..."
if [ -f ".env" ]; then
  # Comment out Supabase variables
  sed -i '' 's/^VITE_SUPABASE_URL/# VITE_SUPABASE_URL/' .env
  sed -i '' 's/^VITE_SUPABASE_ANON_KEY/# VITE_SUPABASE_ANON_KEY/' .env
  sed -i '' 's/^SUPABASE_SERVICE_ROLE_KEY/# SUPABASE_SERVICE_ROLE_KEY/' .env
fi

echo "✅ Environment variables updated!"

echo "🎉 Migration script complete! Please review the changes and test your application."
echo "⚠️  Note: Complex queries may need manual adjustment."
