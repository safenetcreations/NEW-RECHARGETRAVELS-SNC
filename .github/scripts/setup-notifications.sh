#!/bin/bash

# Setup script for deployment notifications

echo "🔔 Setting up deployment notifications for Recharge Travels CI/CD"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ You are not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to add a secret
add_secret() {
    local secret_name=$1
    local prompt_text=$2
    
    echo -n "$prompt_text: "
    read -s secret_value
    echo ""
    
    if [ ! -z "$secret_value" ]; then
        echo "$secret_value" | gh secret set "$secret_name"
        echo "✅ Added secret: $secret_name"
    else
        echo "⏭️  Skipped: $secret_name"
    fi
}

echo "📝 Setting up notification webhooks..."
echo ""

# Slack webhook
echo "For Slack notifications, you need a webhook URL."
echo "Get one from: https://api.slack.com/messaging/webhooks"
add_secret "SLACK_WEBHOOK" "Enter Slack webhook URL (or press Enter to skip)"

echo ""
echo "📝 Setting up optional deployment secrets..."
echo ""

# Firebase token for CLI deployments
echo "For Firebase CLI deployments (optional backup method):"
echo "Run 'firebase login:ci' to get a token"
add_secret "FIREBASE_TOKEN" "Enter Firebase CI token (or press Enter to skip)"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure branch protection rules (see .github/BRANCH_PROTECTION_RULES.md)"
echo "2. Ensure FIREBASE_SERVICE_ACCOUNT secret is set (required for deployments)"
echo "3. Push to main branch to trigger your first automated deployment"
echo ""
echo "📊 Monitor your deployments at:"
echo "https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"