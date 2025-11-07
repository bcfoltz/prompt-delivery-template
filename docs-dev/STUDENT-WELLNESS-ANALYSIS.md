# Student Wellness Prompts Analysis

## Overview

The student wellness category contains 20 prompts focused on mental health, wellbeing, and student life support. These prompts have significant differences from the existing advisor, student, and study-guides categories and require careful review before integration into the production app.

---

## Current State Issues

### 1. Length Problem

**Issue**: Prompts are 300-400 lines long - far too long for practical use

**Examples**:
- `student-wellness-prompt-01.md` (Stress Management): 69 lines
- `student-wellness-prompt-02.md` (Sleep): 104 lines
- `student-wellness-prompt-03.md` (Connection/Loneliness): 131 lines
- `student-wellness-prompt-10.md` (Relationship Communication): 330 lines
- `student-wellness-prompt-15.md` (Loneliness Roadmap): 394 lines
- `student-wellness-prompt-20.md` (Rest Assessment): 327 lines

**Impact**:
- Won't fit on single PDF page
- Too long to copy/paste easily
- Overwhelming for students
- Inconsistent with other prompt categories (15-40 lines)

---

### 2. PII (Personally Identifiable Information) Concerns

Many prompts encourage students to enter sensitive personal information that could:
- Be retained in LLM conversation history
- Create privacy/security risks
- Violate FERPA if stored improperly
- Create liability issues

#### High-Risk PII Prompts:

**Financial Information** (prompt 04):
```
{monthly_income}: $850 (mix of family support, part-time job, work-study)
{biggest_expense_concerns}: Food costs more than expected...
{current_debt_or_loans}: $15,000 in federal student loans...
```
- Income amounts
- Debt levels
- Financial struggles

**Sleep/Health Data** (prompt 02):
```
{current_sleep_hours}: 5-6 hours on weeknights...
{biggest_sleep_challenge}: Roommate goes to bed at 2am...
{typical_bedtime}: Varies wildly...
```
- Health patterns
- Roommate information
- Personal schedules

**Identity Information** (prompt 12):
```text
Questions include:
- "Are you comfortable sharing aspects of your identity?"
- BIPOC status
- LGBTQI+ identity
- Low-income status
- Disability status
- Immigration status
```
- Protected class information
- Potentially sensitive identity data
- Could be used discriminatorily if breached

**Relationship Details** (prompt 10):
```
{relationship_situation}: My roommate keeps having friends over late...
```
- Roommate conflicts
- Romantic relationship issues
- Family tensions

**Mental Health Details** (prompt 01, 03, 15, 20):
- Stress levels (1-10 scales)
- Loneliness descriptions
- Anxiety triggers
- Depression indicators

---

### 3. Medical/Professional Disclaimer Requirements

Many prompts provide advice in areas requiring professional credentials. **We must add disclaimers** to avoid liability and ensure student safety.

#### Prompts Requiring Disclaimers:

| Prompt # | Topic | Disclaimer Needed |
|----------|-------|-------------------|
| 01 | Stress Management | Mental health professional disclaimer |
| 02 | Sleep Transformation | Not medical advice - consult doctor for insomnia |
| 03 | Loneliness/Connection | Mental health support - not therapy replacement |
| 04 | Financial Planning | Not certified financial advice |
| 05 | Digital Wellness | Screen time guidance - not addiction treatment |
| 08 | Mindfulness Practice | Meditation guidance - not mental health treatment |
| 10 | Relationship Communication | Not professional counseling |
| 12 | Identity-Affirming Wellness | Not therapy - cultural competence needed |
| 15 | Loneliness Roadmap | Not clinical treatment for depression |
| 20 | Rest Assessment | Not medical diagnosis - consult provider |

**Example disclaimer needed**:

> **Important Disclaimer**: I am an AI assistant, not a licensed mental health professional, doctor, or counselor. The guidance provided is for informational and educational purposes only and should not replace professional medical advice, diagnosis, or treatment. If you are experiencing severe distress, mental health crisis, or thoughts of self-harm, please contact:
>
> - **Campus Counseling Services**: [Your University Mental Health Center]
> - **Crisis Text Line**: Text HOME to 741741
> - **National Suicide Prevention Lifeline**: 988
> - **Emergency**: 911
>
> For persistent sleep, mental health, or medical concerns, consult a licensed healthcare provider.

