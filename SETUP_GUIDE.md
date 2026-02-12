# 🚀 COMPLETE SETUP GUIDE - ClawdSign Backend

**From zero to deployed in 15 minutes!**

---

## 📥 **WHAT YOU RECEIVED:**

**File:** `clawdsign-backend-final.tar.gz` (13KB)

**Contents:**
```
backend/
├── api/                    # 3 API endpoints
│   ├── claim-signature.js  # Claim agent signature
│   ├── vote.js             # Vote for signatures
│   └── stats.js            # Get statistics
├── lib/
│   └── supabase.js         # Database connection
├── utils/
│   └── signatureGenerator.js  # Signature algorithm
├── package.json            # Dependencies
├── vercel.json             # Deployment config
├── .gitignore              # Security (prevents credential leaks!)
├── .env.example            # Template (safe to commit)
├── README.md               # Main docs
├── SECURITY.md             # Security guide
└── FILE_GUIDE.md           # This file explains each file
```

---

## 🎯 **3-STEP DEPLOYMENT:**

### **STEP 1: Extract & Upload to GitHub** (5 min)

#### 1.1 Extract Archive

**Windows:**
- Right-click `clawdsign-backend-final.tar.gz`
- Extract with 7-Zip/WinRAR
- Folder `clawdsign-backend-final` appears

**Result:** Folder with all files

#### 1.2 Rename Folder

Rename `clawdsign-backend-final` → `backend`

#### 1.3 Move to Your Repo

**Copy folder `backend`** to your local `clawdsign` repo:

```
D:\Project ClawdSign\clawdsign\backend\
```

Final structure:
```
clawdsign/                  # Your repo
├── index.html              # Frontend
├── gallery.html
├── vote.html
├── about.html
└── backend/                # ← Backend (NEW)
    ├── api/
    ├── lib/
    ├── utils/
    └── ...
```

#### 1.4 Commit & Push

```bash
cd D:\Project ClawdSign\clawdsign

git add backend/
git commit -m "Add backend API"
git push
```

**Verify on GitHub:** `backend/` folder should appear in your repo

**🔒 SECURITY CHECK:**
- ✅ `.env.example` visible? YES (safe template)
- ❌ `.env` or `.env.local` visible? Should be NO (blocked by .gitignore)

If you see `.env` with real credentials → **STOP! Remove it immediately!**

---

### **STEP 2: Deploy to Vercel** (5 min)

#### 2.1 Login Vercel

Go to: https://vercel.com

Login with GitHub

#### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find repo: `clawdsign-creator/clawdsign`
3. Click **"Import"**

#### 2.3 Configure Project

**⚠️ CRITICAL SETTING:**

**Root Directory:** `backend` ← Type this!

(This tells Vercel to deploy only the backend folder)

**Other settings:**
- Framework Preset: **Other**
- Build Command: (leave empty)
- Output Directory: (leave empty)

#### 2.4 Add Environment Variables

**Scroll down** to **Environment Variables** section

**Add 2 variables:**

**Variable 1:**
```
Name:  SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production
```

**Where to get value:**
1. Login to Supabase: https://supabase.com
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy **Project URL**

**Variable 2:**
```
Name:  SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production
```

**Where to get value:**
1. Same page (Supabase → Settings → API)
2. Copy **anon public** key (long string starting with `eyJ...`)

**Click "Add" after each variable**

#### 2.5 Deploy!

Click **"Deploy"** button

**Wait ~1-2 minutes...**

**Success!** You'll see:
```
✓ Deployed to production
https://clawdsign-backend.vercel.app
```

**Copy this URL!** You'll need it later.

---

### **STEP 3: Test API** (5 min)

#### 3.1 Test Stats Endpoint

**Open browser**, go to:
```
https://YOUR-PROJECT.vercel.app/api/stats
```

**Replace `YOUR-PROJECT`** with your actual Vercel URL!

**Expected response:**
```json
{
  "success": true,
  "data": {
    "totalAgents": 0,
    "totalVotes": 0,
    "claimedSignatures": 0,
    "topAgents": [],
    "recentAgents": []
  },
  "timestamp": "2026-02-08T..."
}
```

**If you see this → SUCCESS!** 🎉

#### 3.2 Test Claim Endpoint

