#!/usr/bin/env node

/**
 * QR Code Generator for Economics PDF Example
 *
 * Generates a standalone QR code for downloading the Economics 101 example PDF.
 * Install first: npm install qrcode
 *
 * Usage: node generate-pdf-example-qr.js
 */

const { generateExampleQR, checkQRCodePackage } = require('../utils/qr-generator');

// Configuration
const config = {
  siteUrl: 'https://bcfoltz.github.io/shpe-2025',
  filename: '06 - Economics 101 - Elasticity of Demand and Supply.pdf',
  label: 'PDF',
  outputName: 'qr-economics-pdf-example',
  description: 'This QR code downloads the Economics example PDF showing sample output from the Study Tools prompts.'
};

// Check dependencies and generate
checkQRCodePackage();
generateExampleQR(config).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
