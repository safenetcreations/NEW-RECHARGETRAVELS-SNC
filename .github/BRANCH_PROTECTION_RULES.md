# 🔒 Branch Protection Rules Configuration

This document outlines the recommended branch protection rules for the Recharge Travels Sri Lanka repository.

## 🎯 Main Branch Protection

### Branch: `main`

**Settings to Enable:**

1. **Require a pull request before merging**
   - ✅ Require approvals: 1
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from CODEOWNERS (if applicable)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - **Required status checks:**
     - `code-quality` (from PR Checks workflow)
     - `security-scan` (from PR Checks workflow)
     - `build-and-preview` (from Staging Deploy workflow)

3. **Require conversation resolution before merging**
   - ✅ All conversations must be resolved

4. **Additional settings**
   - ✅ Include administrators
   - ✅ Restrict who can push to matching branches (optional)
   - ✅ Allow force pushes: ❌ Disabled
   - ✅ Allow deletions: ❌ Disabled

## 🚀 Staging/Develop Branch Protection

### Branch: `develop` or `staging`

**Settings to Enable:**

1. **Require a pull request before merging**
   - ✅ Require approvals: 1
   - ❌ Do not require review dismissal

2. **Require status checks to pass before merging**
   - **Required status checks:**
     - `code-quality` (from PR Checks workflow)

3. **Additional settings**
   - ❌ Do not include administrators
   - ✅ Allow force pushes: ✅ Enabled (for rebasing)
   - ✅ Allow deletions: ❌ Disabled

## 📋 How to Configure

1. **Navigate to Repository Settings**
   ```
   Repository → Settings → Branches
   ```

2. **Add Rule**
   - Click "Add rule" or "Add branch protection rule"

3. **Configure for Main Branch**
   - Branch name pattern: `main`
   - Apply all settings from the "Main Branch Protection" section above

4. **Configure for Staging Branch**
   - Add another rule
   - Branch name pattern: `develop` or `staging`
   - Apply settings from the "Staging/Develop Branch Protection" section

## 🔔 Recommended GitHub Settings

### General Repository Settings

1. **Features**
   - ✅ Issues: Enabled
   - ✅ Projects: Enabled (for project management)
   - ✅ Wiki: Disabled (use docs in repo instead)

2. **Merge Button**
   - ✅ Allow merge commits
   - ✅ Allow squash merging (recommended default)
   - ❌ Allow rebase merging (to maintain clear history)
   - ✅ Automatically delete head branches

3. **Pull Requests**
   - ✅ Allow auto-merge
   - ✅ Always suggest updating pull request branches

## 🚨 GitHub Actions Permissions

1. **Actions permissions**
   - Select: "Allow all actions and reusable workflows"

2. **Workflow permissions**
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

## 📝 CODEOWNERS (Optional)

Create a `.github/CODEOWNERS` file if you want to require reviews from specific team members:

```
# Example CODEOWNERS file
# Global owners
* @nanthan

# Frontend code
/src/ @nanthan @frontend-team

# Admin panel
/admin/ @nanthan @admin-team

# CI/CD and DevOps
/.github/ @nanthan @devops-team

# Firebase configuration
firebase.json @nanthan @backend-team
firestore.rules @nanthan @backend-team
```

## 🔐 Secrets Configuration

Ensure these secrets are configured in repository settings:

1. **Required Secrets:**
   - `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
   - `FIREBASE_TOKEN` - Firebase CLI token (for deployments)
   - `GITHUB_TOKEN` - Automatically provided by GitHub

2. **Optional Secrets:**
   - `SLACK_WEBHOOK` - For deployment notifications
   - `VITE_FIREBASE_*` - Firebase configuration (if not using defaults)
   - `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
   - `VITE_PAYHERE_*` - Payment gateway configuration

## 🎯 Best Practices

1. **Never commit directly to main** - Always use pull requests
2. **Keep PRs small and focused** - Easier to review
3. **Write descriptive PR titles** - Use conventional commits format
4. **Add PR descriptions** - Explain what and why
5. **Link issues** - Use "Fixes #123" in PR descriptions
6. **Review your own PR first** - Catch obvious issues
7. **Respond to feedback promptly** - Keep PRs moving

## 📊 Monitoring

- Check GitHub Insights for PR metrics
- Monitor deployment success rates
- Review security alerts regularly
- Track build times and optimize as needed