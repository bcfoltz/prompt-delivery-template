# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 Project Status

**Status:** Production-ready ✅
**Live Site:** https://bcfoltz.github.io/shpe-2025/
**Repository:** https://github.com/bcfoltz/shpe-2025
**Total Prompts:** 66 (15 student + 10 advisor + 21 study tools + 20 wellness)

### Key Features:
- 📱 Progressive Web App (PWA) - works offline, installable
- 🎨 Color-coded categories (Orange/Navy for students, Blue/Teal for advisors, Purple for study tools, Green for wellness)
- 📋 One-click copy-to-clipboard for all prompts
- ✅ Viewed prompt tracking (localStorage)
- 🔄 Loading states and smooth animations
- 📦 Download package with all prompts (ZIP)
- 🔗 QR codes for easy mobile access

---

## 📌 Recent Session Notes

### 2025-11-07: Post-Production Refactoring & Code Cleanup ✅

#### Context:
After successful presentations at both SHPE and NETA conferences, conducted comprehensive post-mortem housekeeping to improve code quality, eliminate duplication, and prepare for future template creation.

#### What Was Completed:

1. **Code Audit & Analysis** ✅
   - Created `docs-dev/POST-MORTEM-AUDIT.md` (comprehensive audit findings)
   - Identified ~400 lines of duplicate code across both projects
   - Categorized improvements into HIGH/MEDIUM/LOW priorities

2. **Created Shared Utility Modules** ✅
   - `scripts/utils/title-extractor.js` (115 lines)
     - Eliminates ~200 lines of duplicate title extraction logic
     - Works in both Node.js (build scripts) and browser (app.js)
     - Dual export pattern for maximum compatibility
   - `scripts/utils/qr-generator.js` (115 lines)
     - Eliminates ~200 lines of duplicate QR generation logic
     - Config-driven approach for all QR code types
     - Reduced individual QR generators from 103 → 28 lines each (73% reduction)

3. **File Structure Reorganization** ✅
   - Used `git mv` to preserve commit history
   - Created logical subdirectories:
     - `scripts/build/` - Build scripts
     - `scripts/generators/` - QR code generators
     - `scripts/utils/` - Shared utilities
   - Updated all require() paths and package.json scripts

4. **Build Validation System** ✅
   - Added 5 comprehensive validation checks to `build-prompts.js`:
     - Total prompt count validation (expected 66)
     - Duplicate prompt ID detection
     - Marketing description validation
     - H1 title verification
     - JSON structure validation
   - Build fails with exit code 1 on errors
   - Prevents broken builds from being deployed

5. **Configuration System** ✅
   - Created `template-config.json` with:
     - Deployment settings (siteUrl, gitHubRepo, cacheVersion)
     - Category definitions (all 4 categories with colors, icons, routes)
     - Build validation settings
   - Foundation for future dynamic category generation

6. **Applied to Both Projects** ✅
   - All refactoring applied to SHPE 2025
   - All refactoring applied to NETA 2025
   - Both projects tested and verified working

7. **Browser Testing** ✅
   - Started local server on port 8081
   - Verified all 66 prompts load correctly
   - Confirmed no JavaScript errors
   - Created `docs-dev/BROWSER-TEST-RESULTS.md`

8. **Documentation** ✅
   - Created `docs-dev/REFACTORING-SUMMARY.md` (detailed metrics)
   - Created `docs-dev/HOUSEKEEPING-COMPLETE.md` (completion summary)
   - Created `docs-dev/BROWSER-TEST-RESULTS.md` (testing results)

9. **Git Commits** ✅
   - SHPE: 7 commits (file reorg, utilities, validation, config, docs)
   - NETA: 5 commits (file reorg, utilities, config, rebuild)
   - All commits pushed to GitHub successfully

#### Key Metrics:
- **Code Reduction:** ~400 lines of duplicate code eliminated
- **File Count:** +6 new files (3 utilities, 3 docs)
- **Lines Changed:** 207 removed, 230 added (net -28 lines, but massive maintainability improvement)
- **QR Generators:** Reduced from 103 → 28 lines each (73% reduction)
- **Build Safety:** 5 new validation checks prevent broken builds

