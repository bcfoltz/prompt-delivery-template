# Adding New Prompt Categories

**Last Updated:** 2025-10-26
**Status:** Production-Ready Guide
**Estimated Time:** ~70 minutes per category

---

## Overview

This guide documents the process for adding new prompt categories to the SHPE-2025 prompt delivery system.

**Current Categories:**

- `student` - 15 prompts for college students
- `advisor` - 10 prompts for academic advisors
- `study-guides` - 20 prompts for creating study materials
- `student-wellness` - 20 prompts for mental health and wellbeing

**Tested & Verified:**
- ✅ Study Tools (Oct 2025) - All 4 common failures encountered and fixed
- ✅ Student Wellness (Oct 2025) - 3 critical bugs discovered and fixed:
  - Dev mode loading bug (TypeError in console)
  - Desktop grid layout (cramped buttons)
  - Copy button silent failure (most insidious - no error message!)

**Potential Future Categories:**

Categories can be **role-based** (audience types) or **topic-based** (subject areas):

**Role-Based Examples:**
- `faculty` - Teaching faculty and instructors
- `administrators` - Department chairs, deans, program directors
- `parents` - Parents and guardians of students
- `industry` - Industry partners and employers
- `researchers` - Graduate students and researchers

**Topic-Based Examples:**
- `study-skills` - Study techniques, time management, organization
- `career-prep` - Resume writing, interviewing, networking
- `research-methods` - Literature review, data analysis, academic writing
- `wellness` - Mental health, work-life balance, stress management
- `technology` - Software tools, productivity apps, digital literacy
- `communication` - Public speaking, writing, collaboration

---

## Current Architecture

### Directory Structure

```text
prompts/
├── student/
│   ├── begin/          # 15 source prompts (student-prompt-01.md to 15)
│   └── result/         # Test outputs (ignored by build)
└── advisor/
    ├── begin/          # 10 source prompts (advisor-prompt-01.md to 10)
    └── result/         # Test outputs (ignored by build)
```

### Data Flow

1. **Source:** Markdown files in `prompts/{category}/begin/*.md`
2. **Build:** `scripts/build-prompts.js` processes all categories
3. **Output:** `prompts-data.json` (consumed by app.js)
4. **Display:** `index.html` + `app.js` render UI dynamically
5. **Download:** `prompts-download.zip` includes all categories

### Key Files Affected

| File | Lines | Purpose |
|------|-------|---------|
| `prompts/{category}/begin/*.md` | N/A | Source markdown prompts |
| `scripts/build-prompts.js` | 215-226 | Category scanning and parsing |
| `prompt-descriptions.json` | N/A | Marketing taglines for UI |
| `app.js` | Various | Route handling and rendering |
| `index.html` | 42-86 | Landing page buttons + list views |
| `prompts-download/README.md` | 13-290 | User-facing documentation |
| `prompts-download/{category}-prompts/` | N/A | Downloaded markdown files |

---

## Step-by-Step Implementation

### Phase 1: Directory Structure (5 min)

Create the folder structure for your new category:

```bash
mkdir -p prompts/{new-category}/begin
mkdir -p prompts/{new-category}/result  # Optional: for test outputs
```

**Naming Convention:**

- Category folder: `prompts/{category}/begin/`
- Prompt files: `{category}-prompt-01.md`, `{category}-prompt-02.md`, etc.
- Use two-digit numbers: `01` not `1`
- Use lowercase with hyphens: `study-skills` not `StudySkills` or `study_skills`

**Prompt Ordering:**

For guidance on **adding new prompts** to existing categories or **reordering prompts**, see the **[Prompt Ordering Guide](PROMPT-ORDERING-GUIDE.md)** which covers:
- **Prepend** (add to top with `00`, `000`, or `-1`)
- **Append** (add to bottom with next number)
- **Content Swap** (reorder without renaming files)
- Comparison matrix and use case recommendations

**Examples:**

**Role-Based Category:**
```bash
mkdir -p prompts/faculty/begin
# Add files: faculty-prompt-01.md through faculty-prompt-08.md
```

**Topic-Based Category:**
```bash
mkdir -p prompts/study-skills/begin
# Add files: study-skills-prompt-01.md through study-skills-prompt-12.md
```

**Important Note:** Category names become URL hashes (e.g., `#study-skills`), button IDs (e.g., `btn-study-skills`), and container IDs (e.g., `study-skills-list-view`). Choose descriptive, URL-friendly names.

### Phase 2: Build Script Updates (10 min)

**File:** `scripts/build-prompts.js`

**Step 2.1:** Add category to prompt reading (around line 215)

```javascript
// Find this section:
const studentPrompts = readPromptFiles('prompts/student/begin', 'student');
const advisorPrompts = readPromptFiles('prompts/advisor/begin', 'advisor');

// Add your new category:
const facultyPrompts = readPromptFiles('prompts/faculty/begin', 'faculty');
```

**Step 2.2:** Update `allPrompts` object (around line 218)

```javascript
const allPrompts = {
  student: studentPrompts,
  advisor: advisorPrompts,
  faculty: facultyPrompts,  // ADD THIS
  metadata: {
    totalPrompts: studentPrompts.length + advisorPrompts.length + facultyPrompts.length,  // UPDATE THIS
    studentCount: studentPrompts.length,
    advisorCount: advisorPrompts.length,
    facultyCount: facultyPrompts.length,  // ADD THIS
    generatedAt: new Date().toISOString()
  }
};
```

