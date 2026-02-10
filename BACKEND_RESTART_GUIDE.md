# 🔄 BACKEND SERVER RESTART GUIDE

## ⚠️ CRITICAL: Why You Must Restart

**When you change prompt files, the backend server MUST be restarted for changes to take effect!**

**Reason:**
```javascript
// server.js loads prompts ONCE at startup
const ARYA_TASK_PROMPT = require('./prompts/aryaTaskPrompt');
```
- Prompts loaded into memory when server starts
- File changes don't auto-reload
- **Refreshing browser only reloads frontend, NOT backend!**

---

## 🎯 METHOD 1: Find Running Backend Terminal (EASIEST)

### Step 1: Look for Terminal Window

**What to look for:**
- A terminal window that shows: `✅ ARYA Sales Beat Chat API running on port 5000`
- OR shows: `Server running at http://localhost:5000`
- OR just shows some activity/logs related to backend

**Where to look:**
1. **VS Code:** Bottom panel → "Terminal" tab → Look through open terminals
2. **Separate Terminal App:** Check your open Terminal windows
3. **iTerm/Other:** Check all terminal sessions

### Step 2: Restart the Server

**Once you find the backend terminal:**

```bash
1. Press: Ctrl+C  (or Cmd+C on Mac)
   # This STOPS the server
   # You'll see: "Server stopped" or cursor returns

2. Then type: npm start
   # This STARTS the server fresh
   
3. Press: Enter
```

**Success indicators:**
```
✅ ARYA Sales Beat Chat API running on port 5000
📡 API Endpoint: http://localhost:5000
💬 Ready for intelligent conversations with Claude AI
```

---

## 🎯 METHOD 2: Can't Find Terminal? Start Fresh

### Option A: Check if Backend is Running

```bash
# Open any terminal and type:
lsof -i :5000
```

**If you see output like:**
```
node    12345  user   23u  IPv4  ...  TCP *:5000 (LISTEN)
```

**Then kill it:**
```bash
kill -9 12345  # Replace 12345 with actual PID number
```

### Option B: Start Backend Fresh

```bash
# Open new terminal and run:
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/backend
npm start
```

---

## 🎯 METHOD 3: Using VS Code Terminal (RECOMMENDED)

### Step 1: Open VS Code

1. Open Visual Studio Code
2. Open folder: `/Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat`

### Step 2: Open Terminal Panel

- **Menu:** View → Terminal
- **OR Keyboard:** `Ctrl + `` ` (backtick key)
- **OR:** Click "+" at bottom to create new terminal

### Step 3: Check Existing Terminals

- Look at terminal tabs at top-right of terminal panel
- Click through each tab to see if backend is running
- Look for: `port 5000` or `ARYA Sales Beat`

### Step 4: Restart Backend

**If found in existing terminal:**
```bash
Ctrl+C  # Stop
npm start  # Restart
```

**If NOT found, create new:**
```bash
cd backend
npm start
```

---

## ✅ VERIFICATION - Confirm Backend is Running

### Test 1: Terminal Output

You should see:
```
> arya-backend@1.0.0 start
> node server.js

✅ ARYA Sales Beat Chat API running on port 5000
📡 API Endpoint: http://localhost:5000
💬 Ready for intelligent conversations with Claude AI
```

### Test 2: Browser Test

Open browser and go to:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "ARYA Sales Beat Chat API is running"
}
```

### Test 3: Frontend Connection

1. Go to: `http://localhost:3000`
2. Select RM
3. Should see welcome message
4. If it works → Backend is running!

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Port 5000 already in use"

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace 12345 with actual PID)
kill -9 12345

# Then restart
npm start
```

### Issue 2: "Module not found" Error

**Solution:**
```bash
# Reinstall dependencies
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/backend
npm install
npm start
```

### Issue 3: "Cannot find module './prompts/aryaTaskPrompt'"

**Solution:**
```bash
# Verify file exists
ls -la prompts/

# Should show:
# aryaSystemPrompt.js
# aryaTaskPrompt.js

# If missing, something went wrong - let me know
```

### Issue 4: Backend Starts but Frontend Can't Connect

**Solution:**
```bash
# Check CORS settings
# Verify API_URL in frontend:
cat ../frontend/src/App.js | grep API_URL

# Should be: http://localhost:5000/api
```

---

## 📋 COMPLETE RESTART CHECKLIST

Use this every time you change prompts:

- [ ] Stop backend server (Ctrl+C)
- [ ] Restart backend (npm start)
- [ ] See success message (port 5000 running)
- [ ] Verify health endpoint works
- [ ] Refresh frontend browser
- [ ] Start NEW chat session (select RM again)
- [ ] Test the changes you made

---

## 🎬 QUICK START SCRIPT

**Save this as a bookmark for easy restart:**

```bash
#!/bin/bash
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/backend
pkill -f "node server.js"  # Kill old instance
npm start  # Start fresh
```

**Or run manually:**
```bash
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/backend && pkill -f "node server.js" && npm start
```

---

## 💡 PRO TIPS

### Tip 1: Use Two Terminal Windows
```
Terminal 1: Backend (port 5000)
Terminal 2: Frontend (port 3000)
```

### Tip 2: Never Close Backend Terminal
- Keep it running
- Just Ctrl+C and npm start when needed
- Easy to find later

### Tip 3: Check Logs
- Backend terminal shows API requests
- Look for errors in red
- Successful requests in green/white

### Tip 4: Frontend Auto-Reloads, Backend Doesn't
- Change React code → Auto-refreshes
- Change prompt files → Must restart backend

---

## 🆘 STILL STUCK?

### Can't Find Terminal at All?

**Start everything fresh:**

```bash
# Terminal 1 - Backend
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/backend
npm start

# Terminal 2 - Frontend  
cd /Users/Pavan.Palarapu/Desktop/sales-beat-mobile-chat/frontend
npm start
```

### Need Visual Help?

1. Take screenshot of your screen
2. Show me what terminals/windows you see
3. I'll guide you step-by-step

---

## ✅ AFTER RESTART - TESTING GUIDE

### Test 1: CP Visit Probing
1. Generate beat plan
2. Say: "CP visit done"
3. **Expected:** Should ask which CP, commitment, details
4. **NOT:** Generic "Done ✅"

### Test 2: Add CP Clarification
1. Say: "Add CP to plan" or just "CP6"
2. **Expected:** Should ask "What do you want to do with CP6?"
3. **NOT:** Directly add without asking

### Test 3: Invalid CP
1. Say: "CP99" (doesn't exist)
2. **Expected:** "I don't have CP99, here are your actual CPs"
3. **NOT:** Assuming or making things up

---

**Good luck! 🚀**

**Remember:** Always restart backend after changing prompts!