#### Files Created:
- `scripts/utils/title-extractor.js` - Shared title extraction utility
- `scripts/utils/qr-generator.js` - Shared QR generation utility
- `template-config.json` - Centralized configuration
- `docs-dev/POST-MORTEM-AUDIT.md` - Audit findings
- `docs-dev/REFACTORING-SUMMARY.md` - Detailed metrics
- `docs-dev/HOUSEKEEPING-COMPLETE.md` - Completion summary
- `docs-dev/BROWSER-TEST-RESULTS.md` - Testing results

#### Files Modified:
- `scripts/build/build-prompts.js` - Added validation, uses shared utility (moved from `scripts/`)
- `app.js` - Removed 83 lines, uses shared title extractor
- `index.html` - Added script tag for title-extractor.js
- `scripts/generators/pdf-example-qr.js` - Reduced from 103 → 28 lines (moved from `scripts/`)
- `scripts/generators/audio-example-qr.js` - Reduced from 103 → 28 lines (moved from `scripts/`)
- `scripts/generators/video-example-qr.js` - Reduced from 103 → 28 lines (moved from `scripts/`)
- `scripts/generators/qr-codes.js` - Updated paths (moved from `scripts/`)
- `package.json` - Updated all script paths for new structure
- `prompts-data.json` - Rebuilt with new validation system

#### Impact:
- **Maintainability:** Single source of truth for title extraction and QR generation
- **Reliability:** Build validation catches errors before deployment
- **Scalability:** Config-driven approach ready for template creation
- **Developer Experience:** Cleaner file organization, easier to navigate

#### Next Phase:
Template creation for future events (pending).

---

### 2025-11-04: Economics PDF Example & Download QR Codes ✅

#### What Was Completed:
1. ✅ Added Economics 101 PDF example to both SHPE and NETA projects
   - File: `06 - Economics 101 - Elasticity of Demand and Supply.pdf` (301 KB)
   - Shows real-world output quality from Study Tools prompts

2. ✅ Created standalone QR code generator for PDF download
   - Script: `scripts/generate-pdf-example-qr.js`
   - NPM command: `npm run qr-pdf-example`
   - Generates PNG (1000x1000px) + SVG (scalable)

3. ✅ Generated download QR codes for both projects:
   - **SHPE:** `qr-codes/qr-economics-pdf-example.png` and `.svg`
   - **NETA:** `qr-codes/qr-economics-pdf-example.png` and `.svg`

4. ✅ Committed and pushed to both GitHub repositories
   - SHPE: https://bcfoltz.github.io/shpe-2025/06%20-%20Economics%20101%20-%20Elasticity%20of%20Demand%20and%20Supply.pdf
   - NETA: https://bcfoltz.github.io/neta-2025/06%20-%20Economics%20101%20-%20Elasticity%20of%20Demand%20and%20Supply.pdf

#### Files Modified:
- `06 - Economics 101 - Elasticity of Demand and Supply.pdf` - NEW
- `scripts/generate-pdf-example-qr.js` - NEW
- `package.json` - Added `qr-pdf-example` script
- `qr-codes/qr-economics-pdf-example.png` - NEW
- `qr-codes/qr-economics-pdf-example.svg` - NEW

---

### 2025-11-03: Critical Branding Bug Discovery & Documentation ⚠️

#### Problem Discovered:
User requested adding Cengage disclaimer to NETA site. Updated `index.html` and deployed, but the disclaimer appeared briefly then reverted to old text despite:
- Multiple deployments
- Service worker cache version bumps (v1→v2→v3→v4)
- Cache clearing and hard refreshes
- Network-first caching strategy

**Time to Debug:** 4+ hours (unacceptable)

#### Root Cause:
The branding loader JavaScript (`branding-loader.js`) was dynamically overwriting `index.html` content with values from `branding-config.json` **after page load**. The HTML file had correct disclaimer, but JSON config had old text.

**Key Symptom:** Content flashing correct then reverting (JavaScript override)

#### The Fix:
Updated `branding-config.json` line 25 in NETA repo:
```json
"subtitle": "These prompts are provided for educational and demonstration purposes only and are not official Cengage products."
```

