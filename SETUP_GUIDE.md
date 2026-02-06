# 🚀 Setup Guide - Sales Beat Mobile Chat Prototype

Complete guide to get your Interactive Mobile Chat Prototype running.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get from OpenAI Platform](https://platform.openai.com/api-keys)
- **Terminal/Command Prompt** access

---

## 🔧 Step 1: Install Backend Dependencies

```bash
# Navigate to the project
cd ~/Desktop/sales-beat-mobile-chat

# Go to backend folder
cd backend

# Install dependencies
npm install

# Expected output: All packages installed successfully
```

---

## 🔑 Step 2: Configure OpenAI API Key

```bash
# Still in backend folder
# Copy the example env file
cp .env.example .env

# Open .env file and add your API key
# Use any text editor (nano, vim, or VS Code)
nano .env
```

**Edit the .env file:**
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
PORT=5000
```

**Save and close** (Ctrl+X, then Y, then Enter for nano)

⚠️ **Important**: Never commit your `.env` file to version control!

---

## 🎨 Step 3: Install Frontend Dependencies

```bash
# Go to frontend folder
cd ../frontend

# Install dependencies
npm install

# Expected output: All packages installed successfully
```

---

## ▶️ Step 4: Start the Application

### Option A: Run Both Servers Separately (Recommended for testing)

**Terminal 1 - Start Backend:**
```bash
cd ~/Desktop/sales-beat-mobile-chat/backend
npm start

# Expected output:
# ✅ Sales Beat Chat API running on port 5000
# 📡 API Endpoint: http://localhost:5000
# 💬 Ready to accept chat requests
```

**Terminal 2 - Start Frontend:**
```bash
cd ~/Desktop/sales-beat-mobile-chat/frontend
npm start

# Expected output:
# Compiled successfully!
# Local: http://localhost:3000
# Browser will open automatically
```

### Option B: Run Both Simultaneously

```bash
# From project root
cd ~/Desktop/sales-beat-mobile-chat

# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm start
```

---

## 🎉 Step 5: Access the Application

Once both servers are running:
- **Frontend**: Opens automatically at `http://localhost:3000`
- **Backend API**: Running at `http://localhost:5000`

You should see:
- Mobile chat interface
- RM/Manager persona toggle
- Quick action buttons
- Welcome message from AI

---

## 💬 Step 6: Start Testing Conversations

### For RM Persona:
Try these conversations:
1. "Generate my productivity plan"
2. "Complete WIP empanelment"
3. "Which CPs need urgent attention?"
4. "How to activate dormant CPs?"
5. "Generate pitch for Malhotra Finance"

### For Manager Persona:
Switch persona (top toggle) and try:
1. "Show team performance"
2. "Who needs coaching on CP activation?"
3. "Generate coaching plan for Priya"

---

## 🔄 Step 7: Test Re-planning Capability

**Scenario Test:**
1. Start: "Generate my productivity plan"
2. Respond: "✅ Completed task 1 - disbursement done"
3. AI will re-prioritize and update your plan
4. Try: "Only 3 hours left today"
5. AI will generate time-optimized plan

---

## 📝 Step 8: Export and Refine Prompts

### View Current Prompts:
```bash
# In browser or via curl
curl http://localhost:5000/api/prompts/current
```

### Export Prompts:
```bash
curl http://localhost:5000/api/prompts/export
# Saves to: prompts-export/system-prompt-[date].md
```

### View Conversation Logs:
```bash
curl http://localhost:5000/api/conversations/logs
# Lists all conversation sessions
```

### To Refine Prompts:
1. **Test conversations** in the chat interface
2. **Identify issues** (e.g., "AI didn't prioritize correctly")
3. **Edit prompt file**: `backend/prompts/systemPrompt.js`
4. **Restart backend**: `Ctrl+C` then `npm start`
5. **Test again** in the chat

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if OpenAI API key is set
cat backend/.env

# Should show: OPENAI_API_KEY=sk-...

# Check if port 5000 is available
lsof -i :5000

# If occupied, change PORT in .env
```

### Frontend won't connect to backend
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"..."}

# Check frontend API_URL in src/App.js
# Should be: const API_URL = 'http://localhost:5000/api';
```

### OpenAI API Errors
```bash
# Error: "Invalid API key"
# - Verify your API key is correct
# - Check you have credits in your OpenAI account

# Error: "Rate limit exceeded"
# - Wait a few minutes
# - Check your OpenAI usage limits

# Error: "Model not found"
# - Ensure you have access to GPT-4
# - Or change to 'gpt-3.5-turbo' in backend/server.js line 169
```

### No data showing for RM
```bash
# Check mock data files exist
ls backend/data/

# Should see:
# mockRMs.json
# mockCPs.json
# mockLeads.json
```

---

## 📊 Understanding the Mock Data

### RMs (5 profiles):
- **RM001** - Suresh Kumar (Medium performer, 14 CPs)
- **RM002** - Priya Sharma (Low performer, needs coaching)
- **RM003** - Amit Desai (High performer, 18 CPs)
- **RM004** - Rajesh Patel (New, struggling)
- **RM005** - Neha Reddy (High performer, close to target)

### CPs (10 profiles):
- **DIAMOND**: Kumar Enterprises, Rajesh Traders
- **GOLD**: Verma Associates, Sharma Finance, Mehta DSA
- **SILVER**: Gupta Associates, Singh Consultants
- **DORMANT**: Khan Finance
- **WIP**: Malhotra Finance, Patel Enterprises

### Leads (10 at various stages):
- **Disbursement Ready**: L3421, L3478 (High priority)
- **Query**: L3398, L3389 (Needs resolution)
- **Login**: L3445, L3456, L3501 (Pipeline)
- **Sanction**: L3467 (Processing)
- **LD**: L3412 (Verification pending)

---

## 🎓 Next Steps After Setup

1. **Test All Scenarios**
   - RM productivity planning
   - CP empanelment guidance
   - Activation strategies
   - Manager coaching

2. **Identify Prompt Improvements**
   - Note where AI responses aren't perfect
   - List what needs to be more specific
   - Document missing scenarios

3. **Refine System Prompt**
   - Edit `backend/prompts/systemPrompt.js`
   - Add more examples
   - Adjust tone and style
   - Test improvements

4. **Export Final Prompts**
   - Once satisfied, export prompts
   - Use GET `/api/prompts/export`
   - Document conversation patterns
   - Prepare for production integration

5. **Share Feedback**
   - Document conversation quality
   - Note successful interactions
   - List areas needing improvement
   - Prepare requirements for full app

---

## 📁 Project Structure Reference

```
sales-beat-mobile-chat/
├── backend/                      # Express + OpenAI server
│   ├── data/                     # Mock data (RMs, CPs, Leads)
│   ├── prompts/                  # AI prompts (EDITABLE)
│   │   └── systemPrompt.js       # Main prompt to refine
│   ├── server.js                 # Main backend server
│   ├── package.json
│   └── .env                      # Your API key (DO NOT SHARE)
├── frontend/                     # React mobile UI
│   ├── src/
│   │   ├── App.js                # Main chat component
│   │   ├── App.css               # Mobile styling
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── conversation-logs/            # Auto-generated conversation logs
├── prompts-export/               # Exported prompt versions
├── README.md                     # Project overview
└── SETUP_GUIDE.md               # This file
```

---

## 💡 Tips for Best Results

1. **Be Specific in Conversations**
   - Instead of: "Help me"
   - Try: "Generate productivity plan for today"

2. **Test Re-planning**
   - Simulate real RM behavior
   - Report task completions/blockers
   - See how AI adapts

3. **Switch Personas**
   - Test both RM and Manager views
   - Different personas get different responses

4. **Check Conversation Logs**
   - Review in `conversation-logs/` folder
   - Analyze AI response patterns
   - Identify areas for improvement

5. **Iterate on Prompts**
   - Small changes can have big impact
   - Test after each modification
   - Keep successful versions

---

## 🆘 Need Help?

**Common Issues:**
- **Port already in use**: Change PORT in `.env`
- **API errors**: Check OpenAI account status
- **No conversations saving**: Check write permissions on `conversation-logs/`
- **Frontend blank**: Check browser console for errors

**Logs Location:**
- Backend logs: Terminal where `npm start` is running
- Frontend errors: Browser Developer Console (F12)
- Conversation logs: `conversation-logs/session-*.json`

---

## 🎯 Success Checklist

- [ ] Both backend and frontend running
- [ ] OpenAI API key working (responses generating)
- [ ] Can switch between RM and Manager personas
- [ ] Quick actions working
- [ ] Conversations being logged
- [ ] Mock data displaying correctly
- [ ] Beat plan generation working
- [ ] Re-planning responses appropriate
- [ ] Ready to test and refine prompts

---

**You're all set! Start testing conversations and refining your AI prompts.** 🚀

When ready, use the refined prompts for your production application!
