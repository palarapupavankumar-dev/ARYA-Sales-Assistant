/**
 * AI Response Simulator
 * Simulates intelligent Sales & Distribution Expert responses
 * No external API needed - works offline!
 */

const mockRMs = require('./data/mockRMs.json');
const mockCPs = require('./data/mockCPs.json');
const mockLeads = require('./data/mockLeads.json');

function getRMData(rmId) {
  return mockRMs.find(rm => rm.rm_id === rmId);
}

function getCPsForRM(rmId) {
  return mockCPs.filter(cp => cp.rm_id === rmId);
}

function getLeadsForRM(rmId) {
  return mockLeads.filter(lead => lead.rm_id === rmId);
}

function generateAIResponse(message, persona, rmId, conversationHistory) {
  const lowerMessage = message.toLowerCase();
  
  // Get context data
  const rmData = getRMData(rmId);
  const cps = getCPsForRM(rmId);
  const leads = getLeadsForRM(rmId);
  
  // Productivity Plan / Beat Plan
  if (lowerMessage.includes('productivity plan') || lowerMessage.includes('beat plan') || lowerMessage.includes('generate my plan')) {
    return generateProductivityPlan(rmData, cps, leads);
  }
  
  // Task completion
  if (lowerMessage.includes('completed') || lowerMessage.includes('✅') || lowerMessage.includes('done')) {
    return handleTaskCompletion(message, rmData);
  }
  
  // Time constraint
  if (lowerMessage.includes('hours left') || lowerMessage.includes('time left')) {
    return handleTimeConstraint(message, rmData, cps);
  }
  
  // WIP Empanelment
  if (lowerMessage.includes('wip') || lowerMessage.includes('complete empanelment')) {
    return handleWIPEmpanelment(rmData, cps);
  }
  
  // Dormant CPs
  if (lowerMessage.includes('dormant') || lowerMessage.includes('inactive')) {
    return handleDormantCPs(rmData, cps);
  }
  
  // SILVER to GOLD
  if (lowerMessage.includes('silver') && lowerMessage.includes('gold')) {
    return handleSilverToGold(rmData, cps);
  }
  
  // Find new CPs
  if (lowerMessage.includes('find') && lowerMessage.includes('cp')) {
    return handleFindNewCPs(rmData);
  }
  
  // Generate pitch
  if (lowerMessage.includes('pitch')) {
    return generatePitch(message, cps);
  }
  
  // Manager - Team performance
  if (persona === 'Manager' && (lowerMessage.includes('team') || lowerMessage.includes('performance'))) {
    return generateTeamPerformance();
  }
  
  // Manager - Coaching
  if (persona === 'Manager' && lowerMessage.includes('coaching')) {
    return generateCoachingPlan();
  }
  
  // Default response
  return generateDefaultResponse(persona, rmData);
}

