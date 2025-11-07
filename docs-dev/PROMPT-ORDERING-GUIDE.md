# Prompt Ordering Guide

This guide explains the three safe approaches for adding or reordering prompts in the SHPE 2025 prompt delivery system. Understanding these strategies will help you avoid breaking changes and maintain a clean, professional user experience.

---

## 📌 Why This Matters

This application uses **alphabetical filename sorting** to determine prompt display order:

```javascript
prompts.sort((a, b) => a.filename.localeCompare(b.filename))
```

This means:
- `00` comes before `01` comes before `02`
- `000` comes before `00`
- `-1` comes before `00`
- Filenames determine display order, not creation date or manual sorting

**Key Constraint:** Marketing descriptions in `prompt-descriptions.json` are keyed by filename (e.g., `"student-prompt-05": "description"`). If you rename files, you **must** update this JSON file or lose the marketing taglines in the UI.

---

## ✅ Three Safe Approaches

### Option 1: Prepend (Add to Top with 00, 000, -1)

**Best for:** Adding a new prompt to the **top** of an existing category

**How it works:**
1. Create a new file with a number **lower** than the current first prompt
2. Common patterns:
   - If current first is `01`, create `00`
   - If current first is `00`, create `000` or `-1`
   - If current first is `-1`, create `-2`

**Steps:**

1. **Create the new prompt file:**
   ```bash
   # Example: Adding to top of study-guides (current first is 01)
   touch prompts/study-guides/begin/study-guide-prompt-00.md
   ```

2. **Add marketing description to `prompt-descriptions.json`:**
   ```json
   {
     "study-guide-prompt-00": "Your marketing tagline here!",
     "study-guide-prompt-01": "Existing prompt description...",
     // ... rest of prompts
   }
   ```

3. **Create corresponding file in download folder:**
   ```bash
   touch prompts-download/study-guides-prompts/study-guide-prompt-00.md
   ```

4. **Rebuild production data:**
   ```bash
   npm run build
   ```

**Pros:**
- ✅ **Zero file moves** - no renaming required
- ✅ **Fastest approach** - only 2 files created
- ✅ **No risk of breaking existing links** - all old filenames unchanged
- ✅ **Simple JSON update** - add one line to prompt-descriptions.json

**Cons:**
- ⚠️ **Non-sequential numbering** - you'll have `00, 01, 02...` instead of `01, 02, 03...`
- ⚠️ **Aesthetic only** - doesn't affect functionality

**Time:** ~2 minutes
**Files touched:** 2 new files + 1 JSON edit
**Risk:** Very Low

---

### Option 2: Append (Add to Bottom)

**Best for:** Adding a new prompt to the **bottom** of an existing category

**How it works:**
1. Find the current highest number (e.g., `20`)
2. Create next sequential number (e.g., `21`)
3. Alphabetical sorting automatically places it at the end

**Steps:**

1. **Identify current last prompt:**
   ```bash
   # Example: study-guides currently ends at 20
   ls prompts/study-guides/begin/
   # Shows: study-guide-prompt-01.md through study-guide-prompt-20.md
   ```

2. **Create the new prompt file:**
   ```bash
   touch prompts/study-guides/begin/study-guide-prompt-21.md
   ```

3. **Add marketing description to `prompt-descriptions.json`:**
   ```json
   {
     "study-guide-prompt-01": "Existing...",
     // ... middle prompts ...
     "study-guide-prompt-20": "Existing last prompt...",
     "study-guide-prompt-21": "Your new marketing tagline!"
   }
   ```

4. **Create corresponding file in download folder:**
   ```bash
   touch prompts-download/study-guides-prompts/study-guide-prompt-21.md
   ```

5. **Rebuild production data:**
   ```bash
   npm run build
   ```

**Pros:**
- ✅ **Zero file moves** - no renaming required
- ✅ **Fastest approach** - only 2 files created
- ✅ **Perfect sequential numbering** - maintains `01, 02, 03...20, 21`
- ✅ **No risk of breaking existing links** - all old filenames unchanged

**Cons:**
- ⚠️ None! This is the safest approach.

**Time:** ~2 minutes
**Files touched:** 2 new files + 1 JSON edit
**Risk:** Very Low

---

### Option 3: Content Swap (Reorder Without Renaming)

