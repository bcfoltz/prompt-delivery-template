#!/usr/bin/env node

/**
 * QR Code Generator for Economics Video Example
 *
 * Generates a standalone QR code for downloading the Economics 101 NotebookLM video (mp4).
 * Install first: npm install qrcode
 *
 * Usage: node generate-video-example-qr.js
 */

const { generateExampleQR, checkQRCodePackage } = require('../utils/qr-generator');

// Configuration
const config = {
  siteUrl: 'https://bcfoltz.github.io/shpe-2025',
  filename: '06 - Economics 101 - Elasticity of Supply and Demand - NotebookLM.mp4',
  label: 'Video',
  outputName: 'qr-economics-video-example',
  description: 'This QR code downloads the Economics NotebookLM video (mp4) showing sample output from the Study Tools prompts.'
};

// Check dependencies and generate
checkQRCodePackage();
generateExampleQR(config).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