function generateProductivityPlan(rmData, cps, leads) {
  const disbursementLeads = leads.filter(l => l.stage === 'Disbursement_Ready');
  const queryLeads = leads.filter(l => l.stage === 'Query');
  const diamondCPs = cps.filter(cp => cp.category === 'DIAMOND');
  const inactiveCPs = cps.filter(cp => cp.status === 'Inactive');
  const wipCPs = cps.filter(cp => cp.status === 'WIP_Empanelment');
  
  return `🎯 Plan to Improve Productivity - ${new Date().toLocaleDateString('en-IN')}

📊 YOUR SNAPSHOT
▫️ CPs: ${rmData.active_cps} Active | ${rmData.wip_empanelments} WIP | ${rmData.dormant_cps} Dormant
▫️ Disbursement: ₹${(rmData.disbursement / 100000).toFixed(1)}L / ₹${(rmData.target_disbursement / 100000).toFixed(1)}L (${((rmData.disbursement / rmData.target_disbursement) * 100).toFixed(0)}%)
▫️ Incentive Gap: ₹${rmData.incentive_gap.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL (${disbursementLeads.length + diamondCPs.filter(cp => cp.last_visit_days_ago > 10).length} tasks)

${disbursementLeads.slice(0, 2).map((lead, i) => `□ ${i + 1}. Complete Disbursement: Lead #${lead.lead_id}
   CP: ${lead.cp_name}
   Amount: ₹${(lead.loan_amount / 100000).toFixed(1)}L | Incentive: ₹${lead.potential_incentive.toLocaleString()}
   Action: ${lead.blocker_reason || 'Finalize documentation'}
   Why Critical: High incentive impact, quick win`).join('\n\n')}

${diamondCPs.filter(cp => cp.last_visit_days_ago > 10).slice(0, 1).map(cp => `□ ${disbursementLeads.length + 1}. Visit ${cp.name} (DIAMOND) - ${cp.last_visit_days_ago} days since last visit
   Risk: DIAMOND CP going inactive
   Expected: 2-3 new files
   Why Critical: Prevent churn of top performer`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 HIGH (${wipCPs.length + inactiveCPs.length} tasks)

${wipCPs.slice(0, 2).map((cp, i) => `□ ${i + 1}. Complete WIP: ${cp.name} (${cp.wip_days} days pending)
   Status: ${cp.empanelment_status}
   Action: ${cp.empanelment_status.includes('KYC') ? 'Call to get KYC docs' : 'Follow up on documents'}
   Why High: Quick empanelment win, ${cp.expected_category} potential`).join('\n\n')}

${inactiveCPs.slice(0, 1).map(cp => `□ ${wipCPs.length + 1}. Activate ${cp.name} (${cp.category}) - ${cp.last_visit_days_ago} days inactive
   Last file: ${cp.last_file_date}
   Action: Visit with status update + pitch
   Why High: Prevent ${cp.category} from going dormant`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 EXPECTED IMPACT TODAY
▫️ Potential Disbursements: ₹${(disbursementLeads.reduce((sum, l) => sum + l.loan_amount, 0) / 100000).toFixed(1)}L
▫️ Incentive Earning: ₹${disbursementLeads.reduce((sum, l) => sum + l.potential_incentive, 0).toLocaleString()}
▫️ Progress to Target: ${((rmData.disbursement / rmData.target_disbursement) * 100).toFixed(0)}% → ${(((rmData.disbursement + disbursementLeads.reduce((sum, l) => sum + l.loan_amount, 0)) / rmData.target_disbursement) * 100).toFixed(0)}%

💡 TIPS (Based on your profile)
• Focus on Query stage leads - ${queryLeads.length} need attention
• DIAMOND CPs need visits every 10 days
• You can handle ${rmData.target_cps - rmData.cps_empanelled} more CPs for target
• Success pattern: RMs with ${rmData.profile} profile hit 110% with ${rmData.target_cps} active CPs

What would you like to focus on first?`;
}

function handleTaskCompletion(message, rmData) {
  return `✅ Excellent progress! Task marked complete.

📊 UPDATED STATUS
▫️ Tasks completed: 1
▫️ Incentive impact: Positive movement toward ₹${rmData.incentive_gap.toLocaleString()} gap

🎯 NEXT PRIORITY
Your remaining CRITICAL tasks are now top priority. 

Would you like me to:
1. Re-prioritize your remaining tasks?
2. Suggest next best action?
3. Calculate updated incentive potential?

Great momentum! Let's keep it going 💪`;
}

function handleTimeConstraint(message, rmData, cps) {
  const hours = message.match(/(\d+)\s*hour/i)?.[1] || '3';
  
  return `⏰ Got it - ${hours} hours left. Let me re-plan for maximum impact.

🔄 TIME-OPTIMIZED PLAN

🔴 DO THESE NOW (Quick wins, high impact)

□ 1. Call for disbursement-ready lead (15 min)
     Expected: ₹4,250 incentive
     
□ 2. Quick visit to nearby DIAMOND CP (30 min)
     Location: 2 km from you
     Purpose: Relationship check = prevent churn
     
□ 3. Follow-up call on Query lead (15 min)
     Action: Get pending documents
     Expected: Move to next stage

⏭️ DEFERRED TO TOMORROW
□ Tasks requiring 1+ hour
□ Non-urgent empanelments

📈 REALISTIC IMPACT IN ${hours}H
▫️ Incentive: ₹4,800
▫️ Tasks: 3 completed
▫️ CP relationships: 1 DIAMOND retained

This focuses on quick wins. Sound good?`;
}

function handleWIPEmpanelment(rmData, cps) {
  const wipCPs = cps.filter(cp => cp.status === 'WIP_Empanelment');
  
  if (wipCPs.length === 0) {
    return `Great news! You don't have any WIP empanelments currently.

🎯 RECOMMENDATION
Consider starting new empanelments in high-potential territories:
▫️ Pincodes: ${rmData.territory_pincodes.join(', ')}
▫️ Target: DSA for residential areas
▫️ Success rate: 78% with 3+ follow-ups

Ready to identify new CP opportunities?`;
  }
  
  return `📋 WIP EMPANELMENT STATUS

You have ${wipCPs.length} empanelments in progress:

${wipCPs.map((cp, i) => `${i + 1}. ${cp.name}
   ▫️ Pending: ${cp.wip_days} days
   ▫️ Blocker: ${cp.empanelment_status}
   ▫️ Potential: ${cp.expected_category} category
   ▫️ Action: ${cp.empanelment_status.includes('KYC') ? 'Call to expedite KYC docs' : 'Follow up on pending documents'}
   ▫️ Tip: RMs who follow up 3+ times see 78% success`).join('\n\n')}

🎯 PRIORITY ACTION
Focus on ${wipCPs[0].name} first (longest pending).

Would you like a pitch script to accelerate this empanelment?`;
}

