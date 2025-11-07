# Event Replication Guide

This guide explains how to create a new branded version of this prompt delivery app for a different speaking event.

**Time Required:** ~20 minutes per new event

---

## ⚠️ CRITICAL WARNING: Branding Configuration Override

**READ THIS FIRST!** The branding system uses JavaScript to dynamically update content on page load.

### 🚨 Important Rule:
If you edit content in `index.html` that is controlled by `branding-loader.js`, your changes will be **overwritten** by `branding-config.json` when the page loads.

**Elements controlled by branding loader:**
- Logo (`.convention-logo`)
- Main heading (`header h1`)
- **Subtitle/disclaimer** (`.subtitle`) ⚠️ **Most commonly affected**
- Footer author name (`.footer-author`)
- Footer event link (`.footer-event-link`)

### How to Update These Elements:
1. **Edit `branding-config.json`** (this is what users see)
2. **Optionally edit `index.html`** (for SEO/crawlers)

**For full details on this bug:** See `docs-dev/CRITICAL-BRANDING-BUG.md`

---

## Overview

This app uses a **branding configuration system** that makes replication simple:
- All branding is centralized in `branding-config.json`
- Prompts remain identical across all versions
- Each event gets its own GitHub repository and URL
- Zero code changes required—just update config!

---

## Step-by-Step Instructions

### 1. Create New GitHub Repository (5 min)

