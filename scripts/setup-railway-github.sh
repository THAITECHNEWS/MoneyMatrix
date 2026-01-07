#!/bin/bash

# Setup Railway GitHub Integration
# This script helps you set up Railway with GitHub for automatic deployments

echo "🚀 Setting up Railway GitHub Integration"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git branch -M main
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "⚠️  No GitHub remote found."
    echo "Please add your GitHub remote:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    read -p "Press Enter after adding remote, or Ctrl+C to cancel..."
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📦 Current branch: $CURRENT_BRANCH"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes."
    echo ""
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Setup Railway deployment"
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin $CURRENT_BRANCH

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Click 'New Project' or select your existing project"
echo "3. Click 'New Service' → 'GitHub Repo'"
echo "4. Select your MoneyMatrix repository"
echo "5. Railway will auto-detect Next.js and deploy automatically"
echo ""
echo "🎉 After setup, every 'git push' will auto-deploy!"







