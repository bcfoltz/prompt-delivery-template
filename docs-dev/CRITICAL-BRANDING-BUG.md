# CRITICAL: Branding Configuration Bug & Fix

**Date Discovered:** 2025-11-03
**Time to Debug:** 4+ hours (unacceptable)
**Severity:** HIGH - Silent content override

---

## The Bug

When you update content in `index.html`, the changes appear briefly but then get **overwritten** by the branding loader JavaScript.

### What Happens:
1. You edit `index.html` and commit/push
2. GitHub Pages deploys successfully
3. You load the page and see your changes for a split second
4. Then `branding-loader.js` loads `branding-config.json`
5. Your changes disappear and old content appears

### Why It's Insidious:
- ✅ Git shows correct changes
- ✅ Deployment succeeds
- ✅ Server serves correct HTML
- ❌ **JavaScript overwrites it dynamically after page load**

---

## The Root Cause

**File:** `branding-loader.js` (lines 78-81)

```javascript
// Update subtitle
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
  subtitle.textContent = config.site.subtitle;  // ⚠️ OVERWRITES HTML
}
```

This code **dynamically replaces** the `.subtitle` element's text content with whatever is in `branding-config.json`, regardless of what's in the HTML file.

**The branding loader runs AFTER the page loads**, so you see the HTML version first, then it gets replaced.

---

## How to Fix It (The Right Way)

### ⚠️ CRITICAL RULE: Always Update BOTH Files

When updating any branded content on the landing page, you MUST update **TWO files**:

#### 1. Update `index.html` (for crawlers, SSR, no-JS users)
```html
<p class="subtitle disclaimer">Your new text here</p>
```

#### 2. Update `branding-config.json` (for actual display)
```json
{
  "site": {
    "subtitle": "Your new text here"
  }
}
```

### Why Update Both?
- **index.html**: What search engines see, initial render, accessibility
- **branding-config.json**: What users actually see after JS loads

---

## Elements Affected by Branding Loader

All of these get dynamically overwritten by `branding-loader.js`:

| HTML Element | Selector | Config Path | Line # |
|--------------|----------|-------------|--------|
| Logo image | `.convention-logo` | `branding.logo` / `branding.logoAlt` | 65-69 |
| Main heading | `header h1` | `site.heading` | 72-75 |
| **Subtitle/disclaimer** | `.subtitle` | `site.subtitle` | **78-81** |
| Footer author | `.footer-author` | `footer.authorName` | 84-96 |
| Footer event link | `.footer-event-link` | `event.name` / `event.url` | 99-103 |

---

## Debugging Checklist

If you see content flashing and reverting:

- [ ] Check browser console for branding loader message
- [ ] Inspect the element - does it have a class matching the table above?
- [ ] Check `branding-config.json` for that element's config path
- [ ] Verify BOTH `index.html` AND `branding-config.json` have correct text
- [ ] Clear service worker and hard refresh to test
- [ ] Use Network tab (DevTools) to verify correct files are loading

---

## Service Worker Confusion

During the 2025-11-03 incident, we wasted 3+ hours on service worker caching issues because:

1. The HTML file was correct
2. Git history was correct
3. Deployment succeeded
4. Service worker was serving correct HTML
5. **But branding-config.json had old text**

The service worker was a red herring. The real issue was the branding config file.

### When to Suspect Service Worker vs Branding Config:

**Service Worker Issue:**
- Content never changes, even after unregistering SW
- Old files persist even in Network tab
- Happens on fresh/incognito windows
- DevTools shows SW serving from cache

**Branding Config Issue:**
- Content flashes correct then reverts ⚠️ **KEY SYMPTOM**
- Correct file in Network tab
- Console shows "✓ Branding configuration loaded"
- Happens even with SW disabled

---

## Prevention for Future Events

### When Creating New Event App:

1. **Clone from SHPE 2025** (master template)
2. **Edit `branding-config.json` FIRST** before any other changes
3. Update ALL fields in the config:
   - `event.*` (name, dates, location, URL)
   - `branding.*` (logo, alt text, favicon)
   - `colors.*` (brand colors)
   - `site.*` (title, description, heading, **subtitle**)
   - `pwa.*` (app names, description)
   - `footer.*` (author, links)

