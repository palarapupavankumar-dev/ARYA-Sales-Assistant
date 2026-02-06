const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Anthropic (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Load ARYA prompts and mock data
const ARYA_SYSTEM_PROMPT = require('./prompts/aryaSystemPrompt');
const ARYA_TASK_PROMPT = require('./prompts/aryaTaskPrompt');
const mockRMs = require('./data/mockRMs.json');
const mockCPs = require('./data/mockCPs.json');
const mockLeads = require('./data/mockLeads.json');

// In-memory session storage
const sessions = {};

// Conversation logs directory
const logsDir = path.join(__dirname, '../conversation-logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper function to get RM data
function getRMData(rmId) {
  return mockRMs.find(rm => rm.rm_id === rmId);
}

// Helper function to get CPs for RM
function getCPsForRM(rmId) {
  const rm = getRMData(rmId);
  if (!rm || !rm.assigned_cps || rm.assigned_cps.length === 0) {
    return mockCPs.filter(cp => cp.cp_id.includes('CP')).slice(0, rm ? rm.total_cp_base : 0);
  }
  return mockCPs.filter(cp => rm.assigned_cps.includes(cp.cp_id));
}

// Helper function to get Leads for RM
function getLeadsForRM(rmId) {
  return mockLeads.filter(lead => lead.rm_id === rmId);
}

// Build detailed RM context for ARYA
function buildRMContext(rmId) {
  const rmData = getRMData(rmId);
  if (!rmData) return "RM data not available.";
  
  const cps = getCPsForRM(rmId);
  const leads = getLeadsForRM(rmId);
  
  // Categorize CPs
  const diamondCPs = cps.filter(cp => cp.category === 'Diamond' && cp.status === 'Active');
  const goldCPs = cps.filter(cp => cp.category === 'Gold' && cp.status === 'Active');
  const silverCPs = cps.filter(cp => cp.category === 'Silver' && cp.status === 'Active');
  const dormantCPs = cps.filter(cp => cp.status === 'Dormant');
  const orphanCPs = cps.filter(cp => cp.status === 'Orphan');
  const newCPs = cps.filter(cp => cp.category === 'New');
  
  // Categorize leads
  const disbReady = leads.filter(l => l.stage === 'Disbursement_Ready');
  const ldCases = leads.filter(l => l.stage === 'LD');
  const queries = leads.filter(l => l.stage === 'Query');
  const logins = leads.filter(l => l.stage === 'Login');
  const externalLeads = leads.filter(l => l.stage === 'External');
  
  return `
CURRENT RM PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${rmData.name}
Vintage: ${rmData.vintage_months} months
Target Achievement: ${rmData.target_achievement_percent}%
Contest Rank: ${rmData.contest_rank || 'Not ranked yet'}

PERFORMANCE METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Disbursement: ₹${(rmData.disbursement / 100000).toFixed(1)}L / ₹${(rmData.target_disbursement / 100000).toFixed(1)}L (${rmData.target_achievement_percent}%)
Incentive Earned: ₹${rmData.incentive_earned.toLocaleString()} / ₹${rmData.incentive_target.toLocaleString()}
Incentive Gap: ₹${(rmData.incentive_target - rmData.incentive_earned).toLocaleString()}

CP NETWORK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total CPs: ${rmData.total_cp_base}
Active CPs: ${rmData.active_cps}
New Empanelments This Month: ${rmData.new_empanelments}

CP Category Breakdown:
▫️ Diamond: ${diamondCPs.length} (${diamondCPs.map(cp => cp.name).join(', ') || 'None'})
▫️ Gold: ${goldCPs.length} (${goldCPs.map(cp => cp.name).join(', ') || 'None'})
▫️ Silver: ${silverCPs.length} (${silverCPs.map(cp => cp.name).join(', ') || 'None'})
▫️ Dormant: ${dormantCPs.length} (${dormantCPs.map(cp => cp.name).join(', ') || 'None'})
▫️ Orphan: ${orphanCPs.length} (${orphanCPs.map(cp => cp.name).join(', ') || 'None'})
▫️ New: ${newCPs.length} (${newCPs.map(cp => cp.name).join(', ') || 'None'})

DETAILED CP DATA:
${cps.slice(0, 10).map(cp => `
▫️ ${cp.name} (${cp.cp_id})
   Category: ${cp.category} | Status: ${cp.status}
   Area: ${cp.area} (${cp.pincode})
   Vintage: ${cp.vintage_months} months
   Avg Monthly Files: ${cp.avg_monthly_files}
   Last Interaction: ${cp.last_interaction}
   Last Visit: ${cp.last_visit_days_ago} days ago
   Last Payout: ₹${cp.last_payout_amount.toLocaleString()}
   ${cp.last_month_commitment ? `Last Commitment: ${cp.last_month_commitment}` : ''}
   ${cp.milestone_status ? `Milestone: ${cp.milestone_status}` : ''}
`).join('\n')}

PIPELINE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Active Leads: ${leads.length}

Disbursement Ready (${disbReady.length}):
${disbReady.map(l => `▫️ ${l.lead_id}: ${l.customer_name} | ₹${(l.loan_amount / 100000).toFixed(1)}L | CP: ${l.cp_name} | Incentive: ₹${l.potential_incentive.toLocaleString()}`).join('\n') || '▫️ None'}

LD Cases (${ldCases.length}):
${ldCases.map(l => `▫️ ${l.lead_id}: ${l.customer_name} | ₹${(l.loan_amount / 100000).toFixed(1)}L | ${l.stage_detail} | Days: ${l.days_in_stage}`).join('\n') || '▫️ None'}

Query Cases (${queries.length}):
${queries.map(l => `▫️ ${l.lead_id}: ${l.customer_name} | ₹${(l.loan_amount / 100000).toFixed(1)}L | ${l.blocker_reason || l.stage_detail} | Days: ${l.days_in_stage}`).join('\n') || '▫️ None'}

Login Cases (${logins.length}):
${logins.map(l => `▫️ ${l.lead_id}: ${l.customer_name} | ₹${(l.loan_amount / 100000).toFixed(1)}L | Days: ${l.days_in_stage}`).join('\n') || '▫️ None'}

External Leads (${externalLeads.length}):
${externalLeads.map(l => `▫️ ${l.lead_id}: ${l.customer_name} | ₹${(l.loan_amount / 100000).toFixed(1)}L | ${l.stage_detail}`).join('\n') || '▫️ None'}

RM STRENGTHS & GAPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key Strength: ${rmData.key_strength}
Key Gap: ${rmData.key_gap}

Use this data to provide personalized, actionable advice following ARYA principles.`;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ARYA Sales Beat Chat API is running' });
});

// Get all RMs
app.get('/api/rms', (req, res) => {
  res.json(mockRMs.map(rm => ({
    rm_id: rm.rm_id,
    name: rm.name,
    target_achievement_percent: rm.target_achievement_percent,
    contest_rank: rm.contest_rank,
    active_cps: rm.active_cps
  })));
});

// Start or get session
app.post('/api/session/start', (req, res) => {
  const { rmId } = req.body;
  const sessionId = uuidv4();
  
  const rmData = getRMData(rmId || 'RM3');
  if (!rmData) {
    return res.status(404).json({ error: 'RM not found' });
  }
  
  // Generate persona-based welcome message
  let welcomeMessage = '';
  const targetPercent = rmData.target_achievement_percent;
  
  if (targetPercent >= 0 && targetPercent <= 30) {
    // Low performer - Supportive
    welcomeMessage = `👋 Good morning! I'm ARYA, here to support you in building a strong foundation.

You're at ${targetPercent}% target achievement. Let's focus on building your CP network today—I'll guide you step-by-step through empanelment and activation.

**Today's opportunity:** If we empanel 1 new CP and activate 2 existing ones, you'll build momentum for consistent files ahead.

Can I help to build a plan to improve productivity & reach targets?`;
  } else if (targetPercent >= 40 && targetPercent <= 70) {
    // Mid performer - Balanced, incentive-focused
    const incentiveGap = rmData.incentive_target - rmData.incentive_earned;
    welcomeMessage = `👋 Good morning! You're at ${targetPercent}% target achievement today.

If we close your pending Query/LD cases and activate 1 CP, you can move to ${targetPercent + 3}%+ quickly — with potential incentive visibility of ₹${Math.round(incentiveGap * 0.1).toLocaleString()} in the next 3–4 days.

**Incentive focus:** Every task today is sequenced for fastest incentive realization.

Can I help to build a plan to improve productivity & reach targets?`;
  } else if (targetPercent >= 80) {
    // High performer - Strategic
    welcomeMessage = `👋 Good morning! Strong progress at ${targetPercent}% target achievement!

**Strategic opportunity:** Let's optimize your Diamond CPs and push Gold CPs to Diamond status. This can scale your wallet share significantly with minimal additional effort.

Can I help to build a plan to improve productivity & reach targets?`;
  } else {
    // Default for 31-39%
    welcomeMessage = `👋 Good morning! I'm ARYA, your AI Sales Productivity Assistant.

You're at ${targetPercent}% target achievement. I have your complete context - performance data, CP network, and pipeline.

Can I help to build a plan to improve productivity & reach targets?`;
  }
  
  sessions[sessionId] = {
    sessionId,
    rmId: rmId || 'RM3',
    rmName: rmData.name,
    messages: [],
    createdAt: new Date(),
    beatPlan: null,
    tasksCompleted: [],
    tasksBlocked: [],
    welcomeMessage: welcomeMessage
  };
  
  res.json({ 
    sessionId, 
    rmName: rmData.name, 
    welcomeMessage: welcomeMessage,
    message: 'Session started successfully' 
  });
});

// Chat endpoint with Claude
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !sessions[sessionId]) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    const session = sessions[sessionId];
    
    // Add user message to history
    session.messages.push({
      role: 'user',
      content: message
    });
    
    // Build RM context
    const rmContext = buildRMContext(session.rmId);
    
    // Build messages for Claude
    const messages = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Combine System + Task prompts
    const combinedPrompt = ARYA_SYSTEM_PROMPT + '\n\n' + ARYA_TASK_PROMPT + '\n\n' + rmContext;
    
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: combinedPrompt,
      messages: messages
    });
    
    const aiResponse = response.content[0].text;
    
    // Add AI response to history
    session.messages.push({
      role: 'assistant',
      content: aiResponse
    });
    
    // Log conversation
    logConversation(sessionId, session);
    
    res.json({
      response: aiResponse,
      sessionId: sessionId,
      messageCount: session.messages.length
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat', 
      details: error.message 
    });
  }
});

