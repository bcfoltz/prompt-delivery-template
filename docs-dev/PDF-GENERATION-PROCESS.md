# PDF Generation Process Documentation

## Overview

This document describes the process for generating PDF versions of prompt markdown files using Gotenberg, a Docker-based PDF rendering service. This process was successfully implemented for both student and advisor prompts.

## Prerequisites

### Required Services

- **Gotenberg**: Docker container running on `http://localhost:3000`
  - Start command: `docker run -d -p 3000:3000 gotenberg/gotenberg:8`
  - Check health: `curl http://localhost:3000/health`

### Required Python Packages

```bash
pip install requests tqdm
```

## Directory Structure

```
prompts/
├── student/
│   ├── begin/              # Source markdown files (15 files)
│   └── pdf/                # Generated PDFs
└── advisor/
    ├── begin/              # Source markdown files (10 files)
    └── pdf/                # Generated PDFs
```

## PDF Generation Settings

### Font and Typography

- **Base font size**: 13px (reduced from default 16px for better space utilization)
- **Line height**: 1.5
- **H1 (title)**: 1.8em
- **H2 (sections)**: 1.4em
- **H3 (subsections)**: 1.2em

### Page Layout

- **Paper size**: 8.5" x 11" (US Letter)
- **Margins**:
  - Top/Bottom: 0.59" (15mm)
  - Left/Right: 0.47" (12mm)
- **Content padding**: 16px

### Styling

