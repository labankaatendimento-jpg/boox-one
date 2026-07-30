const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public/imagemsemfundo.png');

async function analyze() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  console.log(`Image: ${width}x${height}`);

  // Let's sample pixels along the top row (y = 0) and first few rows to see the checkerboard colors
  const samples = [];
  for (let x = 0; x < Math.min(width, 100); x += 5) {
    const idx = (0 * width + x) * 4;
    const r = rawBuffer[idx];
    const g = rawBuffer[idx + 1];
    const b = rawBuffer[idx + 2];
    samples.push({ x, y: 0, rgb: `(${r},${g},${b})` });
  }

  // Also sample at y = 20
  for (let x = 0; x < Math.min(width, 100); x += 5) {
    const idx = (20 * width + x) * 4;
    const r = rawBuffer[idx];
    const g = rawBuffer[idx + 1];
    const b = rawBuffer[idx + 2];
    samples.push({ x, y: 20, rgb: `(${r},${g},${b})` });
  }

  console.log('Top row samples (y=0):', samples.slice(0, 20));
  console.log('Row y=20 samples:', samples.slice(20, 40));
}

analyze().catch(console.error);