**Step 2.3:** Update manifest output (around line 234)

```javascript
const manifest = {
  student: studentPrompts.map(p => {...}),
  advisor: advisorPrompts.map(p => {...}),
  faculty: facultyPrompts.map(p => {...})  // ADD THIS
};
```

**Step 2.4:** Add title extraction patterns (OPTIONAL, lines 102-208)

If your prompts use unique phrasing, add pattern matching:

```javascript
// Faculty prompts
if (firstLine.includes('instructional design') && firstLine.includes('faculty')) {
  return 'Design Effective Course Materials';
}
```

**Step 2.5:** Test the build

```bash
npm run build
```

Expected output:

```text
✓ Parsed student prompts: 15
✓ Parsed advisor prompts: 10
✓ Parsed faculty prompts: 8
✓ Total prompts: 33
```

### Phase 3: Marketing Descriptions (10 min) - REQUIRED

**CRITICAL: Separation of Content and Marketing**

Marketing taglines are stored **separately** from prompt content to maintain clean separation of concerns:

- **Prompt `.md` files** = Pure instructional content (what the AI does)
- **`prompt-descriptions.json`** = Marketing copy (what users see in UI)

**DO NOT SKIP THIS PHASE!** Without marketing descriptions, your prompt cards will only show the first line of the prompt content instead of compelling "Shamwow!" style taglines.

**File:** `prompt-descriptions.json`

Add marketing taglines for EVERY new prompt (50-150 characters, action-oriented, benefit-focused):

```json
{
  "student-prompt-01": "Decode the job market!...",
  "advisor-prompt-01": "Give students evidence-based advice...",

  // Role-based example (faculty):
  "faculty-prompt-01": "Design engaging course materials that students actually complete!",
  "faculty-prompt-02": "Create assessments that measure real understanding, not just memorization!",

  // Topic-based example (study-skills):
  "study-skills-prompt-01": "Master the Pomodoro Technique for focused study sessions!",
  "study-skills-prompt-02": "Build a personalized study schedule that actually works!"
}
```

**✅ WHERE Taglines GO:**

1. **`prompt-descriptions.json`** (PRIMARY SOURCE)
   - JSON file at project root
   - Maps prompt IDs to taglines
   - Used by build script to generate `prompts-data.json`

2. **`prompts-data.json`** (GENERATED OUTPUT)
   - Auto-generated by `npm run build`
   - Contains full prompt object with description field
   - Consumed by app.js to display in UI

3. **Web App UI** (RUNTIME DISPLAY)
   - Shown as subtitle under prompt title in card view
   - Helps users decide which prompt to click
   - Example: Card shows "Research Entry-Level Skills" (title) + "Decode the job market!..." (tagline)

**❌ WHERE Taglines DON'T GO:**

1. **Prompt `.md` files** (prompts/student/begin/student-prompt-01.md)
   - ❌ DO NOT add taglines to markdown files
   - ❌ DO NOT add marketing copy after the title
   - ✅ ONLY include the instruction prompt that goes to the AI

2. **`prompts-download.zip` files**
   - ❌ Downloaded markdown files should NOT contain taglines
   - ✅ Users get clean prompt content only
   - **Why:** Users copy/paste into AI - taglines would be confusing

3. **PDF versions** (if regenerated)
   - ❌ PDFs should NOT show taglines
   - ✅ Only show title + prompt content
   - **Why:** Professional documentation format

**Why This Separation Matters:**

| Concern | Benefit |
|---------|---------|
| **Clean Prompts** | Users get pure AI instructions without marketing fluff |
| **Easy Updates** | Change taglines without touching 25+ markdown files |
| **Single Source** | One JSON file controls all UI descriptions |
| **Version Control** | Git diffs show marketing changes separately from content changes |
| **Testing** | Can A/B test taglines without modifying prompts |

**Example of WRONG Approach (DO NOT DO THIS):**

```markdown
# Research Entry-Level Skills for Your Field

Decode the job market! Get data-driven insights on the top 5-7 skills...  ❌ WRONG - tagline in content

Imagine you are a career counselor who specializes in helping college students...
```

**Example of CORRECT Approach:**

**File:** `prompts/student/begin/student-prompt-01.md`
```markdown
# Research Entry-Level Skills for Your Field

Imagine you are a career counselor who specializes in helping college students...
```

**File:** `prompt-descriptions.json`
```json
{
  "student-prompt-01": "Decode the job market! Get data-driven insights on the top 5-7 skills..."
}
```

**Style Guide for Taglines:**

- **Length:** 50-100 characters (fits in card UI)
- **Tone:** Energetic, action-oriented, benefit-focused
- **Format:** Start with action verb + benefit/outcome
- **Punctuation:** Use exclamation points for energy
- **Specificity:** Mention concrete deliverables ("top 5-7 skills" not "useful insights")
- **Audience:** Write for users browsing prompts, not AI consumption

**Good Examples:**
- ✅ "Master the Pomodoro Technique for focused study sessions!"
- ✅ "Turn classroom learning into resume gold with STAR stories!"
- ✅ "Build a 4-year roadmap that adapts as your goals evolve!"