- **Theme**: GitHub Markdown Light CSS
- **Code blocks**: Light gray background (#f6f8fa), 12px padding
- **Tables**: 1px borders, 6px padding, light gray header background
- **Max content width**: 900px

## Issues Encountered and Fixed

### Issue 1: Marketing Taglines in Prompt Content

**Problem**: Marketing taglines (e.g., "Decode the job market! Get data-driven insights...") were embedded in the markdown files themselves, appearing as the second paragraph after the title.

**Root Cause**: Marketing taglines were intended only for the app UI (button descriptions in `prompts-data.json`), not in the actual prompt content.

**Solution**:
1. Removed line 3 (marketing tagline) from all 25 prompt files
2. Rebuilt `prompts-data.json` using `node scripts/build-prompts.js`
3. Marketing taglines now only exist in the `description` field of `prompts-data.json`

**Files affected**: All 15 student prompts + 10 advisor prompts

### Issue 2: Extra Blank Lines After Title

**Problem**: After removing marketing taglines, files had an extra blank line between the title and content, violating markdown linting rules.

**Expected structure**:
```markdown
# Title
<blank line>
Content starts here...
```

**Actual structure**:
```markdown
# Title
<blank line>
<extra blank line>
Content starts here...
```

**Solution**: Removed the extra blank line (line 3) from all affected files to conform to proper markdown structure.

**Files affected**: 24 prompts (14 student + 10 advisor; one student prompt was already correct)

### Issue 3: Template Variables Rendered as Definition List

**Problem**: When multiple template variables appeared on consecutive lines without blank lines between them, the PDF renderer interpreted them as a definition list, causing improper formatting.

**Example of problematic structure**:
```markdown
## Student Information

{course_subject}:
{course_textbook} (optional):
{study_topics}:
```

**PDF rendering result**: Variables grouped together on single lines with colons merged.

**Root Cause**: Markdown parsers interpret consecutive lines ending with colons as definition list syntax.

**Solution**: Added blank lines between each template variable:
```markdown
## Student Information

{course_subject}:

{course_textbook} (optional):

{study_topics}:
```

**Files affected**: 19 prompts (11 student + 8 advisor initially; 3 additional student prompts with optional fields fixed later)

### Issue 4: Optional Field Variables

**Problem**: Template variables with "(optional)" labels still had spacing issues in prompts 13, 14, and 15.

**Pattern**:
```markdown
{course_subject}:
{course_textbook} (optional):
{study_topics}:
```

**Root Cause**: The initial regex fix pattern `(\{[^}]+\}:)` didn't match variables with text between `}` and `:`, so `{variable} (optional):` was missed.

**Solution**: Manually added blank lines between these variables in the three affected student prompts.

**Files affected**: student-prompt-13.md, student-prompt-14.md, student-prompt-15.md

### Issue 5: Font Size Too Large

**Problem**: Default font size caused many prompts to span multiple pages when they could fit on one page with minor adjustments.

**Solution**: Optimized typography and spacing:
- Reduced base font size from 16px to 13px
- Tightened line height to 1.5
- Reduced margins (top/bottom: 20mm → 15mm, left/right: 15mm → 12mm)
- Reduced content padding from 20px to 16px
- Scaled heading sizes proportionally
- Tightened spacing between elements

**Result**: More content fits on each page while maintaining readability.

## PDF Generation Script

### Basic Structure

```python
#!/usr/bin/env python3
import pathlib
import requests
from tqdm import tqdm

INPUT_DIR = pathlib.Path("prompts/student/begin")  # or advisor/begin
OUTPUT_DIR = pathlib.Path("prompts/student/pdf")   # or advisor/pdf
GOTENBERG_URL = "http://localhost:3000"
THEME_URL = "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css"

def generate_html(md_filename, title):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <link rel="stylesheet" href="{THEME_URL}">
    <style>
        @page {{ margin: 15mm 12mm; }}
        .markdown-body {{
            padding: 16px;
            max-width: 900px;
            margin: 0 auto;
            font-size: 13px;
            line-height: 1.5;
        }}
        /* Additional styling... */
    </style>
</head>
<body class="markdown-body">
    {{{{ toHTML "{md_filename}" }}}}
</body>
</html>'''

# Iterate through markdown files
for md_path in tqdm(md_files, desc="Converting", unit="file"):
    html = generate_html(md_path.name, md_path.stem)
    with md_path.open("rb") as f:
        files = [
            ("files", ("index.html", html, "text/html")),
            ("files", (md_path.name, f, "text/markdown")),
        ]
        resp = requests.post(
            f"{GOTENBERG_URL}/forms/chromium/convert/markdown",
            files=files,
            data={
                "paperWidth": "8.5",
                "paperHeight": "11",
                "marginTop": "0.59",
                "marginBottom": "0.59",
                "marginLeft": "0.47",
                "marginRight": "0.47",
            },
            timeout=180,
        )
        resp.raise_for_status()
        pdf_path.write_bytes(resp.content)
```

## Regenerating PDFs

### When to Regenerate

Regenerate PDFs when:
1. Markdown source files are modified
2. Styling changes are needed
3. New prompts are added
4. Template variable structure changes

### Process

1. **Ensure Gotenberg is running**:
   ```bash
   docker ps | grep gotenberg
   # If not running:
   docker run -d -p 3000:3000 gotenberg/gotenberg:8
   ```

2. **Verify markdown files are correct**:
   - No marketing taglines in content
   - Proper blank line structure (title → blank → content)
   - Template variables have blank lines between them
   - No extra blank lines

3. **Run PDF generation**:
   ```bash
   python generate-student-pdfs.py  # or create script on-demand
   python generate-advisor-pdfs.py
   ```

4. **Verify output**:
   ```bash
   ls -lh prompts/student/pdf/*.pdf
   ls -lh prompts/advisor/pdf/*.pdf
   ```

## Best Practices

### Markdown File Structure

1. **Title**: Always use H1 (`#`) for the main title
2. **Spacing**: Exactly one blank line after title before content starts
3. **Template variables**: Always separate with blank lines
4. **Sections**: Use H2 (`##`) for major sections like "Example" and "Student Information"

### Script Management

1. **Temporary scripts**: PDF generation scripts should be temporary and deleted after use
2. **No emoji**: Avoid emoji characters in print statements (Windows encoding issues)
3. **Error handling**: Always use try/except and report failures
4. **Progress tracking**: Use tqdm for visual feedback on batch operations

### Testing PDFs

1. **Check rendering**: Open a few PDFs to verify formatting
2. **Verify variables**: Ensure template variables display correctly (not as definition lists)
3. **Check page breaks**: Confirm content fits appropriately on pages
4. **Review file sizes**: PDFs should be reasonable (25KB-70KB range)

## Common Pitfalls

1. **Consecutive variables without spacing**: Always add blank lines between template variables
2. **Marketing content in prompts**: Marketing taglines belong only in `prompts-data.json`, never in .md files
3. **Extra blank lines**: Follow strict markdown structure (title → blank → content)
4. **Windows encoding**: Avoid Unicode characters (emoji, special symbols) in Python print statements
5. **Forgetting to rebuild data**: Always run `node scripts/build-prompts.js` after editing markdown files

## File Manifest

### Generated PDFs

**Student PDFs** (15 files):
- student-prompt-01.pdf through student-prompt-15.pdf
- Location: `prompts/student/pdf/`
- Size range: 23KB - 67KB

**Advisor PDFs** (10 files):
- advisor-prompt-01.pdf through advisor-prompt-10.pdf
- Location: `prompts/advisor/pdf/`
- Size range: 36KB - 58KB

## Related Documentation

- `CLAUDE.md`: Project overview and development workflow
- `docs-dev/REPLICATION-GUIDE.md`: Creating new event-specific versions
- `scripts/build-prompts.js`: Builds `prompts-data.json` from markdown files

## Gotenberg API Reference

### Convert Markdown to PDF

**Endpoint**: `POST http://localhost:3000/forms/chromium/convert/markdown`

**Files**:
- `index.html`: HTML wrapper with styles and `{{ toHTML "filename.md" }}` directive
- `filename.md`: Markdown content to convert

**Form Data** (optional):
- `paperWidth`: Paper width in inches (e.g., "8.5")
- `paperHeight`: Paper height in inches (e.g., "11")
- `marginTop`: Top margin in inches (e.g., "0.59")
- `marginBottom`: Bottom margin in inches
- `marginLeft`: Left margin in inches
- `marginRight`: Right margin in inches

**Response**: Binary PDF content

## Troubleshooting

### Gotenberg not responding

```bash
# Check if container is running
docker ps | grep gotenberg

# Check health endpoint
curl http://localhost:3000/health

# Restart if needed
docker stop $(docker ps -q --filter ancestor=gotenberg/gotenberg:8)
docker run -d -p 3000:3000 gotenberg/gotenberg:8
```

### PDF formatting issues

1. Check markdown source for extra blank lines
2. Verify template variables have blank lines between them
3. Inspect HTML wrapper for CSS issues
4. Test with a single file first before batch processing

### Python encoding errors

- Remove all Unicode characters (emoji, special symbols) from print statements
- Use plain ASCII characters only in console output
- Error typically appears as: `UnicodeEncodeError: 'charmap' codec can't encode character`

## Summary

The PDF generation process successfully converts 25 markdown prompt files (15 student + 10 advisor) into professionally formatted PDFs using Gotenberg. Key learnings include:

1. **Proper markdown structure matters**: Extra blank lines and improper spacing cause rendering issues
2. **Definition list syntax**: Consecutive lines with colons are interpreted as definition lists
3. **Separation of concerns**: Marketing content belongs in UI metadata, not prompt content
4. **Space optimization**: Smaller fonts and tighter spacing maximize content per page
5. **Windows compatibility**: Avoid Unicode in console output for Windows environments

All issues have been documented and resolved, resulting in clean, professional PDFs ready for distribution at the SHPE 2025 convention.
