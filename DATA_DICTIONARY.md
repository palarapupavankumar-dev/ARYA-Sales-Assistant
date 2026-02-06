# ARYA Data Dictionary
**Complete Database Schema & Sample Data**
Last Updated: 2026-02-06

---

## 📊 TABLE 1: RM (Relationship Managers)
**File:** `backend/data/mockRMs.json`
**Total Records:** 8 RMs

### Schema:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| rm_id | String | Unique RM identifier | "RM1" |
| name | String | Full name | "Rajesh Kumar" |
| vintage_months | Number | Experience in months | 6 |
| target_disbursement | Number | Monthly target (₹) | 10000000 |
| disbursement | Number | Current disbursement (₹) | 2000000 |
| target_achievement_percent | Number | Target % achieved | 20 |
| incentive_target | Number | Monthly incentive target (₹) | 50000 |
| incentive_earned | Number | Incentive earned (₹) | 8000 |
| contest_rank | Number/null | Current rank in contest | 45 |
| total_cp_base | Number | Total CPs empaneled | 6 |
| active_cps | Number | Currently active CPs | 3 |
| new_empanelments | Number | This month empanelments | 1 |
| key_strength | String | Main strength area | "Good relationship building" |
| key_gap | String | Main weakness/gap | "Low CP network" |
| assigned_cps | Array | List of CP IDs assigned | ["CP6", "CP7", "CP8"] |

### Sample Data:
```json
{
  "rm_id": "RM1",
  "name": "Rajesh Kumar",
  "vintage_months": 6,
  "target_disbursement": 10000000,
  "disbursement": 2000000,
  "target_achievement_percent": 20,
  "incentive_target": 50000,
  "incentive_earned": 8000,
  "contest_rank": 45,
  "total_cp_base": 6,
  "active_cps": 3,
  "new_empanelments": 1,
  "key_strength": "Good relationship building",
  "key_gap": "Low CP network",
  "assigned_cps": ["CP6", "CP7", "CP8", "CP11", "CP13", "CP20"]
}
```

### Performance Segmentation:
| Performance Level | Target % | RMs | Characteristics |
|-------------------|----------|-----|-----------------|
| Low (0-30%) | 0-30% | RM1, RM2 | New RMs, need CP network building |
| Mid (40-70%) | 40-70% | RM3, RM4, RM5 | Consistent performers, need scaling |
| High (80-100%+) | 80-100%+ | RM6, RM7, RM8 | Top performers, strategic focus |

---

## 📊 TABLE 2: CP (Channel Partners)
**File:** `backend/data/mockCPs.json`
**Total Records:** 20 CPs

### Schema:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| cp_id | String | Unique CP identifier | "CP1" |
| name | String | CP business name with area | "Diamond CP - Whitefield" |
| category | String | Performance category | "Diamond" |
| status | String | Current status | "Active" |
| area | String | Geographic area | "Whitefield" |
| pincode | String | Area pincode | "560066" |
| vintage_months | Number | Months since empanelment | 36 |
| avg_monthly_files | Number | Average files per month | 6 |
| last_interaction | String | Last interaction summary | "Weekly reviews" |
| last_month_commitment | String | Last commitment made | "6 files" |
| last_contest_achievement | String | Contest performance | "Top 5%" |
| milestone_status | String | Current milestone | "Retain Diamond" |
| avg_case_tat_days | Number | Average TAT in days | 7 |
| last_payout_amount | Number | Last payout (₹) | 240000 |
| last_visit_days_ago | Number | Days since last visit | 3 |
| contact | String | Contact number | "9XXXX11111" |

### CP Categories:
| Category | Count | Criteria | Files/Month |
|----------|-------|----------|-------------|
| Diamond | 3 | Top performers | 5-7 |
| Gold | 5 | Consistent performers | 2-4 |
| Silver | 7 | Growing performers | 1-2 |
| Dormant | 3 | Inactive >60 days | 0-0.5 |
| Orphan | 2 | Previous RM left | Varies |
| New | 2 | Recently empaneled | 0-0.5 |

### Sample Data:
```json
{
  "cp_id": "CP1",
  "name": "Diamond CP - Whitefield",
  "category": "Diamond",
  "status": "Active",
  "area": "Whitefield",
  "pincode": "560066",
  "vintage_months": 36,
  "avg_monthly_files": 6,
  "last_interaction": "Weekly reviews",
  "last_month_commitment": "6 files",
  "last_contest_achievement": "Top 5%",
  "milestone_status": "Retain Diamond",
  "avg_case_tat_days": 7,
  "last_payout_amount": 240000,
  "last_visit_days_ago": 3,
  "contact": "9XXXX11111"
}
```

---

## 📊 TABLE 3: CP-RM MAPPING
**Logic:** Each RM has an `assigned_cps` array with CP IDs

### Current Mappings:

| RM ID | RM Name | CPs Assigned | Total CPs | Categories Distribution |
|-------|---------|--------------|-----------|------------------------|
| RM1 | Rajesh Kumar | CP6, CP7, CP8, CP11, CP13, CP20 | 6 | Silver: 4, Orphan: 1, New: 1 |
| RM2 | Priya Sharma | CP6, CP7, CP8, CP14 | 4 | Silver: 3, New: 1 |
| RM3 | Amit Verma | CP3, CP4, CP5, CP16, CP19 | 5 | Gold: 3, Silver: 2 |
| RM4 | Sneha Reddy | CP9, CP10, CP12, CP17 | 4 | Dormant: 3, Orphan: 1 |
| RM5 | Vikram Singh | CP15, CP18, CP19 | 3 | Diamond: 1, Gold: 2 |
| RM6 | Ananya Iyer | CP1, CP2, CP3 | 3 | Diamond: 2, Gold: 1 |
| RM7 | Rohan Desai | CP1, CP2, CP18 | 3 | Diamond: 3 |
| RM8 | Kavya Menon | CP4, CP5, CP15 | 3 | Gold: 3 |