1. Go to GitHub and create a new repository
   - Name format: `[event-name-year]` (e.g., `aws-summit-2025`)
   - Set to **Public** (required for GitHub Pages)
   - DO NOT initialize with README (we'll copy everything over)

2. Clone the SHPE 2025 repo to your local machine (if not already there):
   ```bash
   git clone https://github.com/bcfoltz/shpe-2025.git temp-shpe-2025
   cd temp-shpe-2025
   ```

3. Remove the git history and reinitialize:
   ```bash
   rm -rf .git
   git init
   git branch -M main
   ```

4. Connect to your new repository:
   ```bash
   git remote add origin https://github.com/bcfoltz/[new-event-name].git
   ```

---

### 2. Update Branding Configuration (5 min)

Edit `branding-config.json` with your new event details:

```json
{
  "event": {
    "name": "Your Event Full Name",           // e.g., "AWS Summit 2025"
    "shortName": "Event 2025",                // Short version for PWA
    "location": "City, State",                // Event location
    "dates": "Month Day-Day, Year",           // Event dates
    "url": "https://event-website-url.com"    // Link to event site
  },
  "branding": {
    "logo": "event-logo.webp",                // Your logo filename
    "logoAlt": "Event Logo Alt Text",         // Descriptive alt text
    "favicon": "event-logo.webp"              // Usually same as logo
  },
  "colors": {
    "primary": "#YOUR_PRIMARY_HEX",           // Main brand color
    "primaryHover": "#YOUR_HOVER_HEX",        // Slightly darker for hover
    "secondary": "#YOUR_SECONDARY_HEX",       // Secondary brand color
    "secondaryHover": "#YOUR_HOVER_HEX",      // Slightly darker for hover
    "themeColor": "#YOUR_THEME_HEX"           // PWA theme (usually primary)
  },
  "site": {
    "title": "Event Name - LLM Prompts",      // Browser tab title
    "description": "LLM Prompts for ...",     // Meta description
    "heading": "AI-Powered Academic Prompts", // Can customize or keep
    "subtitle": "Choose the prompts designed for you" // Can customize or keep
  },
  "pwa": {
    "appName": "Event 2025 AI Prompts",       // PWA full name
    "appShortName": "Event 2025",             // PWA short name
    "appDescription": "AI-powered academic prompts for..." // PWA description
  },
  "footer": {
    "authorName": "Brandon Foltz",            // Your name
    "authorLinkedIn": "https://www.linkedin.com/in/brandonfoltz/" // Your LinkedIn
  }
}
```

**Tips:**
- Use a color picker tool to get hex codes from event branding
- Keep color contrast accessible (check with WebAIM contrast checker)
- `primaryHover` and `secondaryHover` should be 10-15% darker than base colors

---

### 3. Add Event Logo (2 min)

1. Place your event logo in the root directory
2. Name should match `branding.logo` in config (e.g., `aws-summit-logo.webp`)
3. Recommended format: **WebP** or PNG
4. Recommended size: **1080x1080px** (square, works for PWA icon)

**Optional:** Delete the old SHPE logo to keep repo clean:
```bash
rm SHPE-2025-logo.webp
```

---

### 4. Update Service Worker Cache Name (1 min)

Edit `service-worker.js` line 4:

```javascript
// Change from:
const CACHE_NAME = 'shpe-2025-v6';

// To:
const CACHE_NAME = 'event-name-2025-v1';
```

This prevents cache conflicts if users visit multiple event sites.

---

### 5. Update Service Worker Cache List (1 min)

Edit `service-worker.js` line 15 to reference your new logo:

```javascript
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './branding-config.json',
  './branding-loader.js',
  './manifest-generator.js',
  './event-logo.webp',  // ← Update this line
  './prompts-manifest.json',
  './prompts-data.json'
];
```

---

### 6. Test Locally (3 min)

1. Start local server:
   ```bash
   npm run serve
   ```

2. Open browser to `http://127.0.0.1:8080/`

3. Check console (F12) for:
   - ✓ Branding configuration loaded: [Your Event Name]
   - ✓ PWA manifest generated dynamically
   - No errors

4. Verify visually:
   - Logo displays correctly
   - Colors match your branding
   - Footer shows correct event name and link
   - Site title in browser tab is correct

---

### 7. Deploy to GitHub Pages (3 min)

1. Stage and commit all changes:
   ```bash
   git add .
   git commit -m "Initial setup for [Event Name] 2025"
   ```

2. Push to GitHub:
   ```bash
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

4. Wait 2-3 minutes for deployment

5. Your site will be live at:
   `https://bcfoltz.github.io/[repo-name]/`

---

### 8. Generate QR Codes (5 min)

Use the existing `generate-qr-codes.js` script:

```bash
node generate-qr-codes.js
```

This generates QR codes in the `qr-codes/` folder:
- `main.png/svg` - Links to landing page
- `students.png/svg` - Direct link to student prompts
- `advisors.png/svg` - Direct link to advisor prompts
- `preview.html` - View all QR codes at once

**For presentations:** Use PNG versions (work well on slides/projectors)

---

## What Stays the Same

These files **never need to change** across event replications:

- ✅ All prompt content in `prompts/` folder
- ✅ `app.js` - Core application logic
- ✅ `styles.css` - Styling (colors come from config)
- ✅ `index.html` - Structure (content comes from config)
- ✅ `branding-loader.js` - Branding system
- ✅ `manifest-generator.js` - PWA system
- ✅ Build scripts and workflows

---

## Troubleshooting

### ⚠️ Content flashes correct then reverts (MOST COMMON)
**Symptom:** You see your updated text for a split second, then it changes back to old text.

**Root Cause:** The branding loader is overwriting your HTML changes with old text from `branding-config.json`.

**How to Fix:**
1. Open `branding-config.json`
2. Find the `site.subtitle` field (or relevant field for other elements)
3. Update the text there
4. Commit and push
5. Hard refresh browser

**Why this happens:** `branding-loader.js` runs after page load and replaces certain elements with values from `branding-config.json`. Your HTML file might be correct, but JavaScript overwrites it.

**See full documentation:** `docs-dev/CRITICAL-BRANDING-BUG.md`

---

### Logo not showing
- Check filename matches `branding.logo` in config exactly
- Check file is in root directory (not in a subfolder)
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### Colors not updating
- Clear browser cache or hard refresh
- Check hex codes are valid (6 characters, start with #)
- Open console to see if branding config loaded successfully

### Service worker not updating
- Bump cache version number in `service-worker.js`
- Unregister old service worker:
  - Open DevTools → Application → Service Workers
  - Click "Unregister"
  - Hard refresh page

### GitHub Pages 404
- Verify repo is set to Public
- Check Pages settings: Settings → Pages
- Wait 3-5 minutes after first push
- Check deployment status: Actions tab

---

## Quick Checklist

Before going live with a new event site, verify:

- [ ] `branding-config.json` updated with all event details
- [ ] New logo file added and referenced correctly
- [ ] Service worker cache name changed
- [ ] Service worker cache list updated for new logo
- [ ] Site tested locally - looks and works correctly
- [ ] Console shows no errors
- [ ] All commits pushed to GitHub
- [ ] GitHub Pages enabled and deployed successfully
- [ ] QR codes generated and saved
- [ ] Live site loads correctly at GitHub Pages URL
- [ ] Test on mobile device

---

## Advanced: Custom Modifications

If you need to modify more than just branding:

### Different Student/Advisor Button Text
Edit `index.html` lines 40-48:
```html
<button id="btn-students" class="track-button" aria-label="View prompts for students">
  <span class="button-icon" aria-hidden="true">🎓</span>
  <span class="button-text">For Students</span>  <!-- Change this -->
</button>
```

### Additional Footer Links
Edit `index.html` footer section (~line 113-122)

### Different Prompt Categories
Would require changes to:
- `prompts-manifest.json`
- `prompts-data.json`
- Build scripts

**Recommendation:** Keep prompts identical for consistency across events.

---

## Support

**Questions?** Review:
- This guide (REPLICATION-GUIDE.md)
- Main README.md for technical details
- CLAUDE.md for project architecture notes

**Issues?**
- Check browser console for error messages
- Verify all file paths match exactly (case-sensitive!)
- Test with a fresh incognito window to avoid cache issues

---

**Last Updated:** 2025-01-22
**Template Version:** v6
**Original Event:** SHPE 2025 National Convention
