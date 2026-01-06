#!/bin/bash

# Fix Railway 403 Error - Based on Railway Forum Solutions
# Run this script in your terminal

echo "🔧 Fixing Railway 403 Error..."
echo ""

# Step 1: Logout
echo "1️⃣ Logging out..."
railway logout

# Step 2: Delete config
echo "2️⃣ Deleting Railway config..."
rm -f ~/.railway/config.json
echo "✅ Config deleted"

# Step 3: Login
echo "3️⃣ Please login to Railway..."
railway login

# Step 4: Verify account
echo "4️⃣ Verifying account..."
railway whoami

# Step 5: Link to service
echo "5️⃣ Linking to service..."
echo "   (Select your project and service when prompted)"
railway link

# Step 6: Try deploy
echo "6️⃣ Attempting deployment..."
railway up

echo ""
echo "✅ Done! If it still fails, try:"
echo "   railway trdeploy  (temporary deploy)"
echo "   Or use GitHub integration instead"





