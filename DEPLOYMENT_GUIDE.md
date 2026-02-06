# 🚀 ARYA Deployment Guide
**Deploy ARYA Sales Assistant to Production**

---

## ✅ **COMPLETED SO FAR:**
- [x] Created .gitignore
- [x] Initialized Git repository
- [x] Committed all code locally

---

## 📋 **NEXT STEPS:**

### **STEP 1: Create GitHub Repository** (3 mins)

1. **Go to GitHub:**
   - Open: https://github.com/new
   - Sign in with: **palarapupavankumar-dev**

2. **Create Repository:**
   - Repository name: `arya-sales-assistant`
   - Description: `ARYA - AI Sales Productivity Assistant`
   - Visibility: **Private** (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)
   - Click "Create repository"

3. **Copy the repository URL:**
   ```
   https://github.com/palarapupavankumar-dev/arya-sales-assistant.git
   ```

4. **Push code from terminal:**
   ```bash
   cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat
   
   git remote add origin https://github.com/palarapupavankumar-dev/arya-sales-assistant.git
   
   git branch -M main
   
   git push -u origin main
   ```
   
   **Note:** You may be prompted to enter GitHub credentials

---

### **STEP 2: Deploy Backend to Railway** (10 mins)

1. **Go to Railway:**
   - Open: https://railway.app/
   - Sign in (with GitHub)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select: `palarapupavankumar-dev/arya-sales-assistant`
   - Click "Deploy"

3. **Configure Backend Service:**
   - Railway will detect your project
   - Click on the deployed service
   - Go to "Settings" tab
   
4. **Set Root Directory:**
   - Find "Root Directory" setting
   - Set to: `backend`
   - Save changes

5. **Add Environment Variables:**
   - Go to "Variables" tab
   - Add these variables:
   
   ```
   ANTHROPIC_API_KEY=<your-anthropic-key-from-backend/.env>
   PORT=5000
   NODE_ENV=production
   ```
   
6. **Get Backend URL:**
   - Go to "Settings" tab
   - Find "Domains" section
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://arya-backend-production.up.railway.app`)
   - **SAVE THIS URL** - you'll need it for frontend

7. **Verify Deployment:**
   - Check "Deployments" tab
   - Should show "Success"
   - Test: Open `<YOUR_BACKEND_URL>/api/health`
   - Should return: `{"status":"ok","message":"ARYA Sales Beat Chat API is running"}`

---

### **STEP 3: Deploy Frontend to Vercel** (10 mins)

1. **Go to Vercel:**
   - Open: https://vercel.com/
   - Sign in (with GitHub)

2. **Import Project:**
   - Click "Add New..."
   - Select "Project"
   - Import Git Repository: `palarapupavankumar-dev/arya-sales-assistant`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend` (click "Edit" and set this)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
   ```
   Name: REACT_APP_API_URL
   Value: <YOUR_RAILWAY_BACKEND_URL>
   ```
   Example: `https://arya-backend-production.up.railway.app`
   
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build

6. **Get Frontend URL:**
   - After deployment completes
   - Copy the URL (e.g., `https://arya-sales-assistant.vercel.app`)

7. **Verify Deployment:**
   - Open the Vercel URL
   - Should see ARYA interface
   - Try selecting an RM
   - Test a conversation

---

### **STEP 4: Update Frontend API URL** (if needed)

If frontend shows connection errors:

1. **Check Frontend Environment:**
   - Go to Vercel project
   - Settings → Environment Variables
   - Verify `REACT_APP_API_URL` is correct
   - Should be: `https://<your-railway-domain>.railway.app`
   - **NO trailing slash**

2. **Redeploy if changed:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### **STEP 5: Enable CORS on Backend** (if needed)

If you see CORS errors:

1. **Check backend/server.js** (already configured)
   - CORS should allow all origins in production
   - Already set up: `app.use(cors())`

2. **If issues persist:**
   - Go to Railway project
   - Add environment variable:
   ```
   CORS_ORIGIN=https://arya-sales-assistant.vercel.app
   ```

---

## 🎉 **PRODUCTION URLS:**

After deployment, save these URLs:

**Frontend (Vercel):**
```
https://arya-sales-assistant.vercel.app
```

**Backend (Railway):**
```
https://arya-backend-production-XXXX.up.railway.app
```

---

## 🧪 **TESTING PRODUCTION:**

1. **Open Frontend URL**
2. **Select RM:** Choose RM3 (mid performer)
3. **Test Chat:**
   - Say: "Hi, show me my performance"
   - Should see persona-based response
4. **Generate Beat Plan:**
   - Say: "Plan to improve Target achievement & incentives"
   - Should generate comprehensive plan

---

## 🔧 **TROUBLESHOOTING:**

### **Frontend Not Loading:**
- Check Vercel deployment logs
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend URL has no trailing slash

### **Backend API Errors:**
- Check Railway deployment logs
- Verify `ANTHROPIC_API_KEY` is set
- Test `/api/health` endpoint directly

### **CORS Errors:**
- Check Railway environment variables
- Verify `cors()` middleware in server.js
- Check browser console for exact error

### **Chat Not Working:**
- Verify Anthropic API key is valid
- Check Railway logs for API errors
- Test backend endpoint: `/api/session/start`

---

## 📝 **SHARING ACCESS:**

To share with team members:

1. **Share Frontend URL:**
   ```
   https://arya-sales-assistant.vercel.app
   ```

2. **Add Vercel Team Members** (optional):
   - Go to Vercel project settings
   - Team → Invite members

3. **Add Railway Team Members** (optional):
   - Go to Railway project settings
   - Members → Invite

---

## 🔄 **FUTURE UPDATES:**

When you make code changes:

```bash
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat

git add .
git commit -m "Your update message"
git push origin main
```

**Both Railway and Vercel will auto-deploy** from the main branch!

---

## 💰 **COST BREAKDOWN:**

- **Railway:** Free $5/month credits (enough for testing)
- **Vercel:** Free tier (unlimited for personal projects)
- **Anthropic API:** Pay per use (~$0.03 per 1K tokens)

**Estimated monthly cost for 5-10 users:** ~$10-20

---

**Need help? Check deployment logs or contact support!**
