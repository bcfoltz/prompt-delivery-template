/**
 * QR Code Generation Utility
 * Unified QR code generator for example files (PDF, audio, video)
 * Reduces duplication across multiple generator scripts
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generate QR codes for an example file
 * @param {Object} config - Configuration object
 * @param {string} config.siteUrl - Base site URL (e.g., 'https://bcfoltz.github.io/shpe-2025')
 * @param {string} config.filename - Example filename to link to
 * @param {string} config.label - Human-readable label (e.g., 'PDF', 'Audio', 'Video')
 * @param {string} config.outputName - Output filename prefix (e.g., 'qr-economics-pdf-example')
 * @param {string} config.description - Description of what this QR code links to
 * @param {string} config.outputDir - Directory to save QR codes (optional, defaults to qr-codes/)
 * @returns {Promise<void>}
 */
async function generateExampleQR(config) {
  const {
    siteUrl,
    filename,
    label,
    outputName,
    description,
    outputDir = path.join(__dirname, '..', '..', 'qr-codes')
  } = config;

  // URL-encode the filename for proper web access
  const fileUrl = `${siteUrl}/${encodeURIComponent(filename)}`;

  // QR code options
  const qrOptions = {
    errorCorrectionLevel: 'H', // High error correction
    type: 'image/png',
    quality: 1,
    margin: 2,
    width: 1000, // Large size for printing
    color: {
      dark: '#000000', // Black for reliable scanning
      light: '#FFFFFF'
    }
  };

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎨 Generating QR Code for ${label} Example\n`);
  console.log('━'.repeat(60));

  try {
    // Generate PNG
    const pngFilename = `${outputName}.png`;
    const pngFilepath = path.join(outputDir, pngFilename);
    await QRCode.toFile(pngFilepath, fileUrl, qrOptions);
    console.log(`✅ Generated PNG`);
    console.log(`   File: ${pngFilename}`);

    // Generate SVG
    const svgFilename = `${outputName}.svg`;
    const svgFilepath = path.join(outputDir, svgFilename);
    const svgString = await QRCode.toString(fileUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    fs.writeFileSync(svgFilepath, svgString);
    console.log(`✅ Generated SVG`);
    console.log(`   File: ${svgFilename}`);

    console.log('');
    console.log('━'.repeat(60));
    console.log(`\n✨ QR code generated successfully!`);
    console.log(`📁 Location: ${outputDir}`);
    console.log(`🔗 URL: ${fileUrl}`);
    console.log(`\n📋 ${description}\n`);

    return {
      png: pngFilepath,
      svg: svgFilepath,
      url: fileUrl
    };

  } catch (error) {
    console.error(`❌ Error generating QR code:`, error.message);
    throw error;
  }
}

/**
 * Check if qrcode package is installed
 * @throws {Error} If qrcode package is not installed
 */
function checkQRCodePackage() {
  try {
    require.resolve('qrcode');
  } catch (e) {
    throw new Error(
      'qrcode package not installed. Please run: npm install qrcode'
    );
  }
}

module.exports = {
  generateExampleQR,
  checkQRCodePackage
};
