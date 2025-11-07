/**
 * Title Extraction Utilities
 * Shared logic for extracting titles from prompt content
 * Used by both build-prompts.js and app.js
 */

/**
 * Extract title from markdown content
 * @param {string} content - Full markdown content
 * @param {string} filename - Filename (fallback for title)
 * @returns {string} Extracted title
 */
function extractTitle(content, filename = '') {
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return filename ? filename.replace('.md', '').replace(/-/g, ' ') : 'Untitled Prompt';
  }

  let firstLine = lines[0];

  // Check if first line is an H1 markdown header
  if (firstLine.trim().startsWith('# ')) {
    return firstLine.trim().substring(2).trim();
  }

  // Pattern matching for specific prompts
  return matchTitlePattern(firstLine, content, filename);
}

/**
 * Match title based on content patterns
 * @param {string} firstLine - First line of content
 * @param {string} content - Full content (for additional context)
 * @param {string} filename - Filename for context
 * @returns {string} Matched title or fallback
 */
function matchTitlePattern(firstLine, content, filename) {
  // Student prompts
  if (firstLine.includes('career counselor') && firstLine.includes('entry-level positions')) {
    return 'Research Entry-Level Skills for Your Field';
  }
  if (firstLine.includes('VIP framework') && firstLine.includes('course')) {
    return filename.includes('advisor')
      ? 'Evaluate Course Value Using VIP Framework (Advisor)'
      : 'Should I Take This Course? (VIP Framework)';
  }
  if (firstLine.includes('teaching assistant') && firstLine.includes('real-world')) {
    return 'Turn Course Concepts Into Practical Projects';
  }
  if (firstLine.includes('memory champion')) {
    return 'Create Memory Aids for Complex Information';
  }
  if (firstLine.includes('educational psychologist') && firstLine.includes('study schedule')) {
    return 'Build an Optimized Study Schedule';
  }
  if (firstLine.includes('apply what I\'m learning') || (firstLine.includes('student studying') && firstLine.includes('resume'))) {
    return 'Translate Coursework to Resume & Interviews';
  }
  if (firstLine.includes('career development coach') && firstLine.includes('skill')) {
    return 'Create a Step-by-Step Skill Development Plan';
  }
  if (firstLine.includes('developing skills') && firstLine.includes('portfolio')) {
    return 'Build a Professional Portfolio';
  }
  if (firstLine.includes('interview me by asking questions') || (firstLine.includes('career advisor') && firstLine.includes('interview'))) {
    return 'Get Personalized Career Skill Recommendations';
  }
  if (firstLine.includes('study guide')) {
    return 'Generate a Study Guide from Course Material';
  }
  if (content.includes('elevator pitch') && content.includes('networking event')) {
    return 'Prepare for a Networking Event';
  }
  if (firstLine.includes('received feedback')) {
    return 'Turn Feedback Into an Action Plan';
  }

  // Advisor prompts
  if (firstLine.includes('career development expert') && firstLine.includes('academic advisors')) {
    return 'Research Job Market & Skills Landscape';
  }
  if ((firstLine.includes('VIP framework') && content.includes('advisor')) ||
      (firstLine.includes('evaluates course value') && content.includes('VIP framework'))) {
    return 'Evaluate Course Value Using VIP Framework (Advisor)';
  }
  if (firstLine.includes('instructional designer') && firstLine.includes('applied learning')) {
    return 'Design Applied Learning Projects for Students';
  }
  if (firstLine.includes('academic advising pedagogy') && firstLine.includes('diverse')) {
    return 'Develop Strategies for Diverse Student Populations';
  }
  if (firstLine.includes('strategic academic planner') && firstLine.includes('four-year')) {
    return 'Create a Strategic Four-Year Roadmap';
  }
  if (firstLine.includes('translate') && firstLine.includes('experience') && firstLine.includes('credentials')) {
    return 'Translate Student Experience Into Professional Credentials';
  }
  if (firstLine.includes('learning pathway designer') && firstLine.includes('skill development')) {
    return 'Design a Skill Development Pathway';
  }
  if (firstLine.includes('helping students') && firstLine.includes('portfolios')) {
    return 'Guide Students in Portfolio Development';
  }
  if (firstLine.includes('upcoming appointment')) {
    return 'Prepare for a Challenging Advising Session';
  }
  if (firstLine.includes('degree audit')) {
    return 'Create Strategic Course Plan from Degree Audit';
  }

  // Fallback: create title from filename or first line
  if (filename) {
    return filename
      .replace('.md', '')
      .replace(/student-prompt-|advisor-prompt-/gi, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  return firstLine.substring(0, 50) + '...';
}

// Export for Node.js (build scripts)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractTitle, matchTitlePattern };
}

// Export for browser (app.js) - use global assignment
if (typeof window !== 'undefined') {
  window.TitleExtractor = { extractTitle, matchTitlePattern };
}
