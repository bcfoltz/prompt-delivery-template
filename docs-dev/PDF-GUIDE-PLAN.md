# PDF Prompt Guide Implementation Plan

**Created:** 2025-10-24
**Status:** Planning - To be implemented tomorrow

## Requirements Summary

- **Use Case:** Both reference browsing AND active copy-paste
- **Access Method:** QR code to download PDF
- **Structure:** One combined document (all 25 prompts)
- **Design:** Professional and polished (match web app quality)

## Recommended Solution: Hybrid Approach

### 📄 Component 1: Professional PDF Guide

**A branded PDF document (~30-40 pages)**

#### Structure:
1. **Cover Page**
   - SHPE 2025 logo and branding
   - "AI-Powered Academic Prompts"
   - "Complete Prompt Guide for Students & Advisors"
   - Brandon Foltz, convention info

2. **Introduction/How to Use** (1 page)
   - What these prompts are and why they're valuable
   - How to use them with any LLM (Claude, ChatGPT, etc.)
   - Pro tip: Copy from the companion website (include QR/short URL)

3. **Student Prompts Section** (15-20 pages)
   - Table of contents with all 15 student prompts
   - Each prompt formatted page:
     - Title and infomercial description
     - Full prompt text (readable, well-formatted)
     - Example usage
     - Note: "For easier copying, visit [short URL]"

4. **Advisor Prompts Section** (10-15 pages)
   - Same structure as student section
   - All 10 advisor prompts

5. **Back Cover**
   - QR code to the web app (for easy copying)
   - Your LinkedIn, contact info
   - Convention info

### 🌐 Component 2: Companion Copy-Helper Page

**A minimal web page separate from main app:**

- **URL:** `bcfoltz.github.io/shpe-2025/prompt-guide`
- **Purpose:** Clean, copy-optimized text version
- **Layout:**
  - Simple header: "SHPE 2025 Prompt Guide - Copy Helper"
  - Collapsible sections for each prompt
  - Large "Copy" button next to each prompt
  - No fancy UI - just clean, copy-friendly text
  - Link back to main interactive app

### 🔗 Component 3: QR Code Strategy

**Two QR codes for different use cases:**

1. **"Download Full PDF Guide"**
   - Links to hosted PDF file
   - For people who want the complete reference document

2. **"Quick Copy Prompts"**
   - Links to the copy-helper web page
   - For people who want to immediately start copying

## Implementation Approaches

### Approach A: Markdown → Pandoc → PDF (Recommended)

**Benefits:**
- Programmable and version controlled
- Consistent formatting
- Easy to maintain and update
- Professional LaTeX output

**Process:**
1. Create master markdown file combining all prompts
2. Create custom Pandoc template with SHPE branding
3. Run Pandoc to generate PDF
4. Automate with npm script

**Tools Needed:**
- Pandoc (install via: `choco install pandoc` or download)
- LaTeX distribution (for PDF generation)
- Custom template file

**Script Structure:**
```javascript
// scripts/generate-pdf.js
const fs = require('fs');
const { execSync } = require('child_process');

// 1. Read all prompt files
// 2. Combine into master markdown with sections
// 3. Add cover page, TOC, branding
// 4. Run Pandoc with custom template
// 5. Output: prompt-guide.pdf
```

### Approach B: HTML → Puppeteer → PDF

**Benefits:**
- More design control
- Uses existing web styling knowledge
- Can preview in browser before generating PDF

**Process:**
1. Create styled HTML template
2. Generate HTML page with all prompts
3. Use Puppeteer to render as PDF
4. Configure page margins, headers, footers

**Tools Needed:**
- Puppeteer (`npm install puppeteer`)
- HTML/CSS template

## File Structure

