# Prompt Delivery Template

A production-ready template for creating QR-code based prompt delivery websites for conferences and events.

## Features

- 📱 Progressive Web App (PWA) - works offline
- 🎨 Customizable branding and colors
- 📋 One-click copy-to-clipboard
- ✅ Viewed prompt tracking
- 📦 Downloadable prompt packages
- 🔗 QR code generation
- 🔄 Build validation system
- 📝 4 prompt categories (customizable)

## Quick Start (30 Minutes)

1. **Clone this template**
   ```bash
   git clone https://github.com/bcfoltz/prompt-delivery-template.git my-event
   cd my-event
   ```

2. **Add your prompts**
   - Place markdown files in `prompts/student/begin/`, `prompts/advisor/begin/`, etc.
   - Follow naming: `category-prompt-01.md`, `category-prompt-02.md`
   - Start each file with `# Your Title`

3. **Update branding**
   - Edit `branding-config.json` with your event details
   - Replace logo file with your logo

4. **Build and test**
   ```bash
   npm install
   npm run build
   npm run serve
   ```

5. **Deploy to GitHub Pages**
   - Push to GitHub
   - Enable Pages in Settings → Pages → Source: main branch

## Documentation

- **QUICK-START.md** - Detailed 30-minute setup guide
- **CUSTOMIZATION.md** - Branding, colors, categories
- **docs-dev/** - Technical documentation and guides

## Structure

```
prompts/                 # Your prompt markdown files
scripts/
  build/                # Build scripts
  generators/           # QR code generators
  utils/                # Shared utilities
branding-config.json    # Event branding settings
template-config.json    # Category and validation config
```

## Based On

Successful deployments at SHPE 2025 and NETA 2025 conferences.

## Support

Created by [Brandon Foltz](https://www.linkedin.com/in/brandonfoltz/)

For questions or issues, see the documentation in `docs-dev/`.
