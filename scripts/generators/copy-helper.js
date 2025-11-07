const fs = require('fs');
const path = require('path');

// Project root directory (parent of scripts/)
const PROJECT_ROOT = path.join(__dirname, '..');

// Read all prompt files from a directory
function readPromptFiles(directory, category) {
  const dirPath = path.join(PROJECT_ROOT, directory);
  const files = fs.readdirSync(dirPath);

  const prompts = [];

  files.forEach(file => {
    // Skip result files
    if (file.endsWith('-result.md')) {
      return;
    }

    if (file.endsWith('.md')) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract a title from the content
      const title = extractTitle(content);

      // Extract description (first paragraph after title)
      const description = extractDescription(content);

      // Create prompt object
      const promptId = file.replace('.md', '');
      prompts.push({
        id: promptId,
        filename: file,
        title: title,
        description: description,
        category: category,
        content: content.trim()
      });
    }
  });

  // Sort by filename to maintain order
  prompts.sort((a, b) => a.filename.localeCompare(b.filename));

  return prompts;
}

// Extract description (first paragraph after title) from prompt content
function extractDescription(content) {
  const lines = content.split('\n');
  let foundTitle = false;
  let description = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip until we find the H1 title
    if (!foundTitle) {
      if (line.startsWith('# ')) {
        foundTitle = true;
      }
      continue;
    }

    // Skip empty lines after title
    if (!line) {
      continue;
    }

    // Found the first non-empty line after title
    // This is the description
    description = line;
    break;
  }

  return description;
}

// Extract title from H1 header
function extractTitle(content) {
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return 'Untitled Prompt';
  }

  const firstLine = lines[0].trim();

  // Check if first line is an H1 markdown header
  if (firstLine.startsWith('# ')) {
    return firstLine.substring(2).trim();
  }

  return 'Untitled Prompt';
}

// Escape HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Remove description line from content to avoid duplication
function removeDescriptionFromContent(content, description) {
  const lines = content.split('\n');

  // Remove H1 title if present
  if (lines[0] && lines[0].trim().startsWith('# ')) {
    lines.shift();
  }

  // Remove empty line after title
  if (lines[0] && !lines[0].trim()) {
    lines.shift();
  }

  // Remove description line if it matches
  if (lines[0] && lines[0].trim() === description.trim()) {
    lines.shift();
    // Remove empty line after description
    if (lines[0] && !lines[0].trim()) {
      lines.shift();
    }
  }

  return lines.join('\n').trim();
}

