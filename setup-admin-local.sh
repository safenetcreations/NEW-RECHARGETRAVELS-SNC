#!/bin/bash

echo "=== Recharge Travels Admin Setup ==="
echo ""
echo "This script will help you set up admin access for your local development."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Admin credentials
echo "📋 Default Admin Credentials:"
echo "   Email: admin@rechargetravels.com"
echo "   Password: Admin123!"
echo ""
echo "📋 Alternative Admin Account:"
echo "   Email: nanthan77@gmail.com"
echo "   Password: (set up at https://recharge-travels-73e76.web.app/setup-admin-user.html)"
echo ""

# Local admin panel
echo "🚀 To run the admin panel locally:"
echo ""
echo "   cd admin"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "   The admin panel will be available at: http://localhost:5174"
echo ""

# Production URLs
echo "🌐 Production URLs:"
echo "   Main Site: https://recharge-travels-73e76.web.app"
echo "   Admin Panel: https://recharge-travels-73e76-admin.web.app"
echo "   Admin Setup: https://recharge-travels-73e76.web.app/setup-admin-user.html"
echo ""

# Firebase project info
echo "🔥 Firebase Project:"
echo "   Project ID: recharge-travels-73e76"
echo "   Console: https://console.firebase.google.com/project/recharge-travels-73e76"
echo ""

echo "✅ Setup information complete!"