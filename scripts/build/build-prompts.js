const fs = require('fs');
const path = require('path');
const { extractTitle } = require('../utils/title-extractor');

// Project root directory (now parent of scripts/build/)
const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Load marketing descriptions
const descriptionsPath = path.join(PROJECT_ROOT, 'prompt-descriptions.json');
const MARKETING_DESCRIPTIONS = JSON.parse(fs.readFileSync(descriptionsPath, 'utf-8'));

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
      const title = extractTitle(content, file);

      // Get marketing description from JSON file
      const promptId = file.replace('.md', '');
      const description = MARKETING_DESCRIPTIONS[promptId] || extractDescription(content);

      // Create prompt object
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

// Title extraction is now handled by utils/title-extractor.js

// Main execution
console.log('Building prompts data...\n');

const manifestPath = path.join(PROJECT_ROOT, 'prompts-manifest.json');

const studentPrompts = readPromptFiles('prompts/student/begin', 'student');
const advisorPrompts = readPromptFiles('prompts/advisor/begin', 'advisor');
const studyGuidesPrompts = readPromptFiles('prompts/study-guides/begin', 'study-guides');
const studentWellnessPrompts = readPromptFiles('prompts/student-wellness/begin', 'student-wellness');

const allPrompts = {
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
    generatedAt: new Date().toISOString()
  }
};

// ============================================
// Build Validation
// ============================================

console.log('\n🔍 Validating build...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Validate expected total prompt count
const EXPECTED_TOTAL = 66;
if (allPrompts.metadata.totalPrompts !== EXPECTED_TOTAL) {
  console.error(`❌ ERROR: Expected ${EXPECTED_TOTAL} prompts, found ${allPrompts.metadata.totalPrompts}`);
  hasErrors = true;
} else {
  console.log(`✓ Total prompt count: ${allPrompts.metadata.totalPrompts} (expected ${EXPECTED_TOTAL})`);
}

// 2. Check for duplicate prompt IDs
const allPromptsList = [...studentPrompts, ...advisorPrompts, ...studyGuidesPrompts, ...studentWellnessPrompts];
const ids = allPromptsList.map(p => p.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length > 0) {
  console.error(`❌ ERROR: Duplicate prompt IDs found: ${[...new Set(duplicates)].join(', ')}`);
  hasErrors = true;
} else {
  console.log(`✓ No duplicate prompt IDs`);
}

// 3. Validate marketing descriptions exist for all prompts
const promptsWithoutDescriptions = allPromptsList.filter(p => !p.description || p.description.trim() === '');
if (promptsWithoutDescriptions.length > 0) {
  console.warn(`⚠️  WARNING: ${promptsWithoutDescriptions.length} prompts missing marketing descriptions:`);
  promptsWithoutDescriptions.forEach(p => {
    console.warn(`   - ${p.id} (${p.filename})`);
  });
  hasWarnings = true;
} else {
  console.log(`✓ All prompts have marketing descriptions`);
}

// 4. Check for prompts missing H1 titles
const promptsWithoutH1 = allPromptsList.filter(p => {
  return !p.content.trim().startsWith('# ');
});
if (promptsWithoutH1.length > 0) {
  console.warn(`⚠️  WARNING: ${promptsWithoutH1.length} prompts missing H1 title (# ):`);
  promptsWithoutH1.forEach(p => {
    console.warn(`   - ${p.id} (${p.filename})`);
  });
  hasWarnings = true;
} else {
  console.log(`✓ All prompts have H1 titles`);
}

// 5. Validate JSON structure
try {
  JSON.stringify(allPrompts);
  console.log(`✓ JSON structure is valid`);
} catch (error) {
  console.error(`❌ ERROR: Invalid JSON structure: ${error.message}`);
  hasErrors = true;
}

// Exit if errors found
if (hasErrors) {
  console.error('\n❌ Build validation FAILED. Fix errors above and try again.\n');
  process.exit(1);
}

if (hasWarnings) {
  console.warn('\n⚠️  Build validation passed with warnings (see above)\n');
} else {
  console.log('\n✅ Build validation passed!\n');
}

// Output main JSON file
const outputPath = path.join(PROJECT_ROOT, 'prompts-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allPrompts, null, 2));

// Output manifest file for dev mode (filenames and descriptions)
const manifest = {
  student: studentPrompts.map(p => {
    const item = { id: p.id, filename: p.filename };
    if (p.description) item.description = p.description;
    return item;
  }),
  advisor: advisorPrompts.map(p => {
    const item = { id: p.id, filename: p.filename };
    if (p.description) item.description = p.description;
    return item;
  }),
  'study-guides': studyGuidesPrompts.map(p => {
    const item = { id: p.id, filename: p.filename };
    if (p.description) item.description = p.description;
    return item;
  }),
  'student-wellness': studentWellnessPrompts.map(p => {
    const item = { id: p.id, filename: p.filename };
    if (p.description) item.description = p.description;
    return item;
  })
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('✓ Parsed student prompts:', studentPrompts.length);
console.log('✓ Parsed advisor prompts:', advisorPrompts.length);
console.log('✓ Parsed study-guides prompts:', studyGuidesPrompts.length);
console.log('✓ Parsed student-wellness prompts:', studentWellnessPrompts.length);
console.log('✓ Total prompts:', allPrompts.metadata.totalPrompts);
console.log('\nPrompt titles:');
console.log('\nSTUDENT PROMPTS:');
studentPrompts.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.title}`);
});
console.log('\nADVISOR PROMPTS:');
advisorPrompts.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.title}`);
});
console.log('\nSTUDY GUIDES PROMPTS:');
studyGuidesPrompts.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.title}`);
});
console.log('\nSTUDENT WELLNESS PROMPTS:');
studentWellnessPrompts.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.title}`);
});
console.log(`\n✓ Data written to: ${outputPath}`);
