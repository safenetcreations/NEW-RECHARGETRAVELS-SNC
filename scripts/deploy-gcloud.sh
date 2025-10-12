#!/bin/bash
# Google Cloud Deployment Script for Recharge Travels

set -e

echo "☁️  Starting Google Cloud deployment for Recharge Travels..."

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project variables
PROJECT_ID="recharge-travels-73e76"
SERVICE_NAME="rechargeravels-app"
REGION="us-central1"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🏗️  Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Set the active project
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Deploy to Google App Engine
echo "☁️  Deploying to Google App Engine..."
gcloud app deploy app.yaml --service=$SERVICE_NAME --version=v1 --promote --quiet

echo "✅ Deployment completed successfully!"
echo "🌐 Your site is live at: https://$PROJECT_ID.appspot.com"