#!/bin/bash
# Admin Panel Deployment Script

echo "🚀 Deploying Admin Panel..."
echo ""

cd admin

echo "📦 Building admin panel..."
npm run build:fast

cd ..

echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting:admin

echo ""
echo "✅ Deployment complete!"
echo "Your admin panel should now be live at: https://recharge-travels-admin.web.app"
