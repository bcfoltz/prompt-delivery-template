# Marketing Descriptions Restoration

## Issue

When we removed the marketing taglines from the markdown prompt files (to prevent them from appearing in the actual prompt content and PDFs), the `build-prompts.js` script started extracting the first paragraph from each prompt as the description instead of using the intended marketing taglines.

**Result**: The app button descriptions showed boring technical content like "Imagine you are a career counselor..." instead of the exciting marketing taglines like "Decode the job market! Get data-driven insights..."

## Solution

### 1. Created Marketing Descriptions File

Created `prompt-descriptions.json` containing all 25 marketing taglines mapped to their prompt IDs:

```json
{
  "student-prompt-01": "Decode the job market! Get data-driven insights...",
  "student-prompt-02": "Stop guessing about electives! Use the VIP framework...",
  ...
}
```

### 2. Updated Build Script

Modified `scripts/build-prompts.js` to:
1. Load the marketing descriptions from `prompt-descriptions.json`
2. Use these descriptions instead of extracting from content
3. Fall back to content extraction if a prompt ID is missing from the descriptions file

**Code changes**:
```javascript
// Load marketing descriptions
const descriptionsPath = path.join(PROJECT_ROOT, 'prompt-descriptions.json');
const MARKETING_DESCRIPTIONS = JSON.parse(fs.readFileSync(descriptionsPath, 'utf-8'));

// In readPromptFiles():
const promptId = file.replace('.md', '');
const description = MARKETING_DESCRIPTIONS[promptId] || extractDescription(content);
```

## Marketing Tagline Sources

Marketing taglines were recovered from git history:
- **Original 12 prompts**: Commit `7f962fb` - "feat: add infomercial-style descriptions to all prompt cards"
- **Study guide prompts (13-15)**: Commit `e9bc2e3` - "feat: add three study guide prompts with enhanced build script"

The taglines were originally in the markdown files themselves (as line 3, after the title), but needed to be:
1. Removed from markdown files (so they don't appear in prompt content/PDFs)
2. Preserved in `prompts-data.json` (so they appear in app button headers)

## Verification

After running `node scripts/build-prompts.js`, the `prompts-data.json` file now contains:

**Example - Student Prompt 01**:
```json
{
  "description": "Decode the job market! Get data-driven insights on the top 5-7 skills employers actually want, plus standout certifications, learning resources, and your first focus area to land that entry-level role!",
  "content": "# Research Entry-Level Skills for Your Field\n\nImagine you are a career counselor..."
}
```

**Example - Advisor Prompt 05**:
```json
{
  "description": "Plot semester-by-semester success! Create integrated four-year roadmaps combining courses, internships, skill development, and career milestones—transforming vague goals into actionable graduation plans!",
  "content": "# Create a Strategic Four-Year Roadmap\n\nImagine you are a strategic academic planner..."
}
```

## Key Takeaway

**Separation of Concerns**:
- **Markdown files** = Clean prompt content only (no marketing)
- **prompt-descriptions.json** = Marketing taglines for UI
- **prompts-data.json** = Generated file combining both (description field for UI, content field for actual prompt)

This separation ensures:
1. Marketing taglines appear in the app UI where they belong
2. Prompt content remains professional and clean
3. PDFs don't contain marketing fluff
4. Easy to update marketing copy without touching prompt files

## Files Changed

1. **Created**: `prompt-descriptions.json` (25 marketing taglines)
2. **Modified**: `scripts/build-prompts.js` (load and use descriptions)
3. **Regenerated**: `prompts-data.json` (now has correct descriptions)

## Future Maintenance

When adding new prompts:
1. Create the prompt markdown file in `prompts/student/begin/` or `prompts/advisor/begin/`
2. Add its marketing tagline to `prompt-descriptions.json`
3. Run `node scripts/build-prompts.js` to regenerate `prompts-data.json`

If a prompt is missing from `prompt-descriptions.json`, the build script will fall back to extracting the first paragraph from the prompt content.