**Bad Examples:**
- ❌ "This prompt helps with study skills" (boring, vague)
- ❌ "A useful tool for managing your time better" (passive, generic)
- ❌ "Imagine you are an expert in time management who..." (instruction, not tagline)

**After adding all marketing descriptions, rebuild prompts-data.json:**

```bash
npm run build
```

Verify that your new descriptions appear:

```bash
node -e "const data = require('./prompts-data.json'); console.log(data.faculty[0].description);"
```

You should see your marketing tagline, NOT the first line of the prompt content.

### Phase 4: UI Implementation (20 min)

#### 4A: Add Landing Page Button

**File:** `index.html` (around line 42)

Add button after existing buttons:

```html
<div class="button-group">
  <button id="btn-students" class="track-button" aria-label="View prompts for students">
    <span class="button-icon" aria-hidden="true">🎓</span>
    <span class="button-text">For Students</span>
  </button>

  <button id="btn-advisors" class="track-button" aria-label="View prompts for advisors">
    <span class="button-icon" aria-hidden="true">👨‍🏫</span>
    <span class="button-text">For Advisors</span>
  </button>

  <!-- ADD NEW BUTTON HERE -->
  <button id="btn-faculty" class="track-button" aria-label="View prompts for faculty">
    <span class="button-icon" aria-hidden="true">👩‍🏫</span>
    <span class="button-text">For Faculty</span>
  </button>
</div>
```

**Icon Suggestions:**

- Faculty: 👩‍🏫 or 📚
- Administrators: 💼 or 🏛️
- Parents: 👨‍👩‍👧‍👦 or 🏠
- Industry: 🏭 or 💡
- Researchers: 🔬 or 📊

#### 4B: Add List View Section

**File:** `index.html` (after line 86)

```html
<!-- Prompt List View (Faculty) -->
<section id="faculty-list-view" class="view prompt-list-view" role="region" aria-labelledby="faculty-heading">
  <div class="container">
    <header class="list-header">
      <button id="back-from-faculty" class="back-button" aria-label="Back to home">
        ← Back
      </button>
      <h2 id="faculty-heading">Faculty Prompts</h2>
    </header>

    <div id="faculty-prompts-container" class="prompts-container">
      <!-- Faculty prompt items will be dynamically inserted here -->
    </div>
  </div>
</section>
```

#### 4C: Update App Logic

**File:** `app.js`

**Step 4C.1:** Add event listener (search for `setupEventListeners`)

```javascript
function setupEventListeners() {
  document.getElementById('btn-students').addEventListener('click', () => navigateTo('students'));
  document.getElementById('btn-advisors').addEventListener('click', () => navigateTo('advisors'));
  document.getElementById('btn-faculty').addEventListener('click', () => navigateTo('faculty'));  // ADD THIS

  document.getElementById('back-from-students').addEventListener('click', () => navigateTo('landing'));
  document.getElementById('back-from-advisors').addEventListener('click', () => navigateTo('landing'));
  document.getElementById('back-from-faculty').addEventListener('click', () => navigateTo('landing'));  // ADD THIS
  // ... rest of listeners
}
```

**Step 4C.2:** Update route handling (search for `handleRoute`)

```javascript
function handleRoute() {
  const hash = window.location.hash.slice(1);

  if (hash === 'students') {
    showView('student-list-view');
    renderPromptList('student');
  } else if (hash === 'advisors') {
    showView('advisor-list-view');
    renderPromptList('advisor');
  } else if (hash === 'faculty') {  // ADD THIS BLOCK
    showView('faculty-list-view');
    renderPromptList('faculty');
  } else {
    showView('landing-page');
  }
}
```

**Step 4C.3:** Update `showPromptList` function (REQUIRED)

Find the `showPromptList` function and add your category:

```javascript
function showPromptList(category) {
  if (!promptsData) return;

  const previousView = currentView;
  hideAllViews();
  currentView = category;

  if (category === 'student') {
    document.getElementById('student-list-view').classList.add('active');
    renderPromptList('student', promptsData.student);
  } else if (category === 'advisor') {
    document.getElementById('advisor-list-view').classList.add('active');
    renderPromptList('advisor', promptsData.advisor);
  } else if (category === 'faculty') {  // ADD THIS BLOCK
    document.getElementById('faculty-list-view').classList.add('active');
    renderPromptList('faculty', promptsData.faculty);
  }

  // ... rest of function
}
```

**Step 4C.4:** Update scroll logic in `showPromptList` (REQUIRED)

Find the `listViewId` ternary around line 306 and add your category:

```javascript
const listViewId = category === 'student' ? 'student-list-view'
                 : category === 'advisor' ? 'advisor-list-view'
                 : 'faculty-list-view';  // ADD THIS LINE
```

**Step 4C.5:** Update `renderPromptList` function (REQUIRED)

Find the `renderPromptList` function and update the `containerId`:

```javascript
function renderPromptList(category, prompts) {
  const containerId = category === 'student' ? 'student-prompts-container'
                    : category === 'advisor' ? 'advisor-prompts-container'
                    : 'faculty-prompts-container';  // ADD THIS LINE
  const container = document.getElementById(containerId);
  // ... rest of function
}
```

**Step 4C.6:** Update `showPromptModal` function (REQUIRED)

Find the `showPromptModal` function and add your category to the allPrompts array:

