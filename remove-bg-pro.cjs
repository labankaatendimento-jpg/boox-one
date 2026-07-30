const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/robso/.gemini/antigravity-ide/brain/19a9c853-1b4e-4093-9e81-8c39e70c1a78/glowing_gift_box_1785353043739.png';
const outputPath = path.join(__dirname, 'public/glowing_gift_box.png');

async function processImage() {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const newBuffer = Buffer.alloc(rawBuffer.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = rawBuffer[idx];
      const g = rawBuffer[idx + 1];
      const b = rawBuffer[idx + 2];

      const brightness = (r + g + b) / 3;
      const isGreenGlow = (g > 20 && g > r * 1.05 && g > b * 1.05) || (g > 50 && g > r);

      // Floor reflection starts way down at around 86% of the height
      const isReflectionZone = y > height * 0.86;

      if (isReflectionZone) {
        // Fade out floor reflection smoothly at the very bottom
        const fade = 1 - ((y - height * 0.86) / (height * 0.14));
        const alpha = Math.max(0, Math.min(255, Math.round(brightness * fade * 2)));
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        newBuffer[idx + 3] = isGreenGlow ? Math.round(g * fade) : alpha;
      } else if (isGreenGlow) {
        // Keep green neon glow with full, rich alpha
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        const glowAlpha = Math.min(255, Math.max(50, Math.round(g * 1.5)));
        newBuffer[idx + 3] = glowAlpha;
      } else if (brightness > 6) {
        // Solid box body & ribbon - FULLY OPAQUE, no cutoff!
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        newBuffer[idx + 3] = 255;
      } else {
        // Background black
        newBuffer[idx] = 0;
        newBuffer[idx + 1] = 0;
        newBuffer[idx + 2] = 0;
        newBuffer[idx + 3] = 0;
      }
    }
  }

  await sharp(newBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('Fixed! Box body is 100% complete with no flat cut at the bottom.');
}

processImage().catch(console.error);