---

### 4. Structural Differences from Other Prompt Categories

#### Current Prompt Categories (advisor, student, study-guides):

**Structure**:
- 15-40 lines
- Template variables: `{variable}:`
- Concise, focused prompts
- "Example" and "Student Information" sections
- Single-page PDF friendly

**Example** (`student-prompt-01.md`):
```markdown
# Title

[Persona and role description]

[Core instructions]

## Example

{field}:
{level}:

## Student Information

{field}:
{level}:
```

#### Student Wellness Prompts:

**Structure**:
- 300-400 lines (10x longer)
- Extensive multi-week plans
- No template variables (asks questions dynamically)
- Comprehensive frameworks (DEAR MAN, 7 types of rest, etc.)
- Resource lists
- Week-by-week implementation schedules

**Example** (`student-wellness-prompt-02.md`):
```markdown
# The Sleep Transformation Protocol

[Extensive persona]

**Start by asking follow-up questions one at a time:**
1-5. [Questions]

**Then create a comprehensive 4-week sleep transformation plan:**
1. Sleep Assessment
2. Week 1: Foundation Building
3. Week 2: Deepening the Routine
4. Week 3: Lifestyle Integration
5. Week 4: Fine-Tuning
6. Sleep Hygiene Checklist
7. Technology Management
8. Troubleshooting Guide
9. Progress Tracking

[30-40 more sections with detailed sub-bullets]
```

---

## Recommendations

### Option 1: Condense and Conform (Recommended)

**Make student wellness prompts consistent with existing categories**:

1. **Reduce length**: Condense from 300-400 lines to 40-60 lines maximum
2. **Add disclaimers**: Medical/professional disclaimer at the top of sensitive prompts
3. **Remove PII templates**: Don't ask for specific financial amounts, health data, or identity details
4. **Simplify structure**:
   - Short persona
   - Core guidance principles
   - Template variables for general context only (e.g., `{wellness_goal}:` not `{income_amount}:`)
   - Brief resource list

**Benefits**:
- Consistent user experience
- PDF-friendly
- Reduced privacy/liability concerns
- Easier to copy/paste
- Maintains quality while being practical

**Effort**: Moderate (rewrite 20 prompts)

---

### Option 2: Keep Comprehensive, Add Safeguards

**Maintain long-form wellness prompts with protective measures**:

1. **Keep current length and depth**
2. **Add prominent disclaimers** at the top
3. **Remove explicit PII requests**: Change "enter your income" to "describe your general financial situation"
4. **Separate category**: Keep wellness prompts distinct from other categories
5. **Different delivery method**: Perhaps link to external resource instead of PDF/copy

**Benefits**:
- Maintains comprehensive guidance
- Students get full support frameworks
- Preserves clinical quality

**Drawbacks**:
- Won't work with current PDF generation
- Too long to copy/paste
- Still carries some PII/liability risk
- Inconsistent with site UX

**Effort**: Low (add disclaimers only)

---

### Option 3: Hybrid Approach (Best of Both)

**Create two versions of each wellness prompt**:

1. **Short Version** (40-60 lines):
   - Fits current site structure
   - Includes disclaimer
   - Core guidance only
   - Template variables for general context
   - Link to "Full Wellness Guide"

2. **Full Version** (keep current length):
   - Separate document/resource
   - Comprehensive frameworks
   - Week-by-week plans
   - Linked from short version
   - Not in main prompt delivery system

**Benefits**:
- Best of both worlds
- Maintains consistency on main site
- Provides depth for students who want it
- Separates casual use from deep dive

**Drawbacks**:
- Most work (40 prompts total)
- Requires separate hosting/delivery for full versions

**Effort**: High (create 20 condensed versions + organize full versions)

---

## PII Mitigation Strategies

Regardless of approach chosen, implement these safeguards:

### 1. Remove Explicit PII Requests