**Best for:** Major reordering when you want perfect 01-02-03 numbering

**How it works:**
1. **Don't rename files** - keep all filenames exactly the same
2. **Swap the content** between files to achieve desired order
3. **Update marketing descriptions** to match new content positions

**Steps:**

1. **Plan your reordering:**
   ```
   Current State:
   - study-guide-prompt-01.md = "Interleaved Practice"
   - study-guide-prompt-02.md = "Spaced Repetition"
   - study-guide-prompt-03.md = "Worked Examples"

   Desired State:
   - study-guide-prompt-01.md = "Worked Examples" (was 03)
   - study-guide-prompt-02.md = "Interleaved Practice" (was 01)
   - study-guide-prompt-03.md = "Spaced Repetition" (was 02)
   ```

2. **Swap file contents:**
   ```bash
   # Backup first (recommended)
   cp prompts/study-guides/begin/study-guide-prompt-01.md /tmp/backup-01.md

   # Overwrite with desired content
   cp prompts/study-guides/begin/study-guide-prompt-03.md prompts/study-guides/begin/study-guide-prompt-01.md
   ```

3. **Update `prompt-descriptions.json` to match new content:**
   ```json
   {
     "study-guide-prompt-01": "Master complex procedures with worked examples!",  // Was 03's description
     "study-guide-prompt-02": "Triple your retention with interleaved practice!",  // Was 01's description
     "study-guide-prompt-03": "Unlock optimal spacing intervals!"  // Was 02's description
   }
   ```

4. **Repeat for download folder:**
   ```bash
   cp prompts-download/study-guides-prompts/study-guide-prompt-03.md \
      prompts-download/study-guides-prompts/study-guide-prompt-01.md
   ```

5. **Rebuild production data:**
   ```bash
   npm run build
   ```

**Pros:**
- ✅ **Perfect sequential numbering** - maintains clean `01, 02, 03...` sequence
- ✅ **No filename changes** - preserves any external links or references
- ✅ **Flexible reordering** - can achieve any desired order
- ✅ **Professional appearance** - no gaps or non-sequential numbers

**Cons:**
- ⚠️ **Manual work** - must carefully track which content goes where
- ⚠️ **JSON updates** - must update marketing descriptions to match new positions
- ⚠️ **Backup recommended** - easy to lose track during swaps

**Time:** ~10-15 minutes (for major reordering)
**Files touched:** 2x files per swap + JSON updates
**Risk:** Medium (if not careful with backups)

---

## ⚠️ Approach to AVOID: Mass Renaming (Nuclear Option)

**Why avoid:**
- Requires renaming 40-80+ files (both source and download folders)
- Must update every filename key in `prompt-descriptions.json`
- High risk of breaking external references
- Git shows massive changes (hard to review)
- Time-consuming (30-60 minutes minimum)

**Only use if:**
- You absolutely need perfect `01, 02, 03...` numbering with no gaps
- You're willing to spend significant time on a cosmetic change
- You have no external references to prompt URLs

**Example scenario requiring mass rename:**
```
Current: 00, 01, 02, 05, 07, 09, 10, 15, 20
Desired: 01, 02, 03, 04, 05, 06, 07, 08, 09

Would require renaming 9 files + updating 9 JSON keys = 18+ changes
```

---

## 📊 Comparison Matrix

| Approach | Best For | Time | Files Touched | Risk | Numbering Quality |
|----------|----------|------|---------------|------|-------------------|
| **Prepend (00, 000, -1)** | Adding to top | ~2 min | 2 new + 1 JSON | Very Low | Non-sequential (cosmetic) |
| **Append (21, 22, 23)** | Adding to bottom | ~2 min | 2 new + 1 JSON | Very Low | Perfect sequential |
| **Content Swap** | Major reordering | ~10-15 min | 2x swaps + JSON | Medium | Perfect sequential |
| **Mass Rename** ❌ | Perfectionism | ~30-60 min | 40-80+ files + JSON | High | Perfect sequential |

---

## 🎯 Use Case Recommendations

### Scenario 1: "I want to add a new prompt to the top"
**Recommendation:** Use **Option 1: Prepend**
- Create `study-guide-prompt-00.md`
- Takes 2 minutes
- Zero risk