// Get session data
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    sessionId: session.sessionId,
    rmId: session.rmId,
    rmName: session.rmName,
    messageCount: session.messages.length,
    createdAt: session.createdAt
  });
});

// Get RM data
app.get('/api/data/rm/:rmId', (req, res) => {
  const { rmId } = req.params;
  const rmData = getRMData(rmId);
  
  if (!rmData) {
    return res.status(404).json({ error: 'RM not found' });
  }
  
  const cps = getCPsForRM(rmId);
  const leads = getLeadsForRM(rmId);
  
  res.json({
    rm: rmData,
    cps: cps,
    leads: leads
  });
});

// Export current prompts
app.get('/api/prompts/current', (req, res) => {
  res.json({
    systemPrompt: ARYA_SYSTEM_PROMPT,
    taskPrompt: ARYA_TASK_PROMPT,
    version: '2.0-ARYA-Dual',
    lastUpdated: new Date().toISOString()
  });
});

// Update prompts (dynamically)
app.post('/api/prompts/update', (req, res) => {
  try {
    const { systemPrompt, taskPrompt } = req.body;
    
    // Update System Prompt if provided
    if (systemPrompt) {
      const systemPath = path.join(__dirname, 'prompts', 'aryaSystemPrompt.js');
      const systemContent = `/**
 * ARYA - AI Sales Productivity Assistant
 * SYSTEM PROMPT - Core Principles & Decision Science
 * Last Updated: ${new Date().toISOString()}
 */

module.exports = \`${systemPrompt.replace(/`/g, '\\`')}\`;
`;
      fs.writeFileSync(systemPath, systemContent);
    }
    
    // Update Task Prompt if provided
    if (taskPrompt) {
      const taskPath = path.join(__dirname, 'prompts', 'aryaTaskPrompt.js');
      const taskContent = `/**
 * ARYA - AI Sales Productivity Assistant
 * TASK PROMPT - Conversation Flow & Interaction Patterns
 * Last Updated: ${new Date().toISOString()}
 */

module.exports = \`${taskPrompt.replace(/`/g, '\\`')}\`;
`;
      fs.writeFileSync(taskPath, taskContent);
    }
    
    res.json({
      success: true,
      message: 'Prompts updated successfully. Changes will apply to new chat sessions.',
      updated: {
        system: !!systemPrompt,
        task: !!taskPrompt
      },
      note: 'For immediate effect across all sessions, restart the server.'
    });
    
  } catch (error) {
    console.error('Failed to update prompts:', error);
    res.status(500).json({ 
      error: 'Failed to update prompts', 
      details: error.message 
    });
  }
});

// Get conversation logs
app.get('/api/conversations/logs', (req, res) => {
  try {
    const logs = fs.readdirSync(logsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = JSON.parse(fs.readFileSync(path.join(logsDir, file), 'utf8'));
        return {
          filename: file,
          sessionId: content.sessionId,
          rmName: content.rmName,
          messageCount: content.messages.length,
          createdAt: content.createdAt
        };
      });
    
    res.json({ logs });
  } catch (error) {
    res.json({ logs: [] });
  }
});

// Helper function to log conversations
function logConversation(sessionId, session) {
  const logFile = path.join(logsDir, `session-${sessionId}.json`);
  fs.writeFileSync(logFile, JSON.stringify(session, null, 2));
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ ARYA Sales Beat Chat API running on port ${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}`);
  console.log(`💬 Ready for intelligent conversations with Claude AI`);
  console.log(`🤖 Using Claude 3.5 Sonnet with ARYA decision science`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set in .env file');
  }
});