**Before**:
```
{monthly_income}: $850 (mix of family support...)
{current_debt_or_loans}: $15,000 in federal student loans
```

**After**:
```
{financial_situation}: (Describe your general financial situation without specific amounts)
```

### 2. Generalize Identity Questions

**Before**:
```
1. Are you comfortable sharing aspects of your identity?
   (BIPOC, LGBTQI+, low-income, disability, etc.)
```

**After**:
```
{identity_context}: (Optional) Share any identity-related factors affecting your college experience
```

### 3. Add Privacy Reminders

Add to template variable sections:
```
## Student Information

**Privacy Note**: Only share what you're comfortable with.
Avoid including identifying details like names, specific locations, or account numbers.
```

---

## Disclaimer Template

For prompts requiring medical/mental health disclaimers:

```markdown
# [Prompt Title]

**⚠️ Important Disclaimer**: This AI provides general wellness information and educational guidance only. It is **not a substitute for professional medical advice, mental health treatment, or counseling**.

If you are experiencing:
- Mental health crisis or thoughts of self-harm → **Call 988** (Suicide & Crisis Lifeline)
- Severe anxiety, depression, or emotional distress → **Contact Campus Counseling**
- Medical concerns → **Consult a licensed healthcare provider**

**Crisis Resources**:
- 988 Suicide & Crisis Lifeline: Call or text 988
- Crisis Text Line: Text HOME to 741741
- Campus Emergency: [Your campus hotline]

For ongoing support, connect with your campus counseling center or healthcare provider.

---

[Rest of prompt content]
```

---

## Next Steps

### Recommended Action Plan:

1. **Immediate**: Review all 20 prompts to categorize by:
   - PII risk level (High/Medium/Low)
   - Disclaimer requirement (Yes/No)
   - Current length

2. **Decision**: Choose Option 1 (Condense), Option 2 (Keep + Safeguards), or Option 3 (Hybrid)

3. **Implementation**:
   - Add disclaimers where needed
   - Remove/generalize PII requests
   - Condense prompts (if Option 1 or 3)
   - Test with PDF generation
   - Lint with markdown-lint skill

4. **Review**: Legal/compliance check if possible (student affairs, general counsel)

5. **Document**: Update `prompt-descriptions.json` with marketing taglines for wellness category

---

## Appendix: Full Prompt Inventory

| # | Title | Lines | PII Risk | Disclaimer? | Notes |
|---|-------|-------|----------|-------------|-------|
| 01 | Stress Management System | 69 | Medium | Yes | Asks stress level 1-10, coping methods |
| 02 | Sleep Transformation | 104 | Medium | Yes | Sleep hours, bedtime, health patterns |
| 03 | Connection Builder (Loneliness) | 131 | Medium | Yes | Social situation, comfort levels |
| 04 | Financial Wellness | 182 | **HIGH** | Yes | Income, debt, expenses - **specific amounts** |
| 05 | Digital Wellness Boundaries | 158 | Low | No | Screen time, app usage (general) |
| 06-09 | [Need to read] | ? | ? | ? | Not reviewed yet |
| 10 | Relationship Communication | 330 | Medium | Yes | Relationship details, conflicts |
| 11-14 | [Need to read] | ? | ? | ? | Not reviewed yet |
| 15 | Loneliness-to-Connection Roadmap | 394 | Medium | Yes | Social anxiety, belonging, identity |
| 16-19 | [Need to read] | ? | ? | ? | Not reviewed yet |
| 20 | Strategic Rest Assessment | 327 | Low | Yes | Rest deficits, exhaustion (general) |

**Status**: 7/20 prompts reviewed so far

---

## Questions for User

1. Which option do you prefer: **Condense** (Option 1), **Keep Long + Safeguards** (Option 2), or **Hybrid** (Option 3)?

2. Do you have access to legal/compliance review for student wellness content?

3. What is the priority: **Speed to launch** vs. **Comprehensive support** vs. **Risk mitigation**?

4. Should student wellness be a separate category from student prompts, or integrated?

5. Are you comfortable with the PII risks even after mitigation, or should we eliminate all PII collection?
