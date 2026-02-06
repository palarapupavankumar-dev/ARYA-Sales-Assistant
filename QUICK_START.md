# ⚡ QUICK START - Get Chat Running in 2 Minutes

## ❗ IMPORTANT: You Need Your OpenAI API Key

**Before we can start the chat, please:**

1. Get your OpenAI API key from: https://platform.openai.com/api-keys
2. Open this file: `backend/.env`
3. Replace `your_openai_api_key_here` with your actual key

**Example:**
```
OPENAI_API_KEY=sk-proj-abc123...your-actual-key
PORT=5000
```

---

## 🚀 Once API Key is Added, Run These Commands:

### Terminal 1 - Start Backend:
```bash
cd ~/Desktop/sales-beat-mobile-chat/backend
npm start
```

### Terminal 2 - Start Frontend:
```bash
cd ~/Desktop/sales-beat-mobile-chat/frontend
npm start
```

---

## 🌐 Access Your Chat

**Once both servers start:**
- Frontend will auto-open at: `http://localhost:3000`
- Or manually visit: `http://localhost:3000`

**You should see:**
- Mobile chat interface
- Toggle between RM and Manager
- Quick action buttons
- AI assistant ready to chat

---

## 💬 Try These First Conversations:

1. "Generate my productivity plan"
2. "Which CPs need urgent attention?"
3. "Complete WIP empanelment for Malhotra Finance"
4. "✅ Task completed - disbursement done" (to test re-planning)

---

## ⚠️ Troubleshooting

**No API key?** 
- Chat won't work without OpenAI API key
- Get one free at platform.openai.com

**Port already in use?**
- Change PORT=5000 to PORT=5001 in backend/.env

**Frontend won't load?**
- Make sure backend is running first
- Check http://localhost:5000/api/health

---

**Need detailed help?** See SETUP_GUIDE.md