```javascript
function showPromptModal(promptId) {
  if (!promptsData) return;

  // Find the prompt - ADD YOUR CATEGORY HERE
  const allPrompts = [
    ...promptsData.student,
    ...promptsData.advisor,
    ...promptsData.faculty  // ADD THIS LINE
  ];
  const prompt = allPrompts.find(p => p.id === promptId);
  // ... rest of function
}
```

**Step 4C.7:** Update modal theme logic (REQUIRED)

Find the modal theme assignment and add your category:

```javascript
// Add category class to modal for themed styling
const modal = document.getElementById('prompt-modal');
const category = promptId.startsWith('student-') ? 'student-theme'
               : promptId.startsWith('advisor-') ? 'advisor-theme'
               : 'faculty-theme';  // ADD THIS LINE
modal.classList.remove('student-theme', 'advisor-theme', 'faculty-theme');  // ADD YOUR THEME
modal.classList.add(category);
```

**Step 4C.8:** Update `closeModal` function (REQUIRED)

Find the `closeModal` function and update the category detection:

```javascript
function closeModal() {
  document.getElementById('prompt-modal').classList.remove('active');
  document.body.classList.remove('modal-open');

  // Navigate back to the appropriate list
  if (currentPromptId) {
    const category = currentPromptId.startsWith('student-') ? 'students'
                   : currentPromptId.startsWith('advisor-') ? 'advisors'
                   : 'faculty';  // ADD THIS LINE
    navigateTo(`#${category}`);
  } else {
    navigateTo('#');
  }
}
```

**Step 4C.9:** Update `copyPromptToClipboard` function (REQUIRED - CRITICAL BUG)

Find the `copyPromptToClipboard` function (around line 640) and add your category to the allPrompts array:

```javascript
async function copyPromptToClipboard() {
  if (!currentPromptId) return;

  // Find the current prompt - ADD YOUR CATEGORY HERE
  const allPrompts = [
    ...promptsData.student,
    ...promptsData.advisor,
    ...promptsData.faculty  // ADD THIS LINE
  ];
  const prompt = allPrompts.find(p => p.id === currentPromptId);
  // ... rest of function
}
```

**⚠️ CRITICAL:** If you forget this step, the "Copy Prompt" button will silently fail for your category! The button will appear to work but nothing gets copied to clipboard.

**CRITICAL:** There are NINE places in app.js that use hardcoded category checks:
1. `loadPromptsFromMarkdown()` - Add loading for your category (dev mode only) [Step 4C.Dev]
2. `showPromptList()` - Add else if for your category (shows the list) [Step 4C.3]
3. Scroll logic in `showPromptList()` - Update ternary for listViewId (scrolling behavior) [Step 4C.4]
4. `renderPromptList()` - Update ternary for containerId (renders cards) [Step 4C.5]
5. `showPromptModal()` - Add to allPrompts array (opens individual prompts) [Step 4C.6]
6. `copyPromptToClipboard()` - Add to allPrompts array (copy button functionality) [Step 4C.9] ⚠️
7. Modal theme logic - Add your theme (modal styling) [Step 4C.7]
8. Modal classList.remove - Add your theme class (cleanup) [Step 4C.7]
9. `closeModal()` - Add category detection (navigation after closing) [Step 4C.8]

**Missing ANY of these will cause the category to fail partially or completely!**

Most common oversight: Forgetting Step 4C.9 causes silent copy button failure.

### Phase 5: Button Styling & Colors (5-10 min)

**IMPORTANT:** Each category should have distinct, accessible button colors.

#### 5A: Choose Accessible Colors (REQUIRED for new categories)

**Current SHPE Color Assignments:**
- **Students**: Orange `#D44500` (SHPE brand primary)
- **Advisors**: Navy `#002D56` (SHPE brand secondary)
- **Study Tools**: Teal `#0082B3` → `#00A3E0` (SHPE accent color)

**Available SHPE Colors:**
From `styles.css:44-51`:
```css
--color-shpe-orange: #D44500;        /* Used: Students */
--color-shpe-orange-dark: #B83D00;
--color-shpe-navy: #002D56;          /* Used: Advisors */
--color-shpe-navy-light: #003D72;
--color-shpe-teal: #00A3E0;          /* Used: Study Tools (light) */
--color-shpe-teal-dark: #0082B3;     /* Used: Study Tools (dark) */
```

**Accessibility Requirements (WCAG 2.1 Level AA):**
- White text on colored background: **4.5:1 minimum contrast ratio**
- Test your color with: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Color Selection Examples:**

**Good Options:**
- ✅ Teal Dark `#0082B3` - Contrast: 4.52:1 (PASSES)
- ✅ Navy `#002D56` - Contrast: 12.63:1 (PASSES)
- ✅ Orange `#D44500` - Contrast: 4.54:1 (PASSES)

**Bad Options:**
- ❌ Teal Light `#00A3E0` - Contrast: 3.08:1 (FAILS)
- ❌ Light Blue `#87CEEB` - Contrast: 2.2:1 (FAILS)

#### 5B: Add Button Styling

**File:** `styles.css` (around line 233)

Add button-specific styling after existing button styles:

```css
/* Faculty button uses [Your Color] theme */
#btn-faculty {
  background: linear-gradient(135deg, #YourDarkColor 0%, #YourLightColor 100%);
  box-shadow: 0 4px 12px rgba(R, G, B, 0.3);  /* Use RGB of your color */
}
```