#### Documentation Created:
1. ✅ `docs-dev/CRITICAL-BRANDING-BUG.md` (383 lines)
   - Full bug analysis and root cause
   - How branding loader works (which elements it controls)
   - How to fix similar issues in the future
   - Debugging checklist (content flash = branding config, not cache)
   - Prevention strategies for new events

2. ✅ Updated `docs-dev/REPLICATION-GUIDE.md`
   - Added critical warning at top about branding override
   - Added troubleshooting section for content flashing

3. ✅ Fixed service worker strategy (NETA only)
   - Changed from cache-first to network-first
   - Removed non-existent `manifest-generator.js` from cache list

#### ⚠️ CRITICAL LESSON FOR FUTURE:

**When user reports content not updating:**

1. **Ask immediately:** "Does the content flash correct then revert?"
2. **If YES:** Check `branding-config.json` FIRST (not service worker/cache)
3. **Elements controlled by branding:**
   - Logo (`.convention-logo`)
   - Main heading (`header h1`)
   - Subtitle (`.subtitle`) ← **Most commonly affected**
   - Footer author (`.footer-author`)
   - Footer event link (`.footer-event-link`)

4. **Always update BOTH files:**
   - `index.html` (for SEO/crawlers)
   - `branding-config.json` (for actual display)

**See:** `docs-dev/CRITICAL-BRANDING-BUG.md` for complete details

---

### 2025-11-02: NETA 2025 Full Sync ✅

#### Completed:
1. ✅ Added Student Wellness category to NETA (20 prompts)
2. ✅ Fixed `copyPromptToClipboard()` bug - was only searching 2 categories instead of 4
3. ✅ Fixed desktop button layout - changed to 2x2 CSS Grid
4. ✅ Updated QR codes from "25 prompts" to "66 prompts"
5. ✅ Fixed SHPE 2025 references in NETA meta tags
6. ✅ Verified download package contains all 66 prompts (110KB)

**Final State:** NETA 2025 ready for conference (November 5-7, 2025 in New Orleans)

---

## 🔗 Project Relationship

**This is the MASTER TEMPLATE** for prompt delivery sites.

### Replicated Projects:
- **NETA 2025** (Economics Teaching Conference)
  - Location: `C:\Users\bcfol\OneDrive\Documents\vscode\neta-2025\`
  - Live Site: https://bcfoltz.github.io/neta-2025/
  - Event: November 5-7, 2025 in New Orleans, Louisiana
  - Branding: Cengage logo with navy/gold colors

### Important Notes:
- **Structural changes** should be applied to **both** SHPE and replicated projects
- **Branding changes** are project-specific via `branding-config.json`
- **Prompt content** is identical across all versions
- See `docs-dev/REPLICATION-GUIDE.md` for creating new event versions
- See `docs-dev/CRITICAL-BRANDING-BUG.md` for branding troubleshooting

---

## 🚀 Quick Start Commands

```bash
# Build production data from markdown prompts
npm run build

# Generate all QR codes (main site + download package)
npm run qr

# Generate Economics PDF example QR code
npm run qr-pdf-example

# Start local development server
npm run serve

