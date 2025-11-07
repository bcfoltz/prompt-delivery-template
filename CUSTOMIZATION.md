# Customization Guide

Complete guide to customizing your prompt delivery site.

## Branding Customization

### 1. Event Information

Edit `branding-config.json`:

```json
{
  "event": {
    "name": "TechConf 2025",
    "shortName": "TechConf",
    "location": "Austin, TX",
    "dates": "March 15-17, 2025",
    "url": "https://techconf.com/"
  }
}
```

### 2. Logo and Branding

```json
{
  "branding": {
    "logo": "my-logo.png",
    "logoAlt": "TechConf 2025",
    "favicon": "my-logo.png"
  }
}
```

**Logo Tips:**
- Recommended size: 200-400px wide
- Formats: PNG, WebP, or SVG
- Keep file size under 100KB

### 3. Color Scheme

```json
{
  "colors": {
    "primary": "#FF6A13",
    "primaryHover": "#E55A0E",
    "secondary": "#002D56",
    "secondaryHover": "#001A33",
    "themeColor": "#D44500"
  }
}
```

### 4. Site Text

```json
{
  "site": {
    "title": "TechConf 2025 - AI Prompts",
    "description": "AI Prompts for TechConf",
    "heading": "AI-Powered Prompts",
    "subtitle": "Choose your category"
  }
}
```

## Category Customization

### Default Categories

1. **Student** - Orange (#FF6A13)
2. **Advisor** - Blue (#0066CC)
3. **Study Tools** - Purple (#8B5CF6)
4. **Student Wellness** - Green (#10B981)

### Adding a New Category

See `docs-dev/ADDING-NEW-CATEGORIES.md` for detailed instructions.

## Prompt Customization

### Prompt Format

```markdown
# Your Prompt Title

Your content here.

Use {variables} for placeholders.
```

### Naming Convention

- Format: `category-prompt-01.md`
- Zero-padded numbers (01, 02, not 1, 2)
- Numbers determine display order

### Marketing Descriptions

Add to `prompt-descriptions.json`:

```json
{
  "student-prompt-01": "Short tagline under 80 characters"
}
```

## Build Configuration

Edit `template-config.json`:

```json
{
  "build": {
    "expectedTotalPrompts": 20,
    "validateDuplicateIds": true,
    "validateMarketingDescriptions": true
  }
}
```

## Troubleshooting

### Content Not Updating

1. Check `branding-config.json` - it overrides HTML
2. Update BOTH `index.html` AND `branding-config.json`
3. See `docs-dev/CRITICAL-BRANDING-BUG.md`

### Build Fails

- All prompts need `# Title` as first line
- No duplicate file numbers
- All prompts in `prompt-descriptions.json`

## More Help

- **Branding:** `docs-dev/CRITICAL-BRANDING-BUG.md`
- **Categories:** `docs-dev/ADDING-NEW-CATEGORIES.md`
- **Renumbering:** `docs-dev/PROMPT-ORDERING-GUIDE.md`