function handleDormantCPs(rmData, cps) {
  const dormantCPs = cps.filter(cp => cp.category === 'DORMANT' || cp.status === 'Dormant');
  
  if (dormantCPs.length === 0) {
    return `✅ Good news! You don't have dormant CPs currently.

Keep your active CPs engaged:
▫️ DIAMOND: Visit every 10 days
▫️ GOLD: Visit every 15 days
▫️ SILVER: Visit every 20 days

Your ${rmData.active_cps} active CPs are in good shape!`;
  }
  
  return `🔄 DORMANT CP REACTIVATION PLAN

You have ${dormantCPs.length} dormant CP(s):

${dormantCPs.map((cp, i) => `${i + 1}. ${cp.name}
   ▫️ Was: ${cp.category === 'DORMANT' ? 'GOLD' : cp.category} (₹${(cp.total_business_value / 100000).toFixed(1)}L business earlier)
   ▫️ Dormant since: ${cp.last_visit_days_ago} days
   ▫️ Reason: ${cp.dormant_reason || 'Needs re-engagement'}
   ▫️ Visits needed: 2-3 for reactivation
   
   🎯 REACTIVATION STRATEGY:
   1. First visit: Share improved metrics (TAT, ROI)
   2. Second visit: Offer incentive on first file
   3. Third visit: Bring success case study
   
   💡 Success Story: CP-067 in your zone reactivated after 40 days dormancy, now doing ₹2L/month`).join('\n\n')}

Ready to start reactivation? I can generate a personalized pitch!`;
}

function handleSilverToGold(rmData, cps) {
  const silverCPs = cps.filter(cp => cp.category === 'SILVER' && cp.status === 'Active');
  
  if (silverCPs.length === 0) {
    return `You currently don't have active SILVER CPs to upgrade. 

Your CP distribution:
▫️ DIAMOND: ${rmData.diamond_cps}
▫️ GOLD: ${rmData.gold_cps}
▫️ SILVER: ${rmData.silver_cps}

Focus on maintaining your GOLD and DIAMOND CPs!`;
  }
  
  return `💎 SILVER → GOLD UPGRADE OPPORTUNITIES

${silverCPs.slice(0, 2).map((cp, i) => `${i + 1}. ${cp.name}
   ▫️ Current: ${cp.files_submitted} files/month
   ▫️ For GOLD: Need 5+ files/month
   ▫️ Conversion: ${cp.conversion_rate}%
   ▫️ Gap: ${5 - cp.files_submitted} more files needed
   
   🎯 UPGRADE STRATEGY:
   ▫️ Pitch: "RMs with 5+ files from you earn ₹X extra payout"
   ▫️ Offer: Faster TAT on next 2 files (24-48 hrs)
   ▫️ Support: Weekly status calls for active leads
   
   💡 Case Study: Gupta Associates moved SILVER→GOLD in 2 months by increasing engagement frequency
   
   Expected Timeline: 4-6 weeks with weekly visits`).join('\n\n')}

Ready to pitch ${silverCPs[0].name}? I'll generate a customized script!`;
}

function handleFindNewCPs(rmData) {
  return `📍 HIGH-POTENTIAL TERRITORIES FOR NEW CPs

Based on your zone analysis:

🔥 TOP PRIORITY AREAS

1. Pincode 400053 (Andheri West)
   ▫️ Street: SV Road, Oshiwara
   ▫️ Potential: HIGH (85% success rate in your zone)
   ▫️ Type: DSA preferred (residential area)
   ▫️ Competition: Medium
   ▫️ Action: Market visit 2-4 PM (peak time)

2. Pincode 400058 (Goregaon)
   ▫️ Street: Link Road, Yashodham
   ▫️ Potential: HIGH (80% success rate)
   ▫️ Type: Connector preferred (commercial hub)
   ▫️ Competition: Low
   ▫️ Action: Morning visits work best

3. Pincode 400061 (Jogeshwari)
   ▫️ Street: Western Express Highway
   ▫️ Potential: MEDIUM (70% success rate)
   ▫️ Type: Both DSA & Connector
   ▫️ Competition: High

🎯 HUNTING STRATEGY
▫️ Visit 5-7 prospects to empanel 2-3 CPs
▫️ Look for: Established businesses, 2+ years old
▫️ Best time: 11 AM - 3 PM (business hours)
▫️ Pitch focus: Quick TAT, competitive payouts

💡 TIP: RMs in your branch who added 3 CPs in ${rmData.territory_pincodes[0]} saw 40% disbursement increase!

Ready for a territory visit? I can generate talking points!`;
}

