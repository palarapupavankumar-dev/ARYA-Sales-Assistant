# 📱 Intelligent Sales Beat Plan - Mobile Chat Prototype

Interactive mobile chat interface with real OpenAI integration for testing and refining AI conversations before production.

## 🎯 Purpose

Test and refine AI prompts for:
- RM productivity planning
- CP empanelment & activation strategies
- Manager coaching and insights
- Intelligent beat plan re-planning

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- OpenAI API Key

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

1. Create `.env` file in backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

2. Update OpenAI API key in `backend/.env`

### Run the Application

```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend
cd frontend
npm start
```

Access the mobile chat at: `http://localhost:3000`

## 📁 Project Structure

```
sales-beat-mobile-chat/
├── backend/                      # Express + OpenAI server
│   ├── prompts/                  # Editable AI prompts
│   ├── data/                     # Mock data
│   ├── routes/                   # API routes
│   └── server.js
├── frontend/                     # React mobile UI
│   └── src/
│       └── components/           # Chat components
├── prompts-export/               # Exported prompt versions
└── conversation-logs/            # Test conversations
```

## 🔄 Workflow

1. **Test Conversations** - Use mobile chat with real AI
2. **Identify Issues** - Note what needs improvement
3. **Refine Prompts** - Update prompt files
4. **Test Again** - See improved responses
5. **Export** - Get production-ready prompts

## 🎨 Features

- ✅ Real OpenAI GPT-4 conversations
- ✅ RM and Manager persona toggle
- ✅ Intelligent beat plan generation
- ✅ Dynamic re-planning based on RM inputs
- ✅ Conversation logging
- ✅ Prompt viewing & export
- ✅ Mobile-optimized UI

## 📝 Prompt Management

Edit prompts in `backend/prompts/`:
- `systemPrompt.js` - Main AI context
- `rmPersona.js` - RM-specific scenarios
- `managerPersona.js` - Manager scenarios
- `beatPlanLogic.js` - Planning algorithms

## 🔧 Commands

```bash
# View current prompts
GET http://localhost:5000/api/prompts/current

# Export prompts
GET http://localhost:5000/api/prompts/export

# View conversation logs
GET http://localhost:5000/api/conversations/logs
```

## 📊 Mock Data

Includes realistic data:
- 50 RMs with performance metrics
- 100 CPs (Connectors & DSAs)
- 200 Leads at various stages
- Territory intelligence data

## 🎓 Next Steps

After refining conversations:
1. Export final prompts
2. Review conversation examples
3. Get production implementation guide
4. Integrate into actual mobile app

---

**Ready to start testing?** Launch the app and begin conversations!
