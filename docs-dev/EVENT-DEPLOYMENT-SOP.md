# Event Deployment SOP

Standard Operating Procedure for deploying a prompt delivery site for a new event.

## Timeline

**Recommended:** Start 2-3 weeks before event
**Minimum:** 3-5 days before event

---

## Phase 1: Setup (Day 1)

### 1.1 Clone Template

```bash
git clone https://github.com/bcfoltz/prompt-delivery-template.git event-name-2025
cd event-name-2025
npm install
```

**Verify:**
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors

### 1.2 Create GitHub Repository

```bash
gh repo create event-name-2025 --public --source=. --remote=origin --push
```

**OR** manually:
- [ ] Create repo on github.com
- [ ] Update remote: `git remote set-url origin https://github.com/yourusername/event-name-2025.git`
- [ ] Push: `git push -u origin main`

**Verify:**
- [ ] Repository visible on GitHub
- [ ] Code pushed successfully

---

## Phase 2: Content Preparation (Days 1-3)

### 2.1 Gather Materials

- [ ] Event logo (PNG/WebP, 200-400px wide)
- [ ] Event details (name, dates, location, URL)
- [ ] Brand colors (hex codes)
- [ ] All prompts in markdown format
- [ ] Marketing taglines for each prompt

### 2.2 Organize Prompts

1. **Review prompts:**
   - [ ] Remove any sensitive information
   - [ ] Standardize formatting
   - [ ] Add template variables `{like this}`

2. **Number prompts:**
   - [ ] Use sequential numbering: 01, 02, 03...
   - [ ] Decide category order
   - [ ] File naming: `category-prompt-##.md`

3. **Place in directories:**
   ```
   prompts/
   ├── student/begin/
   ├── advisor/begin/
   ├── study-guides/begin/
   └── student-wellness/
   ```

**Verify:**
- [ ] All prompt files in correct directories
- [ ] All files properly numbered
- [ ] All files have `# Title` as first line

---

## Phase 3: Customization (Days 2-4)

### 3.1 Update Branding

Edit `branding-config.json`:

```json
{
  "event": {
    "name": "Actual Event Name",
    "shortName": "EventName",
    "location": "City, ST",
    "dates": "Month DD-DD, 2025",
    "url": "https://event-url.com/"
  },
  "branding": {
    "logo": "event-logo.png",
    "logoAlt": "Event Name 2025",
    "favicon": "event-logo.png"
  },
  "colors": {
    "primary": "#HEXCODE",
    "primaryHover": "#HEXCODE",
    "themeColor": "#HEXCODE"
  },
  "footer": {
    "authorName": "Your Name",
    "authorLinkedIn": "https://linkedin.com/in/yourprofile/"
  }
}
```

**Verify:**
- [ ] All event details accurate
- [ ] Logo file placed in root directory
- [ ] Colors match brand guidelines
- [ ] LinkedIn URL correct

### 3.2 Update Marketing Descriptions

Edit `prompt-descriptions.json`:

```json
{
  "student-prompt-01": "Short tagline (under 80 chars)",
  "student-prompt-02": "Another tagline",
  ...
}
```

**Verify:**
- [ ] Description for every prompt
- [ ] All under 80 characters
- [ ] Action-oriented language

### 3.3 Update Configuration

Edit `template-config.json`:

```json
{
  "deployment": {
    "siteUrl": "https://yourusername.github.io/event-name-2025"
  },
  "build": {
    "expectedTotalPrompts": 45  // Update with actual count
  }
}
```

**Verify:**
- [ ] Site URL matches GitHub Pages URL
- [ ] Total prompt count correct

---

## Phase 4: Build and Test (Day 4-5)

### 4.1 Build Site

```bash
npm run build
```

**Expected Output:**
```
🔍 Validating build...
✓ Total prompt count: 45 (expected 45)
✓ No duplicate prompt IDs
✓ All prompts have marketing descriptions
✓ All prompts have H1 titles
✓ JSON structure is valid
✅ Build validation PASSED
```

**Verify:**
- [ ] Build completes without errors
- [ ] All validation checks pass
- [ ] `prompts-data.json` generated

### 4.2 Local Testing

```bash
npm run serve
```

**Test Checklist:**
- [ ] Landing page loads
- [ ] Logo displays correctly
- [ ] All 4 category buttons work
- [ ] All prompts load in each category
- [ ] Copy button works for all prompts
- [ ] Modal opens and closes correctly
- [ ] Colors match brand
- [ ] Viewed prompt tracking works (green checkmarks)
- [ ] Footer displays correctly
- [ ] Responsive on mobile (resize browser)

### 4.3 Generate QR Codes