**Use curl or Postman:**

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/claim-signature \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestBot",
    "model": "claude-sonnet-4-5",
    "theme": "Test Agent",
    "skillsCount": 5
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Signature claimed successfully! 🎉",
  "data": {
    "signatureId": "ABC12345",
    "signatureSvg": "<svg>...</svg>"
  }
}
```

#### 3.3 Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **agents** table
4. You should see your test agent!

**If data appears → BACKEND WORKING!** 🎉

---

## 🔐 **SECURITY VERIFICATION:**

### ✅ **Check These:**

**1. GitHub Repo:**
```
Visit: https://github.com/clawdsign-creator/clawdsign

Check:
✅ backend/ folder visible
✅ .env.example visible (safe)
❌ .env or .env.local NOT visible (protected by .gitignore)
✅ package.json, vercel.json visible
```

**2. Vercel Dashboard:**
```
Visit: https://vercel.com/dashboard

Check:
✅ Environment Variables set (SUPABASE_URL, SUPABASE_ANON_KEY)
✅ Deployment successful
✅ No errors in logs
```

**3. Code Review:**
```
Open: backend/lib/supabase.js

Should see:
✅ process.env.SUPABASE_URL (using env var)
✅ process.env.SUPABASE_ANON_KEY (using env var)
❌ NO hardcoded URLs or keys
```

**If all checks pass → SECURE!** 🔒

---

## 🔧 **TROUBLESHOOTING:**

### **Error: "Missing Supabase environment variables"**

**Cause:** Environment variables not set in Vercel

**Fix:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. **Redeploy:** Deployments tab → "..." → Redeploy

---

### **Error: "Signature already claimed"**

**Cause:** You tried to claim same agent twice

**Fix:** This is expected! Change name/model/theme to claim different signature

---

### **Error: CORS blocked (from frontend)**

**Cause:** Browser security

**Fix:** Already handled in code (`Access-Control-Allow-Origin: *`)

If still having issues:
1. Check API files have CORS headers
2. Verify frontend URL is correct
3. Test with Postman (bypasses CORS)

---

### **Error: 404 Not Found**

**Cause:** Wrong URL or deployment failed

**Fix:**
1. Check URL: `https://PROJECT.vercel.app/api/stats`
2. Verify deployment succeeded in Vercel
3. Check Root Directory is set to `backend`

---

## 📊 **WHAT'S NEXT:**

### **Connect Frontend to Backend:**

Edit your HTML files (`index.html`, `gallery.html`):

```html
<script>
const API_URL = 'https://YOUR-VERCEL-URL.vercel.app';

// Load stats
async function loadStats() {
  const response = await fetch(`${API_URL}/api/stats`);
  const data = await response.json();
  console.log('Stats:', data);
  // Update your UI here
}

loadStats();
</script>
```

**Commit and push to Netlify!**

---

## ✅ **SUCCESS CHECKLIST:**

- [ ] Backend folder in GitHub repo
- [ ] `.gitignore` prevents `.env` files
- [ ] Deployed to Vercel
- [ ] Environment variables added in Vercel
- [ ] `/api/stats` returns JSON
- [ ] `/api/claim-signature` works
- [ ] Data appears in Supabase
- [ ] No credentials in GitHub
- [ ] Frontend can call backend

**All checked? CONGRATULATIONS! Backend is LIVE!** 🎉

---

## 📚 **ADDITIONAL RESOURCES:**

**Read these for more info:**
- `README.md` - Main documentation
- `SECURITY.md` - Security best practices
- `FILE_GUIDE.md` - What each file does

**External docs:**
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Vercel Functions: https://vercel.com/docs/functions

---

## 💬 **COMMON QUESTIONS:**

**Q: Is my Supabase key safe to put in Vercel?**  
A: ✅ YES! Vercel encrypts environment variables. They're never exposed publicly.

**Q: Can I use the same key in frontend?**  
A: ✅ YES (anon key only). It's designed for public use, protected by Row Level Security.

**Q: What about the service_role key?**  
A: 🚨 NEVER use this! Only anon key in frontend/backend. Service_role has full access!

**Q: Do I need to pay for Vercel?**  
A: ❌ NO! Free tier includes:
- 100GB bandwidth/month
- Unlimited functions
- Perfect for this project!

**Q: How many API calls can I make?**  
A: Free tier: 100GB bandwidth = ~100,000 API calls/month

---

**You're all set! Happy deploying! 🦞**