### Mapping Rules:
- Low performers (RM1, RM2): Get Silver/New CPs for practice
- Mid performers (RM3, RM4, RM5): Mixed portfolio
- High performers (RM6, RM7, RM8): Diamond/Gold CPs

---

## 📊 TABLE 4: LEADS (Pipeline)
**File:** `backend/data/mockLeads.json`
**Total Records:** 35 leads

### Schema:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| lead_id | String | Unique lead identifier | "L-12345" |
| rm_id | String | Assigned RM | "RM3" |
| cp_id | String/null | Source CP (if applicable) | "CP3" |
| cp_name | String/null | CP business name | "Gold CP - Bellandur" |
| customer_name | String | Customer name | "Suresh Patel" |
| loan_amount | Number | Loan amount (₹) | 2500000 |
| stage | String | Current stage | "Query" |
| stage_detail | String | Stage specific details | "Income proof pending" |
| days_in_stage | Number | Days in current stage | 2 |
| blocker_reason | String/null | If blocked, reason | "Document missing" |
| potential_incentive | Number | Expected incentive (₹) | 2500 |
| priority | String | Priority level | "High" |

### Lead Stages:
| Stage | Count | Description | RM Action |
|-------|-------|-------------|-----------|
| Query | 12 | Query raised by ops | Call customer + provide docs |
| LD (Login Done) | 10 | Login completed | Follow-up for ops submission |
| Disbursement_Ready | 5 | Ready to disburse | Monitor disbursal |
| Login | 6 | Initial login stage | Push to LD |
| External | 2 | External sourced leads | Follow-up for conversion |

### Sample Data:
```json
{
  "lead_id": "L-56102",
  "rm_id": "RM3",
  "cp_id": "CP3",
  "cp_name": "Gold CP - Bellandur",
  "customer_name": "Suresh Patel",
  "loan_amount": 2500000,
  "stage": "Query",
  "stage_detail": "Income proof pending",
  "days_in_stage": 2,
  "blocker_reason": "Customer hasn't submitted bank statement",
  "potential_incentive": 2500,
  "priority": "High"
}
```

### Lead Distribution by RM:
| RM ID | Total Leads | Query | LD | Disb Ready | Priority |
|-------|-------------|-------|----|-----------| ---------|
| RM1 | 3 | 1 | 1 | 0 | Low volume (learning) |
| RM2 | 4 | 1 | 1 | 0 | Low volume (learning) |
| RM3 | 8 | 3 | 2 | 1 | Balanced pipeline |
| RM4 | 5 | 2 | 1 | 1 | Mid volume |
| RM5 | 4 | 1 | 2 | 1 | Mid volume |
| RM6 | 4 | 1 | 1 | 1 | Quality over quantity |
| RM7 | 4 | 2 | 1 | 1 | Quality focus |
| RM8 | 3 | 1 | 1 | 0 | Strategic |

---

## 🔗 RELATIONSHIPS

### RM → CP (One-to-Many)
- One RM manages multiple CPs
- Defined in RM table `assigned_cps` field
- Example: RM3 manages CP3, CP4, CP5, CP16, CP19

### CP → RM (Many-to-One or Many-to-Many)
- One CP can be shared by multiple RMs
- Example: CP3 is assigned to both RM3 and RM6

### RM → Leads (One-to-Many)
- One RM owns multiple leads
- Defined in Leads table `rm_id` field

### CP → Leads (One-to-Many)
- One CP sources multiple leads
- Defined in Leads table `cp_id` field
- Some leads have `cp_id = null` (direct/external sourced)

### Complete Relationship:
```
RM1 ──┬── CP6 (Silver) ──┬── Lead L-45621
      ├── CP7 (Silver)   ├── Lead L-45632
      ├── CP8 (Silver)   └── No leads yet
      ├── CP11 (Orphan)
      ├── CP13 (New)
      └── CP20 (Silver)
```

---

## 📈 DATA SUMMARY

### CPs by Status:
- Active: 15 (75%)
- Dormant: 3 (15%)
- Orphan: 2 (10%)

### CPs by Area:
- Whitefield: 2
- Marathahalli: 2  
- Bellandur: 1
- Electronic City: 1
- Koramangala: 1
- Others: 13 (distributed)

### Leads by Source:
- CP Sourced: 28 (80%)
- External/Direct: 7 (20%)

### Average Metrics:
- Avg CP vintage: 18 months
- Avg files/CP/month: 2.1
- Avg TAT: 10 days
- Avg payout/CP: ₹85,000

---

## 🎯 KEY INSIGHTS

1. **RM Performance Distribution:**
   - 25% Low performers (RM1, RM2)
   - 37.5% Mid performers (RM3, RM4, RM5)
   - 37.5% High performers (RM6, RM7, RM8)

2. **CP Network Health:**
   - 75% active CPs
   - 15% need reactivation (Dormant)
   - 10% need relationship reset (Orphan)

3. **Pipeline Distribution:**
   - 34% in Query stage (urgent attention needed)
   - 29% in LD stage (fast-track possible)
   - 14% ready for disbursement
   - 17% in Login stage
   - 6% external leads

4. **CP-RM Optimal Ratios:**
   - Low performers: 4-6 CPs (building network)
   - Mid performers: 4-5 CPs (balanced)
   - High performers: 3 CPs (quality focus)

---

**This data structure supports the ARYA decision science framework for intelligent beat planning and CP management.**
