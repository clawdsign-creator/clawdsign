# 📄 FILE EXPLANATION GUIDE

Complete explanation of every file in the backend.

---

## 📁 **Root Files**

### **package.json**
**What:** Dependencies and project metadata  
**Edit:** Only to add new packages  
**Credentials:** ❌ No credentials  

**What's inside:**
- Project name and version
- Dependencies: `@supabase/supabase-js` (database client)
- Scripts: `npm run dev`, `npm run deploy`

**You need to edit:** NO (leave as-is)

---

### **vercel.json**
**What:** Vercel deployment configuration  
**Edit:** Only if changing deployment settings  
**Credentials:** ❌ No credentials  

**What's inside:**
- Tells Vercel to deploy files in `api/` folder
- Routes configuration
- Build settings

**You need to edit:** NO (leave as-is)

---

### **.gitignore**
**What:** Files to exclude from Git  
**Edit:** Add more ignore patterns if needed  
**Credentials:** ❌ No credentials  

**What's inside:**
- `node_modules/` - Don't commit dependencies
- `.env*` - Don't commit credentials!
- `.vercel/` - Don't commit deployment cache

**You need to edit:** NO (already perfect)

**IMPORTANT:** This file protects your secrets!

---

### **.env.example**
**What:** Template for environment variables  
**Edit:** NO - This is just a template  
**Credentials:** ❌ Safe (fake values only)  

**What's inside:**
```env
SUPABASE_URL=https://your-project-id.supabase.co  # ← Placeholder
SUPABASE_ANON_KEY=eyJ...  # ← Placeholder
```

**You need to edit:** NO  
**Instead:** Copy to `.env.local` and put REAL values there

**Safe to commit:** ✅ YES (it's just a template)

---

## 🗄️ **lib/ Folder**

### **lib/supabase.js**
**What:** Database connection setup  
**Edit:** NO (already configured)  
**Credentials:** ✅ Uses environment variables (secure)  

**What's inside:**
```javascript
// Gets credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// Creates database client
const supabase = createClient(supabaseUrl, supabaseKey)
```

**You need to edit:** NO

**Important:**
- ✅ Credentials come from `process.env` (safe)
- ❌ NO hardcoded credentials in file
- ✅ Safe to commit to GitHub

---

## 🛠️ **utils/ Folder**

### **utils/signatureGenerator.js**
**What:** Algorithm to generate unique signatures  
**Edit:** Only if changing signature design  
**Credentials:** ❌ No credentials  

**What's inside:**
- Color schemes for different AI models
- Mathematical algorithm to generate SVG
- Deterministic: same input = same output

**You need to edit:** NO (unless changing design)

**How it works:**
```javascript
Input: { name: "Molty", model: "claude-opus-4-5", theme: "Space", skillsCount: 12 }
↓
Algorithm: Generate hash → Create nodes → Draw lines → Create SVG
↓
Output: { svg: "<svg>...</svg>", signatureId: "A3B5C7D9", hash: 123456 }
```

---

## 🌐 **api/ Folder**

All files in `api/` are **Vercel Functions** (serverless endpoints).

### **api/claim-signature.js**
**What:** API endpoint to claim a signature  
**Edit:** Only to change business logic  
**Credentials:** ✅ Uses environment variables  

**Endpoint:** `POST /api/claim-signature`

**What it does:**
1. Receives agent data (name, model, theme, skillsCount)
2. Validates input
3. Generates unique signature
4. Checks if already claimed
5. Saves to database
6. Returns signature ID and SVG

**You need to edit:** NO

**Request example:**
```json
{
  "name": "MyBot",
  "model": "claude-opus-4-5",
  "theme": "Helper",
  "skillsCount": 10
}
```

**Response example:**
```json
{
  "success": true,
  "data": {
    "signatureId": "ABC12345",
    "signatureSvg": "<svg>...</svg>"
  }
}
```

---

### **api/vote.js**
**What:** API endpoint to vote for signatures  
**Edit:** Only to change voting logic  
**Credentials:** ✅ Uses environment variables  

**Endpoint:** `POST /api/vote`

**What it does:**
1. Receives signature ID and category
2. Validates signature exists
3. Checks for duplicate votes
4. Records vote in database
5. Returns confirmation

**You need to edit:** NO

**Request example:**
```json
{
  "signatureId": "ABC12345",
  "category": "best_design",
  "voterId": "user@example.com"
}
```

---

### **api/stats.js**
**What:** API endpoint to get statistics  
**Edit:** Only to add new stats  
**Credentials:** ✅ Uses environment variables  

**Endpoint:** `GET /api/stats`

**What it does:**
1. Counts total agents
2. Counts total votes
3. Gets top 10 voted agents
4. Gets recent agents
5. Returns JSON data

**You need to edit:** NO

**Response example:**
```json
{
  "success": true,
  "data": {
    "totalAgents": 42,
    "totalVotes": 156,
    "topAgents": [...]
  }
}
```

---

## 🔐 **Environment Variables (NOT in Files)**

These are stored in **Vercel Dashboard**, not in code:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase → Settings → API |

**How to set:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable
3. Save

**Important:** Never put these in files! Use Vercel dashboard only.

---

## 📚 **Documentation Files**

### **README.md**
**What:** Main documentation  
**Edit:** Add notes, usage examples  
**Credentials:** ❌ No credentials  

Contains:
- Project overview
- Deployment guide
- API documentation
- Security instructions

---

### **SECURITY.md** (this file!)
**What:** Security best practices  
**Edit:** Add more security measures  
**Credentials:** ❌ No credentials  

Contains:
- How to protect credentials
- What to commit / not commit
- Security checklist

---

## ✅ **Files You NEED to Edit**

### **None!** 

All files are ready to use. You only need to:

1. **Copy folder to GitHub**
2. **Add credentials in Vercel Dashboard** (not in files!)
3. **Deploy**

---

## ❌ **Files You Should NEVER Edit**

Unless you know what you're doing:

- ❌ `lib/supabase.js` - Database connection
- ❌ `utils/signatureGenerator.js` - Signature algorithm
- ❌ `vercel.json` - Deployment config
- ❌ `.gitignore` - Security protection

---

## 🎯 **Quick Reference**

**Want to:**

**→ Add new API endpoint?**
Create new file in `api/` folder (e.g., `api/my-endpoint.js`)

**→ Change signature design?**
Edit `utils/signatureGenerator.js`

**→ Add database table?**
Update queries in `api/*.js` files

**→ Add dependency?**
Add to `package.json` dependencies

**→ Change CORS settings?**
Edit `res.setHeader()` lines in `api/*.js`

**→ Add credentials?**
Add in Vercel Dashboard (NOT in files!)

---

## 🔍 **File Safety Summary**

| File | Has Credentials? | Safe to Commit? |
|------|------------------|-----------------|
| `package.json` | ❌ No | ✅ YES |
| `vercel.json` | ❌ No | ✅ YES |
| `.gitignore` | ❌ No | ✅ YES |
| `.env.example` | ❌ No (fake only) | ✅ YES |
| `lib/supabase.js` | ❌ No (uses env vars) | ✅ YES |
| `utils/*.js` | ❌ No | ✅ YES |
| `api/*.js` | ❌ No (uses env vars) | ✅ YES |
| `README.md` | ❌ No | ✅ YES |
| `.env.local` | ✅ YES (real creds!) | ❌ **NEVER!** |
| `node_modules/` | ❌ No | ❌ NO (too large) |

**Key principle:** If file uses `process.env.*`, it's safe!

---

**Summary: ALL files in this backend are safe to commit to public GitHub! 🎉**