```bash
npm run qr
```

**Verify:**
- [ ] QR codes generated in `qr-codes/`
- [ ] Main site QR code works (scan with phone)
- [ ] Download package QR code works

**Optional:**
```bash
npm run qr-pdf-example  # If you have example PDF
```

---

## Phase 5: Deployment (Day 5)

### 5.1 Commit Changes

```bash
git add .
git commit -m "feat: customize for Event Name 2025

- Update branding and colors
- Add all event prompts
- Configure build settings

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

**Verify:**
- [ ] All changes committed
- [ ] Pushed to GitHub successfully

### 5.2 Enable GitHub Pages

1. Go to: `https://github.com/yourusername/event-name-2025/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **main** (or **master**)
4. Folder: **/ (root)**
5. Click **Save**

**Verify:**
- [ ] GitHub Pages enabled
- [ ] Wait 2-3 minutes for deployment
- [ ] Visit: `https://yourusername.github.io/event-name-2025/`
- [ ] Site loads correctly

### 5.3 Production Testing

**Full Test on Live Site:**
- [ ] Landing page loads
- [ ] Logo and branding correct
- [ ] All prompts accessible
- [ ] Copy buttons work
- [ ] QR code scans to correct URL
- [ ] Works on mobile device
- [ ] PWA installable (mobile)

---

## Phase 6: Final Prep (1-2 Days Before Event)

### 6.1 Create Materials

- [ ] Print QR code for slides/handouts
- [ ] Test QR code from printed version
- [ ] Create slide with QR code and URL
- [ ] Prepare short URL (optional): bit.ly, tinyurl

### 6.2 Communication

**Prepare Announcement:**
```
Visit: https://yourusername.github.io/event-name-2025/
Or scan the QR code!

Get 45+ AI prompts for:
- Students
- Advisors
- Study Tools
- Wellness

One-click copy to use with ChatGPT, Claude, or any LLM.
```

**Channels:**
- [ ] Event program/agenda
- [ ] Social media posts
- [ ] Email to attendees
- [ ] Presentation slides

### 6.3 Backup Plan

- [ ] Download ZIP of prompts
- [ ] Have USB drive with ZIP (in case internet fails)
- [ ] Print QR code (multiple copies)
- [ ] Screenshot of site (for reference)

---

## Day of Event

### Pre-Session (30 min before)

- [ ] Verify site is live (check on phone)
- [ ] Test QR code one more time
- [ ] Verify presentation slides have QR code
- [ ] Have backup materials ready

### During Session

- [ ] Display QR code on slides
- [ ] Announce URL verbally
- [ ] Demo copying a prompt
- [ ] Encourage immediate testing

### Post-Session

- [ ] Note any issues encountered
- [ ] Gather feedback from attendees
- [ ] Check analytics (if enabled)

---

## Post-Event

### Within 1 Week

- [ ] Update README with event outcome
- [ ] Archive any session-specific content
- [ ] Document lessons learned
- [ ] Update template if improvements found

### Optional Enhancements

- [ ] Add event photos to repo
- [ ] Create follow-up resources
- [ ] Share metrics/feedback
- [ ] Write blog post about deployment

---

## Emergency Procedures

### Site Not Loading

1. Check GitHub Pages status: https://www.githubstatus.com/
2. Verify Pages still enabled in repo settings
3. Check recent commits didn't break anything
4. Fallback: Share ZIP file from USB

### QR Code Not Working

1. Test URL manually in browser
2. Regenerate QR code with higher error correction
3. Fallback: Display URL as text

### Prompts Not Appearing

1. Check browser console (F12) for errors
2. Clear browser cache and reload
3. Check `prompts-data.json` exists and has content
4. Fallback: Have prompts in Google Doc as backup

---

## Checklist Summary

**Before Event:**
- [ ] Repository created and deployed
- [ ] All prompts added and tested
- [ ] Branding customized correctly
- [ ] QR codes generated and tested
- [ ] Site tested on mobile and desktop
- [ ] Materials printed and ready
- [ ] Backup plan in place

**Day of Event:**
- [ ] Site verified working
- [ ] QR code tested
- [ ] Slides ready
- [ ] Backup materials on hand

**After Event:**
- [ ] Document feedback
- [ ] Archive materials
- [ ] Update template if needed

---

## Support Contacts

- **Template Issues:** https://github.com/bcfoltz/prompt-delivery-template/issues
- **GitHub Pages Help:** https://docs.github.com/pages
- **Original Creator:** Brandon Foltz - https://linkedin.com/in/brandonfoltz/

---

## Version History

- **v1.0** - Initial SOP based on SHPE 2025 and NETA 2025 deployments
