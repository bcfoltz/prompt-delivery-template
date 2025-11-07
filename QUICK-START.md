# Quick Start Guide (30 Minutes)

Get your prompt delivery site up and running in 30 minutes.

## Prerequisites

- Node.js installed
- Git installed
- GitHub account
- Your prompts ready in markdown format

## Step 1: Clone and Setup (5 min)

```bash
git clone https://github.com/bcfoltz/prompt-delivery-template.git my-event-2025
cd my-event-2025
npm install
```

## Step 2: Add Your Prompts (10 min)

1. **Create prompt files** in the appropriate directories:
   - `prompts/student/begin/` - For student prompts
   - `prompts/advisor/begin/` - For advisor prompts
   - `prompts/study-guides/begin/` - For study tool prompts
   - `prompts/student-wellness/` - For wellness prompts

2. **File naming convention:**
   - Use format: `category-prompt-01.md`, `category-prompt-02.md`, etc.
   - Zero-pad numbers: 01, 02, 03, ..., 10, 11, etc.

3. **Prompt format:**
   ```markdown
   # Your Prompt Title
   
   Your prompt content here.
   
   Use {variables} for template placeholders like {field} or {topic}.
   ```

## Step 3: Update Branding (5 min)

Edit `branding-config.json`:

```json
{
  "event": {
    "name": "My Conference 2025",
    "shortName": "MyConf 2025",
    "location": "Chicago, IL",
    "dates": "June 15-17, 2025",
    "url": "https://myconference.com/"
  },
  "branding": {
    "logo": "my-logo.png",
    "logoAlt": "My Conference 2025",
    "favicon": "my-logo.png"
  },
  "site": {
    "title": "MyConf 2025 - AI Prompts",
    "heading": "AI-Powered Prompts",
    "subtitle": "Choose the prompts designed for you"
  },
  "footer": {
    "authorName": "Your Name",
    "authorLinkedIn": "https://www.linkedin.com/in/yourprofile/"
  }
}
```

Replace `my-logo.png` with your actual logo file.

## Step 4: Build and Test (5 min)

```bash
npm run build
npm run serve
```

Your site will open at http://localhost:8080

Check:
- ✅ All prompts load correctly
- ✅ Copy buttons work
- ✅ Branding displays correctly
- ✅ Colors match your event

## Step 5: Deploy to GitHub Pages (5 min)

1. **Create GitHub repository:**
   - Go to github.com and create new repo
   - Name it: `my-event-2025`

2. **Push your code:**
   ```bash
   git remote remove origin  # Remove template origin
   git remote add origin https://github.com/yourusername/my-event-2025.git
   git add .
   git commit -m "Initial commit: My Event 2025"
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Click Save

4. **Wait 2-3 minutes**, then visit:
   `https://yourusername.github.io/my-event-2025/`

## Step 6: Generate QR Codes (Optional)

```bash
npm run qr
```

QR codes will be in `qr-codes/` directory.

## Done!

Your site is live. Share the URL or QR code with your audience.

## Need Help?

- See `CUSTOMIZATION.md` for advanced options
- See `docs-dev/` for technical documentation
- Check `docs-dev/CRITICAL-BRANDING-BUG.md` if content doesn't update
