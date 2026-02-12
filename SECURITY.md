# 🔒 SECURITY GUIDE - ClawdSign Backend

## ⚠️ CRITICAL: Protecting Your Credentials

This repo is **PUBLIC**. Anyone can see the code on GitHub.  
**NEVER** commit API keys, passwords, or credentials to GitHub!

---

## 🎯 How We Keep Credentials Safe

### ✅ **Environment Variables (Secure)**

Credentials are stored in **Vercel Environment Variables**, not in code.

**How it works:**
```javascript
// In code (lib/supabase.js):
const supabaseUrl = process.env.SUPABASE_URL  // ✅ SAFE
const supabaseKey = process.env.SUPABASE_ANON_KEY  // ✅ SAFE
```

**Where credentials are stored:**
- ✅ Vercel Dashboard → Environment Variables (encrypted, private)
- ✅ Local `.env.local` file (ignored by Git)

**Where credentials are NOT stored:**
- ❌ GitHub repository
- ❌ Hardcoded in JavaScript files
- ❌ Comments in code

---

## 📋 Step-by-Step: Setting Up Securely

### **1. Local Development**

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with YOUR credentials
# (This file is ignored by Git - safe!)
```

**`.env.local`:** (NOT committed to GitHub)
```env
SUPABASE_URL=https://your-actual-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-key-here
```

---

### **2. Production (Vercel)**

**Add credentials in Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: **Production**
   - Click **Save**
5. Repeat for `SUPABASE_ANON_KEY`

**Result:** Vercel encrypts and stores these securely. They're never visible in GitHub!

---

## 🛡️ .gitignore Protection

The `.gitignore` file prevents sensitive files from being committed:

```gitignore
# Environment variables - NEVER COMMIT!
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Test it:**
```bash
git status

# .env.local should NOT appear in the list
# If it does, it's already in .gitignore - safe!
```

---

## ✅ What's Safe to Commit?

### **Safe Files (can commit):**
- ✅ `api/*.js` - Code files (no credentials)
- ✅ `lib/supabase.js` - Uses env vars, not hardcoded
- ✅ `utils/*.js` - Pure functions
- ✅ `package.json` - Dependencies list
- ✅ `vercel.json` - Configuration (no secrets)
- ✅ `.env.example` - Template with fake values
- ✅ `README.md` - Documentation
- ✅ `.gitignore` - Ignore rules

### **NEVER Commit:**
- ❌ `.env` - Actual credentials
- ❌ `.env.local` - Local credentials
- ❌ `node_modules/` - Dependencies (too large)
- ❌ `.vercel/` - Deployment cache
- ❌ Any file with API keys, tokens, passwords

---

## 🔍 Checking for Exposed Secrets

### **Before Committing:**

```bash
# Check what will be committed
git status

# Review changes
git diff

# Look for these patterns (dangerous!):
# - https://xxx.supabase.co (actual URL)
# - eyJhbGci... (actual JWT token)
# - Any password or API key
```

### **If You Accidentally Commit Secrets:**

**Immediate action:**

1. **Rotate credentials:**
   - Supabase: Generate new anon key
   - Update in Vercel environment variables

2. **Remove from Git history:**
   ```bash
   # Remove sensitive commit
   git rebase -i HEAD~3  # Go back 3 commits
   # Mark commit as 'drop' or 'edit'
   # Force push (if repo is private)
   ```

3. **Better:** Delete repo and recreate (if public)

---

## 🎓 Education: Why This Matters

### **What Happens if Credentials Leak?**

**Supabase anon key exposed:**
- ⚠️ **Low risk** - Anon key is designed for public use
- ✅ Protected by Row Level Security (RLS)
- ✅ Limited permissions

**Supabase service_role key exposed:**
- 🚨 **CRITICAL RISK** - Full database access!
- 🚨 Attacker can read/delete all data!
- 🚨 **Never use service_role in frontend/backend**

**API keys exposed:**
- ⚠️ **Medium risk** - Depends on service
- 🚨 Potential: API quota abuse, billing fraud

---

## 📚 Best Practices Checklist

### **For Every New Project:**

- [ ] Create `.gitignore` before first commit
- [ ] Add `.env*` to `.gitignore`
- [ ] Use `.env.example` as template (safe to commit)
- [ ] Store actual credentials in `.env.local` (not committed)
- [ ] Use `process.env.VAR_NAME` in code (not hardcoded)
- [ ] Add environment variables in Vercel dashboard
- [ ] Review `git diff` before committing
- [ ] Never commit `node_modules/`

### **For This Project:**

- [x] `.gitignore` created ✅
- [x] All API files use `process.env` ✅
- [x] `.env.example` template provided ✅
- [x] README.md has security instructions ✅
- [ ] Supabase credentials added to Vercel (you do this)
- [ ] Test: `.env.local` not visible in GitHub (verify)

---

## 🔐 Additional Security Measures

### **1. Supabase Row Level Security (RLS)**

Enable RLS on all tables:

```sql
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
  ON agents FOR SELECT
  USING (true);

CREATE POLICY "Public insert access"
  ON agents FOR INSERT
  WITH CHECK (true);
```

### **2. Rate Limiting**

**TODO:** Add rate limiting to prevent API abuse.

Options:
- Vercel Edge Config
- Upstash Redis
- Cloudflare Workers

### **3. CORS Configuration**

Currently allows all origins (`*`). For production:

```javascript
// More restrictive CORS
res.setHeader('Access-Control-Allow-Origin', 'https://your-frontend.netlify.app')
```

---

## 🚨 Security Incident Response

### **If Credentials Are Exposed:**

**1. Immediate Actions (within 1 hour):**
- [ ] Rotate all exposed credentials
- [ ] Update Vercel environment variables
- [ ] Redeploy application
- [ ] Monitor database for suspicious activity

**2. Investigation (within 24 hours):**
- [ ] Review Supabase logs
- [ ] Check for unauthorized API calls
- [ ] Assess data breach impact

**3. Prevention (ongoing):**
- [ ] Review and improve security practices
- [ ] Enable additional monitoring
- [ ] Document incident and learnings

---

## 📞 Questions?

**"Is the anon key safe to expose?"**
- ✅ Yes, it's designed for client-side use
- ✅ But still use environment variables (best practice)
- ✅ Protected by Row Level Security (RLS)

**"What about the service_role key?"**
- 🚨 NEVER expose this!
- 🚨 Never use in frontend or public repos
- 🚨 Only use in secure, server-side environments

**"Can I use .env instead of .env.local?"**
- ⚠️ Avoid `.env` - often committed by mistake
- ✅ Use `.env.local` - clearly local, never committed

---

## ✅ Verification

**Before deploying, verify:**

```bash
# 1. Check .gitignore works
git status
# Should NOT show .env.local

# 2. Check no secrets in code
grep -r "supabase.co" api/ lib/ utils/
# Should only find process.env references

# 3. Check environment variables in Vercel
# Visit: Vercel Dashboard → Settings → Environment Variables
# Should see SUPABASE_URL and SUPABASE_ANON_KEY
```

---

**Security is not optional. Protect your data! 🔒**