4. **Test locally** before committing:
   ```bash
   npm run serve
   ```

5. **Verify in browser**:
   - Open DevTools Console
   - Look for: `✓ Branding configuration loaded: [Your Event Name]`
   - Inspect all text elements to confirm correct branding
   - Check Network tab - verify correct JSON file loaded

6. **Only then push to GitHub**

### When Updating Existing Event App:

**Before editing ANY landing page content:**

1. Check if element has a class: `.convention-logo`, `header h1`, `.subtitle`, `.footer-author`, `.footer-event-link`
2. If YES → Update `branding-config.json` (HTML update optional)
3. If NO → Update `index.html` only

**Always verify** by viewing source vs inspecting element:
- **View Source**: Shows what server sent (HTML file)
- **Inspect Element**: Shows what JavaScript changed (branding loader result)

---

## Testing After Changes

### Quick Test (30 seconds):
```bash
npm run serve
# Open http://localhost:3000
# Open DevTools Console
# Verify: "✓ Branding configuration loaded: [Event Name]"
# Inspect subtitle element - check textContent
```

### Full Test (2 minutes):
1. Clear browser cache
2. Unregister all service workers
3. Hard refresh (Ctrl+Shift+R)
4. Check all branded elements
5. Test offline mode (disconnect network)
6. Verify PWA install prompt

---

## Documentation Updates Needed

After this bug was discovered, the following files were updated:

- ✅ `CRITICAL-BRANDING-BUG.md` (this file) - NEW
- ⏳ `REPLICATION-GUIDE.md` - Add warnings about branding config
- ⏳ `ADDING-NEW-CATEGORIES.md` - Not affected
- ⏳ `CLAUDE.md` - Add session notes about this bug

---

## For Claude Code (AI Assistant)

When user reports content not updating on live site:

### Diagnostic Steps (in order):
1. **Ask:** "Does the content flash correct then revert?"
   - If YES → Check `branding-config.json` immediately
   - If NO → Check service worker / caching

2. **Verify files locally:**
   ```bash
   grep -n "text-to-find" index.html
   grep -n "text-to-find" branding-config.json
   ```

3. **Check what's deployed:**
   ```bash
   curl https://[site-url]/branding-config.json | jq .site.subtitle
   ```

4. **Only if JSON is correct**, then investigate service worker

### Fix Process:
1. Edit `branding-config.json` with correct text
2. Bump service worker cache version (force refresh)
3. Commit and push both files
4. Wait for deployment (~60 seconds)
5. Instruct user to unregister service worker and hard refresh

### What NOT to do:
- ❌ Don't spend hours debugging service workers first
- ❌ Don't edit only index.html if element is branding-controlled
- ❌ Don't assume git/deployment is the issue
- ❌ Don't trust "View Source" - check "Inspect Element" textContent

---

## Lessons Learned

1. **Dynamic content overrides are dangerous** - They hide the truth
2. **Split-second flashing is a huge red flag** - Always means JS override
3. **Service worker + dynamic JS = debugging nightmare**
4. **"View Source" ≠ "Inspect Element"** when JavaScript modifies DOM
5. **Always check ALL sources of truth** - HTML, JSON configs, JS loaders

---

## Future Improvement Ideas

To prevent this bug in future versions:

### Option 1: Remove Dynamic Branding
- Remove `branding-loader.js` entirely
- Force manual HTML updates for each event
- PRO: No hidden overrides
- CON: More work for new events

### Option 2: Validation Layer
- Add warning if HTML ≠ branding config
- Console warning: "⚠️ HTML subtitle doesn't match branding config"
- PRO: Makes conflict obvious
- CON: Adds complexity

### Option 3: Single Source of Truth
- Make HTML read from branding-config.json at build time
- Remove runtime JavaScript override
- PRO: Eliminates conflict
- CON: Requires build step

**Recommendation:** Keep current system but add validation warning in branding-loader.js

---

**End of Document**
