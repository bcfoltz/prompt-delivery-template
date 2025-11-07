# Post-Mortem Audit: SHPE & NETA Projects

**Date:** 2025-11-07
**Status:** Both projects production-ready and successful
**Purpose:** Identify cleanup opportunities before creating template

---

## Key Findings Summary

### HIGH Priority Issues

#### 1. Title Extraction Duplication
- **Where:** `app.js` (lines 125-207) and `scripts/build-prompts.js` (lines 85-208)
- **Impact:** ~200 lines duplicated code
- **Fix:** Extract to `scripts/utils/title-extractor.js`
- **Effort:** 1-2 hours

#### 2. QR Generator Script Duplication
- **Where:** Three nearly identical scripts:
  - `generate-pdf-example-qr.js`
  - `generate-audio-example-qr.js`
  - `generate-video-example-qr.js`
- **Impact:** ~200 lines duplicated (85-90% overlap)
- **Fix:** Create unified `scripts/utils/qr-generator.js` with config-driven approach
- **Effort:** 2-3 hours

#### 3. Category Hardcoding
- **Where:** Throughout `app.js` in 9+ locations
- **Impact:** Adding categories requires changes in 9 files (documented in ADDING-NEW-CATEGORIES.md)
- **Fix:** Configuration-driven category system
- **Effort:** 3-4 hours

#### 4. Site URL Hardcoding
- **Where:** All QR generator scripts have hardcoded `SITE_URL`
- **Impact:** Template creation requires manual updates in 4+ files
- **Fix:** Create `template-config.json` with site URL
- **Effort:** 1-2 hours

**HIGH Priority Total:** 10-15 hours

---

### MEDIUM Priority Issues

#### 5. Scripts Directory Structure
- **Current:** Flat structure with 6 scripts
- **Recommended:**
  ```
  scripts/
  ├── build/
  ├── generators/
  └── utils/
  ```
- **Effort:** 2-3 hours

#### 6. Build Validation Missing
- No check for expected 66 prompts
- No duplicate ID detection
- No JSON structure validation
- **Effort:** 2-3 hours

#### 7. Error Handling Improvements
- Minimal validation in build scripts
- No retry logic in QR generators
- **Effort:** 2-3 hours

**MEDIUM Priority Total:** 7-10 hours

---

### LOW Priority Issues

#### 8. Documentation Organization
- 14 files in `docs-dev/` need categorization
- Recommend: `processes/`, `guides/`, `archive/` subdirectories
- **Effort:** 1-2 hours

#### 9. Inconsistent Logging
- Mixed emoji styles (✓ vs ✅)
- Inconsistent separators
- **Effort:** 1-2 hours

#### 10. Service Worker Versions
- SHPE: v11, NETA: v4
- No versioning strategy documented
- **Effort:** 30 minutes

**LOW Priority Total:** 4-6 hours

---

## Refactoring Plan

### Phase 1: Code Deduplication (HIGH)
1. Extract title extraction to shared utility
2. Unify QR generation scripts
3. Create category configuration system
4. Create template-config.json

### Phase 2: Structure & Validation (MEDIUM)
1. Reorganize scripts/ directory
2. Add build validations
3. Improve error handling

### Phase 3: Template Preparation (HIGH)
1. Test template-config.json system
2. Update all scripts to use config
3. Verify both SHPE and NETA still work

### Phase 4: Documentation (MIXED)
1. Write Quick Start Guide
2. Write Customization Guide
3. Create PRD template
4. Create SOP checklist

### Phase 5: Polish (LOW - Optional)
1. Reorganize docs-dev/
2. Standardize logging
3. Document service worker versioning

---

## Expected Benefits

- **Code Reduction:** 30-40% fewer lines
- **Maintainability:** Category additions go from 9 files to 1 config change
- **Template Quality:** 30-minute setup time achievable
- **Consistency:** Both projects use same refactored code

---

## Next Actions

1. ✅ Complete audit
2. Begin Phase 1 refactoring
3. Test on both SHPE and NETA
4. Create template repository

---

**Total Estimated Effort:** 21-31 hours (can defer LOW priority to save 4-6 hours)
