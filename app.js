// Multi-Prompt QR Delivery Page - Main Application Script
// SHPE 2025 Convention

// Dev mode: Load markdown files directly for easier development
const DEV_MODE = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1' ||
                 window.location.hostname === '';

console.log(`Running in ${DEV_MODE ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);

// Global state
let promptsData = null;
let currentView = 'landing';
let currentPromptId = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Load prompts data
  await loadPromptsData();

  // Set up event listeners
  setupEventListeners();

  // Handle initial route
  handleRoute();

  // Listen for hash changes (back/forward navigation)
  window.addEventListener('hashchange', handleRoute);
});

// Load prompts data from JSON file or markdown files (dev mode)
async function loadPromptsData() {
  // Show loading overlay
  showLoadingOverlay();

  try {
    if (DEV_MODE) {
      await loadPromptsFromMarkdown();
    } else {
      await loadPromptsFromJSON();
    }
    console.log('✓ Loaded prompts:', promptsData.metadata);
  } catch (error) {
    console.error('Error loading prompts data:', error);
    alert('Failed to load prompts. Please refresh the page.');
  } finally {
    // Hide loading overlay
    hideLoadingOverlay();
  }
}

// Load prompts from pre-built JSON (production mode)
async function loadPromptsFromJSON() {
  const response = await fetch('prompts-data.json');
  promptsData = await response.json();
}

// Load prompts directly from markdown files (development mode)
async function loadPromptsFromMarkdown() {
  console.log('📝 Loading prompts dynamically from markdown files...');

  // Load manifest to get filenames (with cache busting)
  const cacheBuster = `?t=${Date.now()}`;
  const manifestResponse = await fetch(`prompts-manifest.json${cacheBuster}`);
  const manifest = await manifestResponse.json();

  // Load student prompts
  const studentPrompts = await Promise.all(
    manifest.student.map(item => loadMarkdownPrompt('student', item))
  );

  // Load advisor prompts
  const advisorPrompts = await Promise.all(
    manifest.advisor.map(item => loadMarkdownPrompt('advisor', item))
  );

  // Load study-guides prompts
  const studyGuidesPrompts = await Promise.all(
    manifest['study-guides'].map(item => loadMarkdownPrompt('study-guides', item))
  );

  // Load student-wellness prompts
  const studentWellnessPrompts = await Promise.all(
    manifest['student-wellness'].map(item => loadMarkdownPrompt('student-wellness', item))
  );

  promptsData = {
    student: studentPrompts,
    advisor: advisorPrompts,
    'study-guides': studyGuidesPrompts,
    'student-wellness': studentWellnessPrompts,
    metadata: {
      totalPrompts: studentPrompts.length + advisorPrompts.length + studyGuidesPrompts.length + studentWellnessPrompts.length,
      studentCount: studentPrompts.length,
      advisorCount: advisorPrompts.length,
      studyGuidesCount: studyGuidesPrompts.length,
      studentWellnessCount: studentWellnessPrompts.length,
      generatedAt: new Date().toISOString(),
      mode: 'development'
    }
  };
}

// Load a single markdown prompt file
async function loadMarkdownPrompt(category, item) {
  const cacheBuster = `?t=${Date.now()}`;
  const path = `prompts/${category}/begin/${item.filename}${cacheBuster}`;
  const response = await fetch(path);
  const content = await response.text();

  // Extract title from content using shared utility
  const title = window.TitleExtractor.extractTitle(content, item.filename);

  return {
    id: item.id,
    filename: item.filename,
    title: title,
    description: item.description || '', // Include description from manifest
    category: category,
    content: content.trim()
  };
}

// Title extraction is now handled by scripts/utils/title-extractor.js
// Loaded as window.TitleExtractor in index.html

// Set up all event listeners
function setupEventListeners() {
  // Landing page buttons
  document.getElementById('btn-students').addEventListener('click', () => {
    navigateTo('#students');
  });

  document.getElementById('btn-advisors').addEventListener('click', () => {
    navigateTo('#advisors');
  });

  document.getElementById('btn-study-guides').addEventListener('click', () => {
    navigateTo('#study-guides');
  });

  document.getElementById('btn-student-wellness').addEventListener('click', () => {
    navigateTo('#student-wellness');
  });

  // Back buttons
  document.getElementById('back-from-students').addEventListener('click', () => {
    navigateTo('#');
  });

  document.getElementById('back-from-advisors').addEventListener('click', () => {
    navigateTo('#');
  });

  document.getElementById('back-from-study-guides').addEventListener('click', () => {
    navigateTo('#');
  });

  document.getElementById('back-from-student-wellness').addEventListener('click', () => {
    navigateTo('#');
  });

  // Modal close button
  document.getElementById('close-modal').addEventListener('click', closeModal);

  // Modal backdrop click
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentView === 'modal') {
      closeModal();
    }
  });

  // Copy button
  document.getElementById('copy-button').addEventListener('click', copyPromptToClipboard);
}

// Navigate to a new route
function navigateTo(hash) {
  window.location.hash = hash;
}

// Handle route changes
function handleRoute() {
  const hash = window.location.hash || '#';

  // Parse the hash
  if (hash === '#' || hash === '') {
    showLandingPage();
  } else if (hash === '#students') {
    showPromptList('student');
  } else if (hash === '#advisors') {
    showPromptList('advisor');
  } else if (hash === '#study-guides') {
    showPromptList('study-guides');
  } else if (hash === '#student-wellness') {
    showPromptList('student-wellness');
  } else if (hash.startsWith('#prompt/')) {
    const promptId = hash.replace('#prompt/', '');
    showPromptModal(promptId);
  } else {
    // Unknown route, redirect to landing
    navigateTo('#');
  }
}

// Show landing page
function showLandingPage() {
  hideAllViews();
  document.getElementById('landing-page').classList.add('active');
  currentView = 'landing';
  document.body.classList.remove('modal-open');

  // Scroll to top for better mobile UX
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show prompt list for a category
function showPromptList(category) {
  if (!promptsData) return;

  // Remember previous view to determine if we should scroll
  const previousView = currentView;

  hideAllViews();
  currentView = category;

  if (category === 'student') {
    document.getElementById('student-list-view').classList.add('active');
    renderPromptList('student', promptsData.student);
  } else if (category === 'advisor') {
    document.getElementById('advisor-list-view').classList.add('active');
    renderPromptList('advisor', promptsData.advisor);
  } else if (category === 'study-guides') {
    document.getElementById('study-guides-list-view').classList.add('active');
    renderPromptList('study-guides', promptsData['study-guides']);
  } else if (category === 'student-wellness') {
    document.getElementById('student-wellness-list-view').classList.add('active');
    renderPromptList('student-wellness', promptsData['student-wellness']);
  }

  document.body.classList.remove('modal-open');

  // Only scroll to top if we're coming from landing page, not from closing a modal
  // This preserves scroll position when returning from viewing a prompt
  if (previousView !== 'modal') {
    // Scroll to show the list header (with category title and back button) at the top
    setTimeout(() => {
      const listViewId = category === 'student' ? 'student-list-view'
                       : category === 'advisor' ? 'advisor-list-view'
                       : category === 'study-guides' ? 'study-guides-list-view'
                       : 'student-wellness-list-view';
      const listView = document.getElementById(listViewId);

      if (listView) {
        // Scroll the entire list view into view so the header shows at top
        listView.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }
}

// Render prompt list items
function renderPromptList(category, prompts) {
  const containerId = category === 'student' ? 'student-prompts-container'
                    : category === 'advisor' ? 'advisor-prompts-container'
                    : category === 'study-guides' ? 'study-guides-prompts-container'
                    : 'student-wellness-prompts-container';
  const container = document.getElementById(containerId);

  // Clear existing content
  container.innerHTML = '';

  // Get viewed prompts from localStorage
  const viewedPrompts = getViewedPrompts();

  // Create prompt cards
  prompts.forEach((prompt) => {
    const card = document.createElement('button');
    const isViewed = viewedPrompts.includes(prompt.id);
    card.className = `prompt-card${isViewed ? ' viewed' : ''}`;
    card.setAttribute('aria-label', `View prompt: ${prompt.title}`);
    card.innerHTML = `
      <div class="prompt-card-content">
        <h3 class="prompt-card-title">${escapeHtml(prompt.title)}</h3>
        ${prompt.description ? `<p class="prompt-card-description">${escapeHtml(prompt.description)}</p>` : ''}
      </div>
      <span class="prompt-card-arrow">→</span>
      ${isViewed ? '<span class="viewed-indicator" aria-label="Viewed">✓</span>' : ''}
    `;

    // Add click listener
    card.addEventListener('click', () => {
      navigateTo(`#prompt/${prompt.id}`);
    });

    container.appendChild(card);
  });
}