function generatePitch(message, cps) {
  const cpName = message.match(/for\s+(\w+)/i)?.[1] || cps[0]?.name || 'the CP';
  const cp = cps.find(c => c.name.toLowerCase().includes(cpName.toLowerCase())) || cps[0];
  
  if (!cp) {
    return `I'd be happy to generate a pitch! Which CP do you want to pitch to?`;
  }
  
  return `💬 CUSTOMIZED PITCH FOR ${cp.name.toUpperCase()}

📋 SITUATION ANALYSIS:
▫️ Category: ${cp.category}
▫️ Status: ${cp.status}
${cp.last_visit_days_ago ? `▫️ Last visit: ${cp.last_visit_days_ago} days ago` : ''}
${cp.conversion_rate ? `▫️ Conversion rate: ${cp.conversion_rate}%` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PITCH SCRIPT:

**Opening:**
"Hi ${cp.name.split(' ')[0]}! I wanted to share some exciting updates about our improved process and your performance metrics."

**Value Proposition:**
"You've done ₹${((cp.total_business_value || 150000) / 100000).toFixed(1)}L business with us${cp.payout_received ? `, earning ₹${cp.payout_received.toLocaleString()} in payouts` : ''}. I've analyzed our top performers - CPs doing 5+ files/month are earning 60% more in payouts."

**The Ask:**
"I'd like to help you reach that level. Here's what I'm proposing:
▫️ Priority TAT: 24-48 hour turnaround on files
▫️ Weekly status calls: Keep you updated on every lead
▫️ Special incentive: ₹X bonus on next 3 files (if closed in 30 days)"

**Handle Objections:**

❓ "TAT is slow"
✅ "I understand. We've reduced TAT by 40% last quarter. Let me show you avg days for last 10 files..."

❓ "ROI is not good"
✅ "Fair point. Let's look at numbers: Your conversion rate is ${cp.conversion_rate || 70}%. Top CPs at ${cp.conversion_rate + 15 || 85}% use our pre-qualification checklist. Want to try it?"

❓ "Too many rejections"
✅ "I hear you. Let's do a quick review of last 3 rejections and I'll share tips to avoid them. Plus, I'll personally review docs before submission."

**Closing:**
"Can we target 3 files this month? I'll personally ensure smooth processing. Deal?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 DELIVERY TIPS:
• Use their business name frequently (builds rapport)
• Show actual payout numbers (builds trust)
• Offer something immediate (creates urgency)
• End with specific commitment

Ready to make the call/visit?`;
}

function generateTeamPerformance() {
  return `👥 TEAM PERFORMANCE OVERVIEW - Andheri Branch

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL: 3 RMs BELOW 70% TARGET

1. **Priya Sharma** (Intermediate RM)
   ▫️ Achievement: 56% (₹2.8L / ₹5L)
   ▫️ CPs: 12 empanelled, only 5 active (42%)
   ▫️ Files: 12 / 25 (48%)
   ▫️ Issue: Low CP activation rate
   ▫️ 🎯 Action: Coaching needed on activation strategies

2. **Rajesh Patel** (New RM)
   ▫️ Achievement: 24% (₹1.2L / ₹5L)
   ▫️ CPs: 8 empanelled, only 3 active (38%)
   ▫️ Files: 6 / 25 (24%)
   ▫️ Issue: Struggling with empanelment + activation
   ▫️ 🎯 Action: Intensive coaching + shadowing needed

3. **Suresh Kumar** (Senior RM)
   ▫️ Achievement: 84% (₹4.2L / ₹5L)
   ▫️ CPs: 14 empanelled, 8 active (57%)
   ▫️ Files: 18 / 25 (72%)
   ▫️ Issue: Close to target but inconsistent
   ▫️ 🎯 Action: Push for 2-3 more disbursements

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 HIGH PERFORMERS (Learn from them!)

1. **Amit Desai** - 130% (₹6.5L / ₹5L)
   ▫️ Secret: 18 CPs, 14 active (78% activation!)
   ▫️ Best Practice: Visits DIAMOND CPs every 7-8 days

2. **Neha Reddy** - 98% (₹4.9L / ₹5L)
   ▫️ Secret: Strong follow-up on Query stage leads
   ▫️ Best Practice: Daily check-in calls with top 5 CPs

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 BRANCH METRICS
▫️ Avg CP Activation: 58% (Target: 65%)
▫️ Avg Files/RM: 17 (Target: 25)
▫️ Team Disbursement: ₹19.6L / ₹25L (78%)

🎯 TOP 3 BRANCH ACTIONS:
1. CP activation workshop for Priya & Rajesh
2. Shadow Amit for 2 days (learn his system)
3. Daily stand-up for Query stage lead resolution

What would you like to drill down into?`;
}

