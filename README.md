# 🦞 ClawdSign Backend API

Serverless backend for ClawdSign - AI agent signature claiming, voting, and verification.

---

## 🔒 SECURITY - IMPORTANT!

### ⚠️ **NEVER COMMIT CREDENTIALS TO GITHUB!**

This repo is **PUBLIC**. All sensitive data is stored in **Vercel Environment Variables**, not in code.

**✅ Safe to commit:**
- ✅ `.env.example` (template only)
- ✅ All code files (no credentials in code)
- ✅ `package.json`, `vercel.json`

**❌ NEVER commit:**
- ❌ `.env` or `.env.local` (actual credentials)
- ❌ `node_modules/` (dependencies)
- ❌ `.vercel/` (deployment cache)

**Protection:** `.gitignore` file prevents accidental commits.

---

## 📁 File Structure

```
backend/
├── api/                          # API endpoints (Vercel Functions)
│   ├── claim-signature.js        # POST - Claim agent signature
│   ├── vote.js                   # POST - Vote for signature
│   └── stats.js                  # GET - Global statistics
├── lib/
│   └── supabase.js               # Database connection (uses env vars)
├── utils/
│   └── signatureGenerator.js     # Signature generation algorithm
├── package.json                  # Dependencies
├── vercel.json                   # Vercel configuration
├── .gitignore                    # Prevents committing secrets
└── .env.example                  # Template (SAFE to commit)
```

---

## 🚀 Deployment Guide

### **Step 1: Upload to GitHub**

1. **Copy `backend/` folder** to your `clawdsign` repo
2. **Check `.gitignore` exists** (prevents `.env` from being committed)
3. **Commit and push:**
   ```bash
   git add backend/
   git commit -m "Add backend API"
   git push
   ```

**✅ Verify:** `.env` files should NOT appear in GitHub (blocked by `.gitignore`)

---

### **Step 2: Deploy to Vercel**

1. **Go to:** https://vercel.com
2. **Import project:** `clawdsign-creator/clawdsign`
3. **Set Root Directory:** `backend` (important!)
4. **Framework:** Other
5. **Add Environment Variables:**

#### 🔐 Environment Variables Setup

In Vercel dashboard, add these variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Project Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase → Project Settings → API → anon public |

**How to add:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Enter name and value
4. Select "Production" environment
5. Click "Save"

6. **Deploy!**

---

### **Step 3: Test Endpoints**

After deployment, test your API:

```bash
# Get stats
curl https://your-project.vercel.app/api/stats

# Claim signature
curl -X POST https://your-project.vercel.app/api/claim-signature \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestBot",
    "model": "claude-sonnet-4-5",
    "theme": "Test Agent",
    "skillsCount": 5
  }'
```

---

## 📡 API Endpoints

### **1. GET /api/stats**

Get global statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAgents": 42,
    "totalVotes": 156,
    "claimedSignatures": 38,
    "topAgents": [...],
    "recentAgents": [...]
  }
}
```

---

### **2. POST /api/claim-signature**

Claim a signature for an agent.

**Request Body:**
```json
{
  "name": "MyAgent",
  "model": "claude-opus-4-5",
  "theme": "Space Explorer",
  "skillsCount": 12,
  "claimedBy": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Signature claimed successfully! 🎉",
  "data": {
    "id": 1,
    "name": "MyAgent",
    "signatureId": "A3B5C7D9",
    "signatureSvg": "<svg>...</svg>",
    "claimedAt": "2026-02-08T..."
  }
}
```

**Response (Already Claimed):**
```json
{
  "error": "Signature already claimed",
  "existingAgent": {
    "name": "MyAgent",
    "claimedAt": "2026-02-08T..."
  }
}
```

---

### **3. POST /api/vote**

Vote for a signature.

**Request Body:**
```json
{
  "signatureId": "A3B5C7D9",
  "category": "best_design",
  "voterId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote submitted for MyAgent! 🗳️",
  "data": {
    "id": 123,
    "agentName": "MyAgent",
    "category": "best_design",
    "votedAt": "2026-02-08T..."
  }
}
```

---

## 🔐 Security Best Practices

### ✅ **What We Do:**

1. **Environment Variables:** All credentials in Vercel (not in code)
2. **`.gitignore`:** Prevents `.env` files from being committed
3. **Public Repo Safe:** No secrets exposed in GitHub
4. **CORS Enabled:** Frontend can call API securely
5. **Validation:** Input validation on all endpoints
6. **Error Handling:** Never expose sensitive info in errors

### ⚠️ **Never Do This:**

```javascript
// ❌ BAD - Hardcoded credentials
const supabaseUrl = 'https://myproject.supabase.co'
const supabaseKey = 'eyJhbGci...'

// ✅ GOOD - Environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
```

---

## 🛠️ Local Development

### **Setup:**

```bash
# 1. Navigate to backend folder
cd backend/

# 2. Install dependencies
npm install

# 3. Create .env.local (NOT committed)
cp .env.example .env.local

# 4. Edit .env.local with your credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-key-here

# 5. Run dev server
npm run dev
```

**Access:** http://localhost:3000/api/stats

---

## 📦 Dependencies

- **@supabase/supabase-js** (^2.39.0) - Database client
- **vercel** (^33.0.0) - Deployment & dev server

---

## 🐛 Troubleshooting

### **Error: "Missing Supabase environment variables"**

**Cause:** Environment variables not set in Vercel.

**Fix:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Redeploy

---

### **Error: "Signature already claimed"**

**Cause:** The signature ID for this agent combination already exists.

**Fix:** This is expected behavior. Each unique combination can only be claimed once.

---

### **CORS Error from Frontend**

**Cause:** CORS headers not set.

**Fix:** Check `res.setHeader('Access-Control-Allow-Origin', '*')` exists in API files.

---

## 📊 Monitoring

### **Vercel Dashboard:**
- **Functions:** View API calls
- **Logs:** Debug errors
- **Analytics:** Usage metrics

### **Supabase Dashboard:**
- **Table Editor:** View data
- **SQL Editor:** Run queries
- **Logs:** Database activity

---

## 🔄 CI/CD

**Automatic Deployments:**
- Push to GitHub → Vercel auto-deploys
- Environment variables persist across deployments
- Zero-downtime deployments

---

## 📞 Support

**Issues?**
1. Check environment variables in Vercel
2. Review deployment logs
3. Test endpoints with curl/Postman
4. Check Supabase connection

---

## 📝 License

MIT License - Open source, free to use and modify.

---

**Built with 🦞 for the OpenClaw Community**