// Show prompt modal
function showPromptModal(promptId) {
  if (!promptsData) return;

  // Find the prompt
  const allPrompts = [...promptsData.student, ...promptsData.advisor, ...promptsData['study-guides'], ...promptsData['student-wellness']];
  const prompt = allPrompts.find(p => p.id === promptId);

  if (!prompt) {
    console.error('Prompt not found:', promptId);
    navigateTo('#');
    return;
  }

  currentPromptId = promptId;
  currentView = 'modal';

  // Mark prompt as viewed
  markPromptAsViewed(promptId);

  // Update modal content
  document.getElementById('modal-title').textContent = prompt.title;
  document.getElementById('modal-prompt-content').innerHTML = formatPromptContent(prompt.content);

  // Reset copy button state
  resetCopyButton();

  // Add category class to modal for themed styling
  const modal = document.getElementById('prompt-modal');
  const category = promptId.startsWith('student-wellness-') ? 'student-wellness-theme'
                 : promptId.startsWith('student-') ? 'student-theme'
                 : promptId.startsWith('advisor-') ? 'advisor-theme'
                 : promptId.startsWith('study-guide-') ? 'study-guides-theme'
                 : 'student-wellness-theme';
  modal.classList.remove('student-theme', 'advisor-theme', 'study-guides-theme', 'student-wellness-theme');
  modal.classList.add(category);

  // Show modal
  modal.classList.add('active');
  document.body.classList.add('modal-open');

  // Reset modal scroll position to top (use requestAnimationFrame to ensure DOM is updated)
  requestAnimationFrame(() => {
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  });

  // Focus on modal for accessibility
  document.getElementById('prompt-modal').focus();
}