function generateCoachingPlan() {
  return `🎯 COACHING PLAN: CP ACTIVATION

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 FOR: Priya Sharma
📉 ISSUE: Low CP activation (42% vs target 65%)

🎓 COACHING SESSION STRUCTURE (30 min)

**1. DIAGNOSE (10 min)**
"Priya, I see you have 12 CPs but only 5 are active. Let's understand why."

Ask:
▫️ "How often do you visit/call your inactive CPs?"
▫️ "What objections do they give for not submitting files?"
▫️ "Do you have a system to track CP engagement?"

Expected Answer: Likely visiting 1x/month, no systematic follow-up

**2. EDUCATE (10 min)**
"Let me share what top performers do differently."

Show:
▫️ Amit's system: DIAMOND every 7-8 days, GOLD every 15 days
▫️ Success stat: RMs with 2x/week CP touchpoints have 75% activation
▫️ The 3-2-1 rule: 3 visits to empanel, 2 calls to activate, 1 weekly check-in to maintain

**3. PRACTICE (5 min)**
"Let's role-play. I'm your inactive CP. Convince me to submit a file."

Evaluate:
▫️ Does she lead with value (payout, success metrics)?
▫️ Does she handle objections confidently?
▫️ Does she create urgency?

**4. ACTION PLAN (5 min)**
"Here's your action plan for next 7 days:"

Day 1-2: Call all 7 inactive CPs, understand blockers
Day 3-4: Visit top 3 inactive CPs with pitch
Day 5-6: Follow up with value props (share success cases)
Day 7: Check-in call, measure activation

Target: Activate 2 out of 7 inactive CPs this week

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 COACHING NOTES TO DOCUMENT:
▫️ Current gap: Systematic CP engagement missing
▫️ Strength: Good at empanelment (12 CPs)
▫️ Weakness: Follow-up and relationship building
▫️ Recommendation: Assign mentor (Amit) for 2 weeks

🔔 FOLLOW-UP:
▫️ Day 3 check-in: Review progress on calls
▫️ Day 7 review: Measure activation results
▫️ Week 2: Adjust plan based on results

Ready to conduct this session?`;
}

function generateDefaultResponse(persona, rmData) {
  if (persona === 'RM') {
    return `Hi! I'm your AI Sales Assistant. I can help you with:

🎯 **Productivity Planning**
▫️ "Generate my productivity plan"
▫️ "What should I focus on today?"

👥 **CP Management**
▫️ "Complete WIP empanelment"
▫️ "Activate dormant CPs"
▫️ "Move SILVER CPs to GOLD"
▫️ "Find new CPs in my area"

💬 **Pitches & Scripts**
▫️ "Generate pitch for [CP name]"
▫️ "How to handle objections?"

📊 **Performance Insights**
▫️ "Why am I not meeting targets?"
▫️ "Show success stories from my zone"

Your current status:
▫️ ${rmData.active_cps} active CPs out of ${rmData.cps_empanelled} empanelled
▫️ ₹${(rmData.disbursement / 100000).toFixed(1)}L / ₹${(rmData.target_disbursement / 100000).toFixed(1)}L (${((rmData.disbursement / rmData.target_disbursement) * 100).toFixed(0)}%)
▫️ ₹${rmData.incentive_gap.toLocaleString()} gap to next milestone

What would you like to work on?`;
  } else {
    return `Hi Manager! I can help you with:

👥 **Team Insights**
▫️ "Show team performance"
▫️ "Who is underperforming?"
▫️ "Branch vs zone comparison"

🎯 **Coaching**
▫️ "Who needs coaching on CP activation?"
▫️ "Generate coaching plan for [RM name]"
▫️ "Best practices from top performers"

📊 **Analytics**
▫️ "Why is branch CP activation low?"
▫️ "Which cohort needs training?"

Your team:
▫️ 5 RMs in Andheri Branch
▫️ 3 below 70% target (need attention)
▫️ 2 high performers (110%+)

What would you like to analyze?`;
  }
}

module.exports = { generateAIResponse };