// Generate HTML for copy-helper page
function generateCopyHelperHTML(studentPrompts, advisorPrompts) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SHPE 2025 Prompt Guide - Copy Helper</title>
  <meta name="description" content="Easy copy-paste access to all 25 AI-powered academic prompts from SHPE 2025">
  <style>
    :root {
      --shpe-orange: #D44500;
      --shpe-navy: #003DA5;
      --light-gray: #F5F5F5;
      --border-color: #E0E0E0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #FFFFFF;
      padding-bottom: 3rem;
      padding-top: 60px; /* Space for sticky nav */
    }

    header {
      background: linear-gradient(135deg, var(--shpe-navy) 0%, var(--shpe-orange) 100%);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    header p {
      font-size: 1.1rem;
      opacity: 0.95;
    }

    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .intro {
      background: var(--light-gray);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid var(--shpe-orange);
    }

    .intro h2 {
      color: var(--shpe-navy);
      margin-bottom: 0.75rem;
      font-size: 1.3rem;
    }

    .intro p {
      margin-bottom: 0.5rem;
    }

    .intro a {
      color: var(--shpe-orange);
      text-decoration: none;
      font-weight: 600;
    }

    .intro a:hover {
      text-decoration: underline;
    }

    /* Sticky Navigation Bar */
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 3px solid var(--shpe-orange);
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .nav-button {
      background: var(--shpe-orange);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .nav-button:hover {
      background: #B83A00;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(212, 69, 0, 0.3);
    }

    .nav-button.secondary {
      background: var(--shpe-navy);
    }

    .nav-button.secondary:hover {
      background: #002580;
    }

    /* Back to Top Button */
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--shpe-orange);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      z-index: 999;
    }

    .back-to-top:hover {
      background: #B83A00;
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    }

    .back-to-top.visible {
      display: flex;
    }

    .section-header {
      background: var(--shpe-navy);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin: 2rem 0 1rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .section-count {
      color: var(--shpe-orange);
      font-weight: 400;
      font-size: 1.2rem;
    }

    .prompt-card {
      border: 2px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }

    .prompt-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .prompt-header {
      background: var(--light-gray);
      padding: 1rem 1.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      border-bottom: 2px solid var(--border-color);
    }

    .prompt-header:hover {
      background: #E8E8E8;
    }

    .prompt-title {
      font-weight: 600;
      color: var(--shpe-navy);
      font-size: 1.1rem;
      flex: 1;
    }

    .prompt-number {
      color: var(--shpe-orange);
      font-weight: 700;
      margin-right: 0.75rem;
      font-size: 1.1rem;
    }

    .expand-icon {
      color: var(--shpe-orange);
      font-size: 1.5rem;
      transition: transform 0.3s ease;
      margin-left: 1rem;
    }

    .prompt-card.expanded .expand-icon {
      transform: rotate(180deg);
    }

    .prompt-description {
      padding: 0 1.5rem;
      padding-top: 0.75rem;
      color: #666;
      font-style: italic;
      display: none;
    }

    .prompt-card.expanded .prompt-description {
      display: block;
    }

    .prompt-content {
      padding: 1.5rem;
      background: white;
      display: none;
    }

    .prompt-card.expanded .prompt-content {
      display: block;
    }

    .prompt-text {
      background: var(--light-gray);
      padding: 1rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      margin-bottom: 1rem;
    }

    .copy-button {
      background: var(--shpe-orange);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .copy-button:hover {
      background: #B83A00;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(212, 69, 0, 0.3);
    }

    .copy-button:active {
      transform: translateY(0);
    }

    .copy-button.copied {
      background: #28A745;
    }

    .copy-icon::before {
      content: "📋";
      font-size: 1.2rem;
    }

    .copy-button.copied .copy-icon::before {
      content: "✓";
    }

    footer {
      text-align: center;
      padding: 2rem 1rem;
      margin-top: 3rem;
      background: var(--light-gray);
      border-top: 3px solid var(--shpe-orange);
    }

    footer p {
      margin-bottom: 0.5rem;
      color: #666;
    }

    footer a {
      color: var(--shpe-navy);
      text-decoration: none;
      font-weight: 600;
    }

    footer a:hover {
      color: var(--shpe-orange);
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 1.5rem;
      }

      header p {
        font-size: 1rem;
      }

      .section-header {
        font-size: 1.3rem;
        padding: 0.75rem 1rem;
      }

      .prompt-header {
        padding: 0.75rem 1rem;
      }

      .prompt-title {
        font-size: 1rem;
      }

      .prompt-content {
        padding: 1rem;
      }

      .prompt-text {
        font-size: 0.85rem;
        max-height: 300px;
      }
    }
  </style>
</head>
<body>
  <!-- Sticky Navigation Bar -->
  <nav class="nav-bar">
    <a href="#top" class="nav-button secondary">🏠 Top</a>
    <a href="#students" class="nav-button">📚 Students (15)</a>
    <a href="#advisors" class="nav-button">👨‍🏫 Advisors (10)</a>
  </nav>

  <!-- Back to Top Button -->
  <button class="back-to-top" id="backToTop" onclick="scrollToTop()">↑</button>

  <div id="top"></div>

  <header>
    <h1>🎓 SHPE 2025 Prompt Guide</h1>
    <p>Copy-Helper Page - Easy Access to All Prompts</p>
  </header>

  <div class="container">
    <div class="intro">
      <h2>How to Use This Page</h2>
      <p><strong>1.</strong> Click on any prompt title below to expand it</p>
      <p><strong>2.</strong> Review the prompt text in the gray box</p>
      <p><strong>3.</strong> Click the orange "Copy to Clipboard" button</p>
      <p><strong>4.</strong> Paste into your AI assistant (Claude, ChatGPT, etc.)</p>
      <p style="margin-top: 1rem;">
        Want the full PDF guide?
        <a href="index.html">← Back to Main Site</a>
      </p>
    </div>

    <!-- Student Prompts Section -->
    <div id="students" class="section-header">
      📚 Student Prompts <span class="section-count">(${studentPrompts.length} prompts)</span>
    </div>

${studentPrompts.map((prompt, index) => `
    <div class="prompt-card" data-prompt-id="${prompt.id}">
      <div class="prompt-header" onclick="togglePrompt('${prompt.id}')">
        <div style="display: flex; align-items: center; flex: 1;">
          <span class="prompt-number">${index + 1}.</span>
          <span class="prompt-title">${escapeHtml(prompt.title)}</span>
        </div>
        <span class="expand-icon">▼</span>
      </div>
      <div class="prompt-description">${escapeHtml(prompt.description)}</div>
      <div class="prompt-content">
        <div class="prompt-text">${escapeHtml(prompt.content)}</div>
        <button class="copy-button" onclick="copyPrompt('${prompt.id}', this)">
          <span class="copy-icon"></span>
          <span class="copy-text">Copy to Clipboard</span>
        </button>
      </div>
    </div>
`).join('')}

    <!-- Advisor Prompts Section -->
    <div id="advisors" class="section-header">
      👨‍🏫 Advisor Prompts <span class="section-count">(${advisorPrompts.length} prompts)</span>
    </div>

${advisorPrompts.map((prompt, index) => `
    <div class="prompt-card" data-prompt-id="${prompt.id}">
      <div class="prompt-header" onclick="togglePrompt('${prompt.id}')">
        <div style="display: flex; align-items: center; flex: 1;">
          <span class="prompt-number">${index + 1}.</span>
          <span class="prompt-title">${escapeHtml(prompt.title)}</span>
        </div>
        <span class="expand-icon">▼</span>
      </div>
      <div class="prompt-description">${escapeHtml(prompt.description)}</div>
      <div class="prompt-content">
        <div class="prompt-text">${escapeHtml(prompt.content)}</div>
        <button class="copy-button" onclick="copyPrompt('${prompt.id}', this)">
          <span class="copy-icon"></span>
          <span class="copy-text">Copy to Clipboard</span>
        </button>
      </div>
    </div>
`).join('')}

  </div>

  <footer>
    <p><strong>SHPE 2025 Convention</strong> | Anaheim, California</p>
    <p>Created by <a href="https://linkedin.com/in/bcfoltz" target="_blank">Brandon Foltz</a></p>
    <p><a href="index.html">← Back to Interactive Prompt Selector</a></p>
  </footer>

  <script>
    // Store prompt content for copying
    const promptContent = {
${studentPrompts.map(p => `      '${p.id}': ${JSON.stringify(p.content)}`).join(',\n')}${advisorPrompts.length > 0 ? ',' : ''}
${advisorPrompts.map(p => `      '${p.id}': ${JSON.stringify(p.content)}`).join(',\n')}
    };

    // Toggle prompt expansion
    function togglePrompt(promptId) {
      const card = document.querySelector(\`[data-prompt-id="\${promptId}"]\`);
      card.classList.toggle('expanded');
    }

    // Copy prompt to clipboard
    async function copyPrompt(promptId, button) {
      const content = promptContent[promptId];

      try {
        await navigator.clipboard.writeText(content);

        // Update button to show success
        const textSpan = button.querySelector('.copy-text');
        const originalText = textSpan.textContent;

        button.classList.add('copied');
        textSpan.textContent = 'Copied!';

        // Reset after 2 seconds
        setTimeout(() => {
          button.classList.remove('copied');
          textSpan.textContent = originalText;
        }, 2000);

      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try selecting and copying manually.');
      }
    }

    // Collapse all prompts by default on mobile
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.prompt-card').forEach(card => {
        card.classList.remove('expanded');
      });
    }

    // Back to top button functionality
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
      const backToTopButton = document.getElementById('backToTop');
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 70; // Account for sticky nav
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  </script>
</body>
</html>`;
}

// Main execution
console.log('Generating copy-helper page...\n');

try {
  // Read prompts
  const studentPrompts = readPromptFiles('prompts/student/begin', 'student');
  const advisorPrompts = readPromptFiles('prompts/advisor/begin', 'advisor');

  console.log(`✓ Found ${studentPrompts.length} student prompts`);
  console.log(`✓ Found ${advisorPrompts.length} advisor prompts`);
  console.log(`✓ Total: ${studentPrompts.length + advisorPrompts.length} prompts\n`);

  // Generate HTML
  const html = generateCopyHelperHTML(studentPrompts, advisorPrompts);

  // Write HTML file
  const outputPath = path.join(PROJECT_ROOT, 'prompt-guide.html');
  fs.writeFileSync(outputPath, html);

  console.log(`✓ Copy-helper page generated: ${outputPath}`);
  console.log(`📄 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  console.log(`\n✓ Preview at: file:///${outputPath.replace(/\\/g, '/')}`);
  console.log(`✓ Or run: npm run serve`);

} catch (error) {
  console.error('\n✗ Error generating copy-helper page:', error.message);
  process.exit(1);
}