```
shpe-2025/
├── prompt-guide.pdf           # Generated PDF (30-40 pages)
├── prompt-guide.html          # Copy-helper page
├── scripts/
│   ├── generate-pdf.js        # PDF generation script
│   └── generate-copy-helper.js # Copy-helper page generator
├── templates/
│   ├── pdf-template.latex     # Pandoc LaTeX template (if using Approach A)
│   └── pdf-template.html      # HTML template (if using Approach B)
└── qr-codes/
    ├── qr-pdf-download.png    # QR for PDF
    ├── qr-pdf-download.svg    # QR for PDF (vector)
    ├── qr-copy-helper.png     # QR for web page
    └── qr-copy-helper.svg     # QR for web page (vector)
```

## Implementation Steps

### Day 1: PDF Generation Setup

1. **Choose approach** (Pandoc vs Puppeteer)
2. **Install dependencies**
   - If Pandoc: Install Pandoc + LaTeX
   - If Puppeteer: `npm install puppeteer`
3. **Create generation script**
   - Read all 25 prompt markdown files
   - Combine into master document
   - Add cover page, intro, sections
   - Generate PDF with branding

### Day 2: Copy-Helper Page

1. **Create `prompt-guide.html`**
   - Minimal design (no shadcn needed)
   - Responsive layout
   - Copy-to-clipboard functionality
2. **Build script to auto-generate**
   - Read from prompt markdown files
   - Generate HTML sections
   - Add copy buttons

### Day 3: QR Codes & Testing

1. **Generate QR codes**
   - PDF download URL
   - Copy-helper page URL
2. **Test on mobile devices**
   - PDF readability
   - Copy functionality
   - QR code scanning
3. **Polish and adjust**

### Day 4: Sync to NETA-2025

1. **Replicate setup to neta-2025**
   - Copy scripts
   - Adjust branding (Cengage colors)
   - Generate NETA version
   - Update QR codes

## Alternative Simpler Option

If hybrid approach is too complex:

**Enhanced PDF Only:**
- Single PDF with careful formatting
- Use Pandoc + custom template optimized for text selection
- Include prominent note: "For easiest copying, use QR code to visit web version"
- Single QR code to main web app (already exists)
- **Time:** ~2 hours instead of 4-5 hours

## Time Estimates

| Task | Approach A (Pandoc) | Approach B (Puppeteer) |
|------|---------------------|------------------------|
| PDF Setup & Template | 1-1.5 hours | 1.5-2 hours |
| PDF Generation Script | 1 hour | 1-1.5 hours |
| Copy-Helper Page | 1 hour | 1 hour |
| QR Codes & Testing | 0.5 hour | 0.5 hour |
| **Total** | **3.5-4 hours** | **4-5 hours** |

## Design Specifications

### PDF Branding
- **Colors:** SHPE Orange (#D44500), Navy Blue (#003DA5)
- **Typography:**
  - Headers: Sans-serif (Arial, Helvetica)
  - Body: Serif (Georgia, Times) for readability
- **Layout:**
  - A4 or Letter size
  - 1-inch margins
  - Page numbers in footer
  - Header with SHPE 2025 branding on each page

### Copy-Helper Page
- **Colors:** Match SHPE branding
- **Functionality:**
  - Click-to-copy buttons
  - Visual feedback on copy success
  - Mobile-responsive
  - Minimal JavaScript (no frameworks needed)

## Success Criteria

✅ PDF is professional and branded
✅ Text in PDF is readable and formatted well
✅ Copy-helper page works on mobile
✅ Copy buttons work reliably
✅ QR codes scan correctly
✅ Both formats contain all 25 prompts accurately
✅ NETA-2025 version also generated

## Questions for Tomorrow

- Do you want to try Approach A (Pandoc) or B (Puppeteer) first?
- Should the copy-helper page be a completely new page or integrated into existing site?
- Do you want separate PDFs for SHPE and NETA or wait until SHPE version is perfect?

## Resources

- [Pandoc User Guide](https://pandoc.org/MANUAL.html)
- [Pandoc LaTeX Templates](https://github.com/Wandmalfarbe/pandoc-latex-template)
- [Puppeteer PDF Generation](https://pptr.dev/#?product=Puppeteer&version=v21.5.2&show=api-pagepdfoptions)
