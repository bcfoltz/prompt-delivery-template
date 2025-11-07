#!/usr/bin/env node

/**
 * QR Code Generator for SHPE 2025 Convention
 *
 * Generates QR codes for the deployed GitHub Pages site.
 * Install first: npm install qrcode
 *
 * Usage: node generate-qr-codes.js
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Project root directory (parent of scripts/)
const PROJECT_ROOT = path.join(__dirname, '..');

// Configuration
const SITE_URL = 'https://bcfoltz.github.io/shpe-2025';
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'qr-codes');
const QR_COLOR = '#000000'; // Black for reliable scanning on projectors

// QR codes to generate
const qrCodes = [
  {
    name: 'main',
    url: SITE_URL,
    label: 'SHPE 2025 - AI-Powered Academic Prompts',
    description: 'Main landing page with all 66 prompts (Students, Advisors, Study Tools, Wellness)'
  },
  {
    name: 'download-zip',
    url: `${SITE_URL}/prompts-download.zip`,
    label: 'Download Prompts Package',
    description: 'ZIP file with all 66 prompts and README guide'
  }
];

// Options for QR code generation
const qrOptions = {
  errorCorrectionLevel: 'H', // High error correction
  type: 'image/png',
  quality: 1,
  margin: 2,
  width: 1000, // Large size for printing
  color: {
    dark: QR_COLOR, // Black for best contrast and reliability
    light: '#FFFFFF'
  }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
}

// Generate QR codes
async function generateQRCodes() {
  console.log('🎨 Generating QR Codes for SHPE 2025 Convention\n');
  console.log('━'.repeat(60));

  for (const qr of qrCodes) {
    try {
      const filename = `qr-${qr.name}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      // Generate QR code
      await QRCode.toFile(filepath, qr.url, qrOptions);

      // Also generate as SVG for better scaling
      const svgFilename = `qr-${qr.name}.svg`;
      const svgFilepath = path.join(OUTPUT_DIR, svgFilename);
      const svgString = await QRCode.toString(qr.url, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: QR_COLOR,
          light: '#FFFFFF'
        }
      });
      fs.writeFileSync(svgFilepath, svgString);

      console.log(`✅ ${qr.label}`);
      console.log(`   URL: ${qr.url}`);
      console.log(`   PNG: ${filename}`);
      console.log(`   SVG: ${svgFilename}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error generating ${qr.name}:`, error.message);
    }
  }

  console.log('━'.repeat(60));
  console.log(`\n✨ QR codes generated successfully!`);
  console.log(`📁 Location: ${OUTPUT_DIR}\n`);

  // Generate HTML preview
  generatePreview();
}

// Generate HTML preview page
function generatePreview() {
  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SHPE 2025 - QR Code Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #002D56;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .qr-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .qr-card h2 {
      color: #D44500;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .qr-code {
      width: 100%;
      max-width: 400px;
      height: auto;
      margin: 1rem 0;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }
    .url {
      font-family: monospace;
      font-size: 0.875rem;
      color: #6b7280;
      word-break: break-all;
      margin-top: 1rem;
      padding: 0.5rem;
      background: #f9fafb;
      border-radius: 4px;
    }
    .download-links {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .download-links a {
      color: #D44500;
      text-decoration: none;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border: 2px solid #D44500;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .download-links a:hover {
      background: #D44500;
      color: white;
    }
    .instructions {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .instructions h2 {
      color: #002D56;
      margin-bottom: 1rem;
    }
    .instructions ul {
      margin-left: 2rem;
    }
    .instructions li {
      margin-bottom: 0.5rem;
    }
    @media print {
      body { background: white; }
      .instructions { display: none; }
      .download-links { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SHPE 2025 QR Codes</h1>
    <p class="subtitle">Scan with your phone to test</p>

    <div class="grid">
      ${qrCodes.map(qr => `
      <div class="qr-card">
        <h2>${qr.label}</h2>
        <p>${qr.description}</p>
        <img src="qr-${qr.name}.png" alt="${qr.label} QR Code" class="qr-code">
        <div class="url">${qr.url}</div>
        <div class="download-links">
          <a href="qr-${qr.name}.png" download>Download PNG</a>
          <a href="qr-${qr.name}.svg" download>Download SVG</a>
        </div>
      </div>
      `).join('')}
    </div>

    <div class="instructions">
      <h2>📋 Usage Instructions</h2>
      <ul>
        <li><strong>For Posters/Banners:</strong> Use SVG files (scalable to any size)</li>
        <li><strong>For Digital Displays:</strong> Use PNG files (1000x1000px)</li>
        <li><strong>For Printing:</strong> Ensure QR code is at least 2 inches (5cm) square</li>
        <li><strong>Testing:</strong> Scan from 3-6 feet to verify scanability</li>
        <li><strong>Colors:</strong> SHPE Orange (#D44500) on white background</li>
      </ul>

      <h2 style="margin-top: 2rem;">🎯 Recommended Sizes</h2>
      <ul>
        <li><strong>Convention Poster:</strong> 6-12 inches (15-30 cm)</li>
        <li><strong>Handout Cards:</strong> 2-4 inches (5-10 cm)</li>
        <li><strong>Presentation Slides:</strong> 4-6 inches (10-15 cm)</li>
        <li><strong>Table Tents:</strong> 3-5 inches (8-12 cm)</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

  const previewPath = path.join(OUTPUT_DIR, 'preview.html');
  fs.writeFileSync(previewPath, previewHtml);
  console.log(`🌐 Preview page generated: preview.html`);
  console.log(`   Open in browser to view and download QR codes\n`);
}

// Check if qrcode package is installed
try {
  require.resolve('qrcode');
} catch (e) {
  console.error('❌ Error: qrcode package not installed');
  console.log('\n📦 Please install it first:');
  console.log('   npm install qrcode\n');
  process.exit(1);
}

// Run the generator
generateQRCodes().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