// Close modal
function closeModal() {
  document.getElementById('prompt-modal').classList.remove('active');
  document.body.classList.remove('modal-open');

  // Navigate back to the appropriate list
  if (currentPromptId) {
    const category = currentPromptId.startsWith('student-wellness-') ? 'student-wellness'
                   : currentPromptId.startsWith('student-') ? 'students'
                   : currentPromptId.startsWith('advisor-') ? 'advisors'
                   : currentPromptId.startsWith('study-guide-') ? 'study-guides'
                   : 'student-wellness';
    navigateTo(`#${category}`);
  } else {
    navigateTo('#');
  }
}

// Format prompt content (preserve line breaks and basic formatting)
function formatPromptContent(content) {
  const lines = content.split('\n');
  const output = [];
  let currentParagraph = [];
  let currentList = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let skipFirstHeader = false;

  let currentOrderedList = [];
  let listType = null; // 'ul' or 'ol'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip the first H1 header (we already show it as the modal title)
    if (i === 0 && trimmedLine.startsWith('# ')) {
      skipFirstHeader = true;
      continue;
    }

    // Handle H2 headers
    if (trimmedLine.startsWith('## ')) {
      // Flush any pending content
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        output.push(`<ul>${currentList.join('')}</ul>`);
        currentList = [];
      }
      if (currentOrderedList.length > 0) {
        output.push(`<ol>${currentOrderedList.join('')}</ol>`);
        currentOrderedList = [];
      }
      listType = null;
      output.push(`<h2>${escapeHtml(trimmedLine.substring(3))}</h2>`);
      continue;
    }

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      // Flush any pending content
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        output.push(`<ul>${currentList.join('')}</ul>`);
        currentList = [];
      }
      if (currentOrderedList.length > 0) {
        output.push(`<ol>${currentOrderedList.join('')}</ol>`);
        currentOrderedList = [];
      }
      listType = null;

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        // End of code block
        output.push(`<pre><code>${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeBlockContent = [];
      }
      continue;
    }

    // Inside code block
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Empty line - flush current paragraph or list
    if (trimmedLine === '') {
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        output.push(`<ul>${currentList.join('')}</ul>`);
        currentList = [];
      }
      if (currentOrderedList.length > 0) {
        output.push(`<ol>${currentOrderedList.join('')}</ol>`);
        currentOrderedList = [];
      }
      listType = null;
      continue;
    }

    // Bullet list item (unordered)
    if (trimmedLine.startsWith('- ')) {
      // Flush paragraph if any
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      // If we were in an ordered list, flush it
      if (currentOrderedList.length > 0) {
        output.push(`<ol>${currentOrderedList.join('')}</ol>`);
        currentOrderedList = [];
      }
      // Add to current unordered list
      listType = 'ul';
      currentList.push(`<li>${escapeHtml(trimmedLine.substring(2))}</li>`);
      continue;
    }

    // Numbered list item (ordered)
    const orderedListMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (orderedListMatch) {
      // Flush paragraph if any
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      // If we were in an unordered list, flush it
      if (currentList.length > 0) {
        output.push(`<ul>${currentList.join('')}</ul>`);
        currentList = [];
      }
      // Add to current ordered list
      listType = 'ol';
      currentOrderedList.push(`<li>${escapeHtml(orderedListMatch[2])}</li>`);
      continue;
    }

    // Regular text line
    // If we have lists, flush them first
    if (currentList.length > 0) {
      output.push(`<ul>${currentList.join('')}</ul>`);
      currentList = [];
      listType = null;
    }
    if (currentOrderedList.length > 0) {
      output.push(`<ol>${currentOrderedList.join('')}</ol>`);
      currentOrderedList = [];
      listType = null;
    }

    // Check if this is a short form field line (ends with : and is short)
    // These should be on their own line, not joined with other text
    if (trimmedLine.endsWith(':') && trimmedLine.length < 100) {
      // Flush current paragraph first
      if (currentParagraph.length > 0) {
        output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
      // Output this line as its own paragraph
      output.push(`<p>${escapeHtml(trimmedLine)}</p>`);
      continue;
    }

    // Add to current paragraph
    currentParagraph.push(trimmedLine);
  }

  // Flush any remaining content
  if (currentParagraph.length > 0) {
    output.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
  }
  if (currentList.length > 0) {
    output.push(`<ul>${currentList.join('')}</ul>`);
  }
  if (currentOrderedList.length > 0) {
    output.push(`<ol>${currentOrderedList.join('')}</ol>`);
  }

  return output.join('');
}

// Copy prompt to clipboard
async function copyPromptToClipboard() {
  if (!currentPromptId) return;

  // Find the current prompt
  const allPrompts = [...promptsData.student, ...promptsData.advisor, ...promptsData['study-guides'], ...promptsData['student-wellness']];
  const prompt = allPrompts.find(p => p.id === currentPromptId);

  if (!prompt) return;

  const copyButton = document.getElementById('copy-button');
  const copyMessage = document.getElementById('copy-message');

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(prompt.content);
      showCopySuccess(copyButton, copyMessage);
    } else {
      // Fallback for older browsers
      copyTextFallback(prompt.content);
      showCopySuccess(copyButton, copyMessage);
    }
  } catch (error) {
    console.error('Copy failed:', error);
    showCopyError(copyButton, copyMessage);
  }
}

// Fallback clipboard method for older browsers
function copyTextFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

// Show copy success state
function showCopySuccess(button, message) {
  button.textContent = 'Copied!';
  button.classList.add('success');

  message.textContent = 'Paste this into ChatGPT, Claude, Gemini, or your preferred LLM';
  message.classList.add('visible');

  // Reset after 5 seconds
  setTimeout(() => {
    resetCopyButton();
  }, 5000);
}

// Show copy error state
function showCopyError(button, message) {
  message.textContent = 'Copy failed. Please try selecting and copying the text manually.';
  message.classList.add('visible', 'error');

  // Reset after 5 seconds
  setTimeout(() => {
    resetCopyButton();
  }, 5000);
}

// Reset copy button to initial state
function resetCopyButton() {
  const button = document.getElementById('copy-button');
  const message = document.getElementById('copy-message');

  button.textContent = 'Copy Prompt';
  button.classList.remove('success');

  message.textContent = '';
  message.classList.remove('visible', 'error');
}

// Hide all views
function hideAllViews() {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById('prompt-modal').classList.remove('active');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ================================
// Loading Overlay
// ================================

function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('visible');
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

// ================================
// Viewed Prompts Tracking
// ================================

const VIEWED_PROMPTS_KEY = 'shpe-2025-viewed-prompts';

// Get list of viewed prompt IDs from localStorage
function getViewedPrompts() {
  try {
    const viewed = localStorage.getItem(VIEWED_PROMPTS_KEY);
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    console.error('Error reading viewed prompts:', error);
    return [];
  }
}

// Mark a prompt as viewed
function markPromptAsViewed(promptId) {
  try {
    const viewed = getViewedPrompts();
    if (!viewed.includes(promptId)) {
      viewed.push(promptId);
      localStorage.setItem(VIEWED_PROMPTS_KEY, JSON.stringify(viewed));
    }
  } catch (error) {
    console.error('Error saving viewed prompt:', error);
  }
}

// Log initialization
console.log('SHPE 2025 - Multi-Prompt QR Delivery Page initialized');