**File:** `styles.css` (around line 267)

Add hover effect:

```css
#btn-faculty:hover,
#btn-faculty:focus {
  box-shadow: 0 8px 24px rgba(R, G, B, 0.4);  /* Same RGB, higher opacity */
}
```

**Complete Example (Teal):**

```css
/* Study Tools button uses Teal theme */
#btn-study-guides {
  background: linear-gradient(135deg, #0082B3 0%, #00A3E0 100%);
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.3);
}

#btn-study-guides:hover,
#btn-study-guides:focus {
  box-shadow: 0 8px 24px rgba(0, 163, 224, 0.4);
}
```

**Converting Hex to RGB for box-shadow:**
- Teal `#00A3E0` = `rgba(0, 163, 224, 0.3)`
- Navy `#002D56` = `rgba(0, 45, 86, 0.3)`
- Orange `#D44500` = `rgba(212, 69, 0, 0.3)`

Use online tool: [Hex to RGB Converter](https://www.rgbtohex.net/hextorgb/)

#### 5C: Branding Config (Optional)

**File:** `branding-config.json`

Update site description if adding categories changes overall scope:

```json
{
  "site": {
    "title": "SHPE 2025 - LLM Prompts",
    "description": "LLM Prompts for Students, Advisors, and Faculty - SHPE 2025",  // UPDATE
    "heading": "AI-Powered Academic Prompts",
    "subtitle": "Choose the prompts designed for you"
  }
}
```

#### 5D: Color Documentation

Document your color choice in CLAUDE.md or commit message:

```markdown
**Category Colors:**
- Students: Orange (#D44500) - WCAG AA: 4.54:1 ✅
- Advisors: Navy (#002D56) - WCAG AA: 12.63:1 ✅
- Study Tools: Teal (#0082B3-#00A3E0) - WCAG AA: 4.52:1 ✅
- Faculty: [Your Color] (#XXXXXX) - WCAG AA: X.XX:1 ✅
```

### Phase 6: Download Package (15 min)

#### 6A: Create Category Folder

```bash
mkdir -p prompts-download/faculty-prompts
```

#### 6B: Copy Prompts to Download Folder

```bash
cp prompts/faculty/begin/*.md prompts-download/faculty-prompts/
```

#### 6C: Update README

**File:** `prompts-download/README.md`

**Update Line 13:** About This Collection

```markdown
This collection contains **33 carefully crafted prompts** designed to help students, academic advisors, and faculty leverage AI tools for academic and career development:

- **15 Student Prompts** - Help with skills research, course selection, project development...
- **10 Advisor Prompts** - Support for student guidance, curriculum development...
- **8 Faculty Prompts** - Assistance with course design, assessment creation, and teaching strategies
```

**Update Line 55:** Usage Instructions

```markdown
1. **Browse the folders** to find a prompt that matches your needs:
   - `student-prompts/` - For students
   - `advisor-prompts/` - For academic advisors
   - `faculty-prompts/` - For teaching faculty
```

**Add New Section (after line 129):** Faculty Prompts Overview

```markdown
## Faculty Prompts Overview

The **faculty-prompts** folder contains 8 prompts designed to help teaching faculty:

### Course Design

- **Design Effective Course Materials** - Create engaging content that students complete
- **Build Inclusive Learning Experiences** - Support diverse learners effectively
- **Plan Active Learning Activities** - Transform lectures into interactive sessions

### Assessment & Feedback

- **Create Authentic Assessments** - Measure real understanding, not memorization
- **Develop Rubrics & Grading Criteria** - Ensure consistency and transparency
- **Provide Actionable Feedback** - Help students improve, not just justify grades

These prompts help faculty save time while improving teaching effectiveness and student outcomes.
```

**Update Line 260:** Folder Structure

```text
prompts-download/
├── README.md (this file)
├── student-prompts/
│   ├── student-prompt-01.md through student-prompt-15.md
│   └── (15 total prompts for students)
├── advisor-prompts/
│   ├── advisor-prompt-01.md through advisor-prompt-10.md
│   └── (10 total prompts for academic advisors)
└── faculty-prompts/
    ├── faculty-prompt-01.md through faculty-prompt-08.md
    └── (8 total prompts for teaching faculty)
```

**Update Line 289:** Footer

```markdown
Generated for SHPE 2025 National Convention - Philadelphia, PA
33 prompts for students, advisors, and faculty
```

#### 6D: Regenerate ZIP File (REQUIRED)

**CRITICAL:** The ZIP must be regenerated to include your new category!

List all category folders explicitly (don't use wildcard):

```bash
# PowerShell - List each folder explicitly
cd prompts-download
Compress-Archive -Path student-prompts, advisor-prompts, faculty-prompts, README.md -DestinationPath ../prompts-download.zip -Force
cd ..

# Bash/Linux - List each folder explicitly
cd prompts-download
zip -r ../prompts-download.zip student-prompts advisor-prompts faculty-prompts README.md
cd ..
```

**Why explicit listing?** Using wildcards (`prompts-download\*`) can include unwanted files like `.DS_Store` or temporary files.

**Verify the ZIP:**

```bash
# Check ZIP size increased
powershell -Command "(Get-Item prompts-download.zip).Length / 1KB"

# Or list contents
powershell -Command "Expand-Archive -Path prompts-download.zip -DestinationPath temp-test -Force; ls temp-test; rm -r temp-test"
```

You should see your new category folder in the ZIP contents.

### Phase 7: Build & Test (15 min)

**CRITICAL:** This phase catches all the issues that broke study-guides initially. Do NOT skip any test!

#### 7A: Rebuild Data Files

```bash
npm run build
```

Expected output shows all categories including your new one.

#### 7B: Comprehensive Testing Checklist

```bash
npm run serve
```

Visit `http://localhost:8080` and test EVERY item in this checklist:

**Test 1: Landing Page Button**
- [ ] ✅ New category button appears on landing page
- [ ] ✅ Button has correct icon and text
- [ ] ✅ Button is clickable (cursor changes to pointer)

**Test 2: Category List View** (COMMON FAILURE POINT)
- [ ] ✅ Clicking button navigates to category (URL shows `#your-category`)
- [ ] ✅ Category heading displays ("Faculty Prompts", "Study Tools", etc.)
- [ ] ✅ Back button appears and is clickable
- [ ] ✅ Prompt cards render (not blank page)
- [ ] ✅ Correct number of prompts display (count matches your files)

**Test 3: Prompt Card Display** (COMMON FAILURE POINT)
- [ ] ✅ Each card shows prompt title (not "undefined")
- [ ] ✅ Each card shows marketing description (NOT first line of prompt content)
- [ ] ✅ Cards are clickable (cursor changes, hover effect works)
- [ ] ✅ Orange arrow appears on right side of cards

**Test 4: Prompt Modal** (COMMON FAILURE POINT)
- [ ] ✅ Clicking a prompt card opens modal (not console error)
- [ ] ✅ Modal shows correct prompt title
- [ ] ✅ Modal shows full prompt content (formatted properly)
- [ ] ✅ Copy button appears and works
- [ ] ✅ Close button (X) works
- [ ] ✅ Clicking backdrop closes modal

**Test 5: Modal Close Behavior** (COMMON FAILURE POINT)
- [ ] ✅ Closing modal returns to YOUR category list (NOT different category!)
- [ ] ✅ Scroll position preserved when returning to list
- [ ] ✅ Green checkmark appears on viewed prompt

**Test 6: Back Button Navigation**
- [ ] ✅ Back button returns to landing page
- [ ] ✅ Landing page displays correctly after returning
- [ ] ✅ Can navigate back to category again

**Test 7: Direct URL Access**
- [ ] ✅ Visit `http://localhost:8080/#your-category` directly
- [ ] ✅ Category list loads correctly from direct URL
- [ ] ✅ Prompts display without going through landing page first

**Browser Console Check:**
- [ ] ✅ Open DevTools Console (F12)
- [ ] ✅ No errors appear (especially "Prompt not found" errors)
- [ ] ✅ No warnings about missing containers or elements

#### 7C: Test Download Package

1. Download `prompts-download.zip`
2. Extract and verify:
   - [ ] ✅ `{category}-prompts/` folder exists
   - [ ] ✅ All prompt files present (count matches)
   - [ ] ✅ Files contain prompt content (not empty)
3. Open `README.md` and verify:
   - [ ] ✅ Total prompt count updated in line 13
   - [ ] ✅ Category listed in "Browse the folders" section
   - [ ] ✅ Category overview section present (if applicable)
   - [ ] ✅ Folder structure diagram includes category

#### 7D: Common Failures (Study-Guides Had 4, Wellness Had 3 More!)

If ANY test fails, check these BEFORE moving on:

**Failure: "Clicking button does nothing"**
- Missing: `showPromptList()` else if block in app.js
- Fix: Add your category to showPromptList function (Step 4C.3)

**Failure: "Prompt list is blank/empty"**
- Missing: `renderPromptList()` containerId ternary in app.js
- Fix: Add your category to containerId ternary (Step 4C.5)

**Failure: "Console error: Prompt not found"**
- Missing: Your category in `showPromptModal()` allPrompts array
- Fix: Add `...promptsData['your-category']` to allPrompts (Step 4C.6)

**Failure: "Modal closes to wrong category"**
- Missing: Your category in `closeModal()` detection
- Fix: Add your category to closeModal ternary (Step 4C.8)

**Failure: "Cards show prompt content instead of marketing tagline"**
- Missing: Entries in `prompt-descriptions.json`
- Fix: Add marketing descriptions and run `npm run build` (Phase 3)

**Failure: "Copy Prompt button doesn't work (silent failure)"** ⚠️ CRITICAL
- Missing: Your category in `copyPromptToClipboard()` allPrompts array (app.js line ~641)
- Symptom: Button appears to work but nothing copies to clipboard - NO ERROR MESSAGE
- Testing: Click "Copy Prompt" button, try pasting - nothing happens
- Fix: Add `...promptsData['your-category']` to allPrompts array in copyPromptToClipboard()
- Why silent: Function returns early if prompt not found, no error thrown
- **This is easy to miss because button looks functional!**

**Failure: "Dev mode TypeError: Cannot read properties of undefined (reading 'forEach')"**
- Missing: Your category in `loadPromptsFromMarkdown()` function in app.js
- Fix: Add loading for your category in the dev mode function (see app.js lines 77-85)
- Context: Production uses prompts-data.json (includes all categories), but dev mode loads from manifest
- Add these lines BEFORE `promptsData = {...}`:
  ```javascript
  const yourCategoryPrompts = await Promise.all(
    manifest['your-category'].map(item => loadMarkdownPrompt('your-category', item))
  );
  ```
- Then add to promptsData object: `'your-category': yourCategoryPrompts,`
- And update metadata counts

**Failure: "Desktop buttons look cramped/squeezed"**
- Issue: More than 3 buttons in single row on desktop looks cramped
- Fix: Update CSS media query to use 2-column grid layout (see styles.css line 775)
- Change from `flex-direction: row` to:
  ```css
  .button-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
  ```
- This creates a 2x2 grid for 4 buttons (or 2x3 for 6, etc.)
- Mobile stays single column unchanged

### Phase 8: Documentation (5 min)

#### 8A: Update Main README (Optional)

**File:** `README.md`

```markdown
## Features

- 📚 **15 Student Prompts** - Career planning, study strategies, project development
- 👨‍🏫 **10 Advisor Prompts** - Student guidance, curriculum design, outcomes tracking
- 👩‍🏫 **8 Faculty Prompts** - Course design, assessment creation, inclusive teaching  // ADD THIS
```

#### 8B: Update CLAUDE.md

**File:** `CLAUDE.md`

Add session notes if this was a significant change:

```markdown
### Current Status: Faculty Category Added ✅

**What Was Completed:**
1. ✅ Added faculty category with 8 prompts
2. ✅ Updated build script to process faculty prompts
3. ✅ Added faculty button and list view to UI
4. ✅ Updated download package with faculty prompts
5. ✅ Updated README with faculty overview
```

---

## Testing Checklist

Before committing changes:

- [ ] **Build:** `npm run build` runs without errors
- [ ] **Landing Page:** New category button displays correctly
- [ ] **Navigation:** Button navigates to category list view
- [ ] **Prompt List:** All prompts render with titles and descriptions
- [ ] **Modal:** Clicking prompt opens modal with full content
- [ ] **Copy Button:** Copy-to-clipboard works for all prompts
- [ ] **Back Button:** Returns to landing page correctly
- [ ] **URL Hash:** Browser history works (back/forward buttons)
- [ ] **Download ZIP:** Contains new category folder
- [ ] **README:** Accurately describes new category
- [ ] **Markdown Linting:** All new files pass `markdown-lint` skill
- [ ] **Mobile:** Test responsive design on mobile browser
- [ ] **Analytics:** Viewed prompts tracking works

---

## Common Issues & Solutions

### Issue: Build script doesn't find prompts

**Symptom:** `npm run build` shows 0 prompts for new category

**Solution:**

- Check folder path: `prompts/{category}/begin/`
- Verify filenames: `{category}-prompt-01.md` (not `01-prompt.md`)
- Ensure files end with `.md`

### Issue: Button doesn't appear on landing page

**Symptom:** Landing page missing new button

**Solution:**

- Check `index.html` button HTML matches existing format
- Verify button ID matches: `id="btn-{category}"`
- Clear browser cache and hard refresh

### Issue: Clicking button shows blank page

**Symptom:** Navigation works but no prompts display

**Solution:**

- Check `app.js` route handling includes new category
- Verify list view section ID: `id="{category}-list-view"`
- Check `promptsData[category]` exists in browser console

### Issue: Prompts don't have descriptions

**Symptom:** Prompts show filename instead of marketing tagline

**Solution:**

- Add entries to `prompt-descriptions.json`
- Rebuild: `npm run build`
- Check `prompts-data.json` for correct descriptions

### Issue: Download ZIP missing category

**Symptom:** `prompts-download.zip` doesn't include new category

**Solution:**

- Create `prompts-download/{category}-prompts/` folder
- Copy files: `cp prompts/{category}/begin/*.md prompts-download/{category}-prompts/`
- Regenerate ZIP: `Compress-Archive -Path prompts-download\* -DestinationPath prompts-download.zip -Force`

---

## Replication to Twin Projects

When adding a category to SHPE-2025, **also add to NETA-2025**:

```bash
# After completing all phases for SHPE-2025:
cd ../neta-2025

# Copy the same prompt files
cp -r ../shpe-2025/prompts/faculty prompts/

# Copy marketing descriptions (merge carefully)
# Update prompt-descriptions.json manually

# Follow the same phases 2-8
# Branding differences handled by branding-config.json
```

---

## Performance Considerations

### Scalability

- **No hardcoded limits** - System supports unlimited categories
- **Dynamic rendering** - Categories added without UI changes
- **Shared CSS** - No per-category styling needed
- **JSON file size** - 10 prompts ≈ 50KB; 100 prompts ≈ 500KB (acceptable)

### Best Practices

- Keep prompts under 5KB each (current average: 2-4KB)
- Use descriptive IDs: `{category}-prompt-01` not `prompt-01`
- Maintain alphabetical category order in JSON
- Test with 3+ categories to verify UI layout

---

## Future Enhancements

**Potential Features:**

- Category icons in `branding-config.json`
- Category-specific colors/themes
- Search/filter across all categories
- Category analytics (which categories are most used)
- Multi-category prompt delivery (single prompt for multiple audiences)

**Not Needed:**

- ❌ Category-specific QR codes (landing page QR covers all)
- ❌ Category-specific service workers (disabled)
- ❌ Category permissions or auth (public site)

---

## Complete Examples

### Example 1: Role-Based Category ("Faculty")

**Complete Terminal Session:**

```bash
# Phase 1: Create structure
mkdir -p prompts/faculty/begin
# (Add faculty-prompt-01.md through faculty-prompt-08.md manually)

# Phase 2: Update build script
# (Edit scripts/build-prompts.js - see Phase 2 above)

# Phase 3: Add descriptions
# (Edit prompt-descriptions.json - see Phase 3 above)

# Phase 4: Update UI
# (Edit index.html and app.js - see Phase 4 above)

# Phase 6: Download package
mkdir -p prompts-download/faculty-prompts
cp prompts/faculty/begin/*.md prompts-download/faculty-prompts/
# (Edit prompts-download/README.md - see Phase 6 above)
powershell -Command "Compress-Archive -Path prompts-download\* -DestinationPath prompts-download.zip -Force"

# Phase 7: Build & test
npm run build
npm run serve
# Test in browser: http://localhost:8080

# Phase 8: Commit
git add .
git commit -m "feat: add faculty prompt category" -m "- Added 8 faculty prompts for course design and assessment" -m "- Updated UI with faculty button and list view" -m "- Updated download package README with faculty overview"
git push
```

### Example 2: Topic-Based Category ("Study Skills")

**Complete Terminal Session:**

```bash
# Phase 1: Create structure
mkdir -p prompts/study-skills/begin
# (Add study-skills-prompt-01.md through study-skills-prompt-12.md manually)

# Phase 2: Update build script
# (Edit scripts/build-prompts.js)
# Add: const studySkillsPrompts = readPromptFiles('prompts/study-skills/begin', 'study-skills');

# Phase 3: Add descriptions
# (Edit prompt-descriptions.json)
# "study-skills-prompt-01": "Master the Pomodoro Technique for focused study sessions!"
# "study-skills-prompt-02": "Build a personalized study schedule that actually works!"
# etc.

# Phase 4: Update UI
# (Edit index.html - add button with 📚 icon and study-skills-list-view section)
# (Edit app.js - add event listeners and route handling for 'study-skills')

# Phase 6: Download package
mkdir -p prompts-download/study-skills-prompts
cp prompts/study-skills/begin/*.md prompts-download/study-skills-prompts/
# (Edit prompts-download/README.md - add Study Skills overview section)
powershell -Command "Compress-Archive -Path prompts-download\* -DestinationPath prompts-download.zip -Force"

# Phase 7: Build & test
npm run build
npm run serve
# Test: http://localhost:8080 - verify study skills button works

# Phase 8: Commit
git add .
git commit -m "feat: add study skills prompt category" -m "- Added 12 study skills prompts for time management and organization" -m "- Updated UI with study skills button (📚 icon)" -m "- Category accessible via #study-skills hash"
git push
```

**Key Differences for Topic-Based:**
- Category name uses hyphens: `study-skills` (URL-friendly)
- Button text more descriptive: "Study Skills" vs "For Students"
- Prompts cross-cut multiple audiences (useful for students, advisors helping students, parents, etc.)
- README overview focuses on topic benefits, not audience type

---

## File Locations Reference

Quick reference for all files affected:

| File | Purpose | Action |
|------|---------|--------|
| `prompts/{category}/begin/*.md` | Source prompts | Create 8-15 prompts |
| `scripts/build-prompts.js:215-226` | Build script | Add category processing |
| `prompt-descriptions.json` | Marketing taglines | Add descriptions |
| `index.html:42-52` | Landing buttons | Add new button |
| `index.html:56-86` | List views | Add new section |
| `app.js` (various) | App routing | Add event listeners + routes |
| `prompts-download/{category}-prompts/` | Download files | Copy markdown files |
| `prompts-download/README.md` | User docs | Add category overview |
| `branding-config.json` (optional) | Branding | Update descriptions |

---

## Estimated Time Breakdown

| Phase | Time | Difficulty |
|-------|------|------------|
| 1. Directory Structure | 5 min | Easy |
| 2. Build Script Updates | 10 min | Medium |
| 3. Marketing Descriptions | 5 min | Easy |
| 4. UI Implementation | 20 min | Medium |
| 5. Branding (Optional) | 2 min | Easy |
| 6. Download Package | 15 min | Medium |
| 7. Build & Test | 10 min | Easy |
| 8. Documentation | 5 min | Easy |
| **Total** | **~70 min** | **Medium** |

**Note:** Time excludes writing the actual prompt content (allow 2-3 hours for creating 8-10 high-quality prompts).

---

## Related Documentation

- `docs-dev/REPLICATION-GUIDE.md` - Creating new event-specific versions
- `docs-dev/PDF-GENERATION-PROCESS.md` - Generating PDF versions of prompts
- `docs-dev/MARKETING-DESCRIPTIONS-RESTORATION.md` - **IMPORTANT:** Managing marketing copy and separation of concerns
- `CLAUDE.md` - Session notes and project overview

**IMPORTANT:** Read `MARKETING-DESCRIPTIONS-RESTORATION.md` for the full story of why taglines are separated from prompt content. This documents a critical lesson learned during development.

---

**Questions?**
Contact: Brandon Foltz - [LinkedIn](https://www.linkedin.com/in/brandonfoltz/)