### Scenario 2: "I want to add a new prompt to the bottom"
**Recommendation:** Use **Option 2: Append**
- Create `study-guide-prompt-21.md`
- Takes 2 minutes
- Zero risk, perfect numbering

### Scenario 3: "I want to move prompt #15 to position #3"
**Recommendation:** Use **Option 3: Content Swap**
- Swap contents of `03.md` and `15.md`
- Update 2 JSON descriptions
- Takes ~5 minutes
- Low risk with backup

### Scenario 4: "I have 00, 01, 05, 07, 10, 20 and want perfect 01-06"
**Recommendation:** Use **Option 3: Content Swap** (if only 6 files)
- Swap contents to fill gaps
- Update 6 JSON descriptions
- Takes ~15 minutes
- OR just accept non-sequential numbering (doesn't affect users)

### Scenario 5: "I must have perfect numbering across 20+ prompts"
**Recommendation:** Ask yourself: Is this worth 60 minutes of work?
- Users never see filenames
- Non-sequential numbering doesn't affect functionality
- Consider Option 3 (content swap) instead of mass rename
- If you must: Use mass rename, backup first, test thoroughly

---

## 🔍 Real-World Example: Adding Lecture Notes Generator

**Scenario:** Add new prompt to top of Study Tools (currently starts at `01`)

**Approach used:** Option 1 (Prepend with `00`)

**Steps taken:**
1. Created `prompts/study-guides/begin/study-guide-prompt-00.md`
2. Created `prompts-download/study-guides-prompts/study-guide-prompt-00.md`
3. Added to `prompt-descriptions.json`:
   ```json
   "study-guide-prompt-00": "Build lecture notes that actually work! Active recall questions, dual coding visuals, spaced repetition schedules—cognitive science for maximum retention!"
   ```
4. Ran `npm run build` to regenerate `prompts-data.json`

**Result:**
- ✅ New prompt appears at top of list
- ✅ All existing prompts unchanged (01-20)
- ✅ Total time: 3 minutes
- ✅ Zero risk of breaking existing prompts
- ✅ Non-sequential numbering (00, 01, 02...) - cosmetic only

**Alternative considered:** Mass renaming to achieve 01-21 sequence
- ❌ Would require renaming 40+ files (source + download)
- ❌ Would require updating 21 JSON keys
- ❌ Would take 30-60 minutes
- ❌ Would show massive git diff (hard to review)
- ❌ No functional benefit over `00` approach

**Decision:** Prepend with `00` was the obvious choice.

---

## 🧪 Testing After Reordering

After using any of these approaches, verify:

1. **Dev mode works:**
   ```bash
   npm run serve
   # Open http://localhost:8080
   # Click category button
   # Verify prompts appear in correct order
   ```

2. **Copy button works:**
   - Open each new/moved prompt
   - Click "Copy Prompt" button
   - Paste into text editor
   - Verify content is correct

3. **Marketing descriptions match:**
   - Check that button headers show correct taglines
   - Verify descriptions align with actual prompt content

4. **Production build:**
   ```bash
   npm run build
   # Check prompts-data.json for correct order and descriptions
   ```

5. **Download folder parity:**
   ```bash
   # Verify both folders have identical files
   ls prompts/study-guides/begin/
   ls prompts-download/study-guides-prompts/
   ```

---

## 📝 Key Takeaways

1. **Prepend (`00`) and Append (`21`) are the safest, fastest approaches** - use them unless you have a compelling reason not to.

2. **Content swapping is better than mass renaming** - when you need perfect numbering, swap content instead of renaming files.

3. **Non-sequential numbering is fine** - users never see filenames, so `00, 01, 02...` vs `01, 02, 03...` is purely cosmetic.

4. **Always update `prompt-descriptions.json`** - marketing taglines must match file content, not just filename.

5. **Test in dev mode first** - catch issues before committing to production.

6. **Backup before major swaps** - content swapping requires careful tracking, so back up first.

---

## 🔗 Related Documentation

- **Adding New Categories:** See `ADDING-NEW-CATEGORIES.md` for full integration guide
- **Project Overview:** See `CLAUDE.md` for session notes and architectural decisions
- **Build Process:** See `scripts/build-prompts.js` for how sorting works

---

Generated for SHPE 2025 National Convention - Philadelphia, PA
