# 🚀 Push to GitHub Using Personal Access Token

## Quick Steps

### Step 1: Generate Personal Access Token

1. **Go to GitHub:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Fill in:**
   - **Note:** `MoneyMatrix Push`
   - **Expiration:** 90 days (or your preference)
   - **Select scopes:** ✅ **repo** (Full control of private repositories)
4. **Click:** "Generate token"
5. **COPY THE TOKEN** (starts with `ghp_...`) - You won't see it again!

### Step 2: Push Using Token

Run this command:

```bash
git push -u origin main
```

When prompted:
- **Username:** `THAITECHNEWS`
- **Password:** Paste your token (not your actual password!)

---

## Alternative: Use Token in URL (One-time)

If you want to avoid prompts:

```bash
# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/THAITECHNEWS/MoneyMatrix.git
git push -u origin main
```

**⚠️ Warning:** This stores the token in your git config. Remove it after pushing:
```bash
git remote set-url origin https://github.com/THAITECHNEWS/MoneyMatrix.git
```

---

## If THAITECHNEWS is an Organization

If `THAITECHNEWS` is an organization account:

1. Make sure `ofridavid` is a member of the organization
2. Or generate an organization token:
   - Go to: https://github.com/organizations/THAITECHNEWS/settings/tokens
   - Generate organization token with repo access

---

## Quick Command

**After generating your token, run:**

```bash
git push -u origin main
# Username: THAITECHNEWS
# Password: [paste token]
```

---

**Ready? Generate your token at https://github.com/settings/tokens and then push!**