# Generate copy-helper HTML page
npm run copy-helper
```

---

## 📁 Project Structure

```
root/
├── prompts/                     # All prompt markdown files
│   ├── student/begin/          # 15 student prompts
│   ├── advisor/begin/          # 10 advisor prompts
│   ├── study-guides/begin/     # 21 study tool prompts
│   └── student-wellness/       # 20 wellness prompts
├── scripts/                     # Build and generation scripts
│   ├── build/                  # Build scripts
│   │   └── build-prompts.js    # Generates prompts-data.json (with validation)
│   ├── generators/             # QR code generators
│   │   ├── qr-codes.js         # Main QR code generator
│   │   ├── pdf-example-qr.js   # Economics PDF QR generator
│   │   ├── audio-example-qr.js # Economics audio QR generator
│   │   └── video-example-qr.js # Economics video QR generator
│   └── utils/                  # Shared utilities
│       ├── title-extractor.js  # Title extraction (Node.js + browser)
│       └── qr-generator.js     # QR code generation logic
├── qr-codes/                    # Generated QR codes
│   ├── qr-main.png/svg         # Main site
│   ├── qr-download-zip.png/svg # Download package
│   ├── qr-economics-pdf-example.png/svg    # PDF example
│   ├── qr-economics-audio-example.png/svg  # Audio example
│   ├── qr-economics-video-example.png/svg  # Video example
│   └── preview.html            # QR code preview page
├── prompts-download/            # Download package contents
│   ├── student-prompts/        # 15 files
│   ├── advisor-prompts/        # 10 files
│   ├── study-tools-prompts/    # 21 files
│   ├── student-wellness-prompts/  # 20 files
│   └── README.md               # User guide
├── docs-dev/                    # Development documentation
│   ├── CRITICAL-BRANDING-BUG.md     # Branding override issue (READ THIS!)
│   ├── POST-MORTEM-AUDIT.md         # Refactoring audit findings
│   ├── REFACTORING-SUMMARY.md       # Refactoring metrics
│   ├── HOUSEKEEPING-COMPLETE.md     # Completion summary
│   ├── BROWSER-TEST-RESULTS.md      # Browser testing results
│   ├── REPLICATION-GUIDE.md         # Creating new event versions
│   ├── ADDING-NEW-CATEGORIES.md     # Adding prompt categories
│   ├── PROMPT-ORDERING-GUIDE.md     # Renumbering strategies
│   └── SESSION-NOTES-ARCHIVE.md     # Historical session notes
├── index.html                   # Main landing page
├── app.js                       # Application logic (uses shared utilities)
├── styles.css                   # All styling
├── prompts-data.json            # Generated prompt data (DO NOT EDIT)
├── prompt-descriptions.json     # Marketing taglines (source of truth)
├── template-config.json         # Configuration template (deployment, categories, validation)
├── prompts-download.zip         # Generated download package
├── service-worker.js            # PWA offline support
├── manifest.json                # PWA manifest
└── 06 - Economics 101 - Elasticity of Demand and Supply.pdf  # Example output
```

---

## 📝 Project Overview

A static website for distributing LLM prompts using QR codes and a copy-to-clipboard interface. Designed for convention presentations to share prompts with students and academic advisors.

**Key Constraints:**
- Pure HTML, CSS, JS only (no backend, no database, no authentication)
- Must work on mobile browsers
- Minimal and readable code
- GitHub Pages hosting

---

## 🏗️ Directory Structure

```
prompts/
├── advisor/begin/          # Original advisor prompts (10 files)
├── student/begin/          # Original student prompts (15 files)
├── study-guides/begin/     # Study tool prompts (21 files)
└── student-wellness/       # Wellness prompts (20 files)
```

**Note:** Prompts ending in `-result` are test runs and should be ignored for implementation purposes.

---

## 🎨 Prompt Architecture

Prompts use a templating pattern with `{variable}` placeholders:

### Advisor Prompts:
- Template variables: `{student's field}`, `{student's level}`
- Example: Career development expert persona for data-driven guidance
- Outputs: skill tables, top priorities, rising trends, skill gaps, resources

### Student Prompts:
- Template variables: `{field}`, `{specific area}`, etc.
- Example: Career counselor persona for entry-level preparation
- Outputs: skill tables, top skills, standout skills, learning resources

### Study Tools:
- Template variables: `{topic}`, `{subject}`, `{concept}`, etc.
- Examples: Lecture notes generator, concept explainer, study guide creator
- Outputs: structured notes, explanations, practice questions

### Student Wellness:
- Template variables: `{specific concern}`, `{situation}`, etc.
- Examples: Stress management, sleep optimization, academic balance
- Outputs: personalized strategies, action plans, resources
- **Note:** 14/20 prompts include medical/mental health disclaimers

---

## 🔧 Development Workflow Rules

This project uses a structured PRD-to-tasks workflow for feature development:

### 1. Creating PRDs (Product Requirements Documents)

Follow `docs-dev/create-prd.md` guidelines:
- Ask clarifying questions before writing the PRD
- Provide options in letter/number lists for easy selection
- Target audience is junior developers
- Save as `/tasks/[n]-prd-[feature-name].md` (zero-padded 4-digit sequence)
- **Do NOT start implementing** until the PRD is approved

### 2. Generating Task Lists

Follow `docs-dev/generate-tasks.md` guidelines:
- Read and analyze the specified PRD
- **Phase 1:** Generate high-level parent tasks, then wait for confirmation
- **Phase 2:** After user confirms, break down into sub-tasks
- Save as `/tasks/tasks-[prd-file-name].md`

### 3. Processing Task Lists

Follow `docs-dev/process-task-list.md` guidelines strictly:
- **One sub-task at a time** - complete, STOP, wait for permission
- Mark sub-tasks as complete: `[ ]` → `[x]`
- When all sub-tasks complete: run tests, commit with conventional format, mark parent as `[x]`

---

## 🧪 Testing

- Unit tests should be placed alongside code files
- Run tests with: `npx jest [optional/path/to/test/file]`
- Always run full test suite before committing completed parent tasks

---

## 📦 Git Workflow

- Use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.
- Multi-line commit messages via `-m` flags
- Example:
  ```bash
  git commit -m "feat: add payment validation logic" \
    -m "- Validates card type and expiry" \
    -m "- Adds unit tests for edge cases" \
    -m "Related to T123 in PRD"
  ```

---

## 📚 Key Documentation

- **`docs-dev/CRITICAL-BRANDING-BUG.md`** - ⚠️ READ THIS! Most time-consuming bug
- **`docs-dev/REPLICATION-GUIDE.md`** - How to create new event versions
- **`docs-dev/ADDING-NEW-CATEGORIES.md`** - How to add new prompt categories
- **`docs-dev/PROMPT-ORDERING-GUIDE.md`** - Renumbering strategies
- **`docs-dev/SESSION-NOTES-ARCHIVE.md`** - Historical session notes

---

## 🎯 Common Tasks

### Adding a New Prompt Category

1. Read `docs-dev/ADDING-NEW-CATEGORIES.md` first
2. Create prompts in `prompts/[category-name]/`
3. Update `scripts/build/build-prompts.js` (9 locations)
4. Update `template-config.json` (add category definition)
5. Update `index.html` (button + list view section)
6. Update `app.js` (9 functions)
7. Update `styles.css` (button + modal theme)
8. Update `prompts-download/` folder structure
9. Regenerate: `npm run build`
10. Test all 8 integration phases

### Fixing Branding Issues

1. **If content flashes then reverts:** Check `branding-config.json` FIRST
2. **Elements controlled by branding:**
   - Logo, main heading, subtitle, footer author, footer event link
3. **Always update BOTH:**
   - `index.html` (for SEO/crawlers)
   - `branding-config.json` (for actual display)
4. See `docs-dev/CRITICAL-BRANDING-BUG.md` for full guide

### Creating a New Event Version

1. Follow `docs-dev/REPLICATION-GUIDE.md`
2. Copy entire SHPE project to new directory
3. Update `branding-config.json` with event details
4. Replace logo file (`cengage-logo.png` or `shpe-logo.png`)
5. Update GitHub Pages settings
6. Test branding loader on deployed site

---

## 📊 Current Metrics

- **Total Prompts:** 66
- **Total Categories:** 4
- **Download Package Size:** ~110KB
- **QR Codes:** 3 (main site, download ZIP, PDF example)
- **PWA Cache Version:** v4 (NETA), v2 (SHPE)
- **Target Events:**
  - SHPE 2025 (completed)
  - NETA 2025 (November 5-7, 2025 in New Orleans)

---

## 🔄 For Older Session Notes

See `docs-dev/SESSION-NOTES-ARCHIVE.md` for detailed historical session notes from:
- 2025-10-27: Study Tools Rename, Gemini Support
- 2025-10-26: Student Wellness Integration
- 2025-10-25: PDF Generation & Marketing Descriptions
- 2025-10-23: Markdown Linting
- 2025-10-22: PWA Implementation & Initial Launch
