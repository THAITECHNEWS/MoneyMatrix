# 🔐 Fix GitHub Authentication

## Problem
You're logged in as `ofridavid` but trying to push to `THAITECHNEWS` account.

## Solutions

### Option 1: Use GitHub CLI (Recommended - Easiest)

If you have GitHub CLI installed:

```bash
# Login to GitHub CLI with THAITECHNEWS account
gh auth login

# Then push
git push -u origin main
```

### Option 2: Use Personal Access Token

1. **Generate Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `MoneyMatrix Push`
   - Expiration: Choose duration (90 days recommended)
   - Select scopes: ✅ **repo** (Full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push with Token:**
   ```bash
   git push -u origin main
   # Username: THAITECHNEWS
   # Password: [paste your token here]
   ```

### Option 3: Use SSH (Most Secure)

1. **Check if you have SSH key:**
   ```bash
   ls -la ~/.ssh/id_*.pub
   ```

2. **If no SSH key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. **Add SSH key to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

4. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:THAITECHNEWS/MoneyMatrix.git
   git push -u origin main
   ```

### Option 4: Clear Credentials and Re-authenticate

```bash
# Clear stored credentials
git credential reject <<EOF
protocol=https
host=github.com
EOF

# Try push again (will prompt for credentials)
git push -u origin main
```

---

## Quick Fix: Try This First

```bash
# Clear any cached credentials
git credential-cache exit 2>/dev/null || true

# Try pushing (will prompt for login)
git push -u origin main
```

When prompted:
- **Username:** `THAITECHNEWS`
- **Password:** Use a Personal Access Token (not your password)

---

## Which Account Should You Use?

Make sure you're authenticated with the **THAITECHNEWS** account, not `ofridavid`.

If `ofridavid` is your personal account and `THAITECHNEWS` is an organization:
- You need to be a member of the organization
- Or use an organization access token
- Or push from your personal account if you have write access

---

**Try Option 1 (GitHub CLI) first - it's the easiest!**

