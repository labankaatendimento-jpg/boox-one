const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'public', 'glowing_gift_box.png');
const outputPath = path.join(__dirname, 'public', 'glowing_gift_box_clean.png');

async function removeBackground() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const newBuffer = Buffer.alloc(rawBuffer.length);
  
  for (let i = 0; i < rawBuffer.length; i += 4) {
    const r = rawBuffer[i];
    const g = rawBuffer[i + 1];
    const b = rawBuffer[i + 2];
    const a = rawBuffer[i + 3];
    
    const brightness = (r + g + b) / 3;
    const greenDominance = g - Math.max(r, b);
    
    if (brightness < 18) {
      // Pure black background → fully transparent
      newBuffer[i] = r;
      newBuffer[i + 1] = g;
      newBuffer[i + 2] = b;
      newBuffer[i + 3] = 0;
    } else if (brightness < 45 && greenDominance < 8) {
      // Dark non-green pixels → fade proportionally
      const alpha = Math.min(255, Math.round(((brightness - 18) / 27) * 255));
      newBuffer[i] = r;
      newBuffer[i + 1] = g;
      newBuffer[i + 2] = b;
      newBuffer[i + 3] = alpha;
    } else {
      // Box surface, glow, ribbon → keep fully
      newBuffer[i] = r;
      newBuffer[i + 1] = g;
      newBuffer[i + 2] = b;
      newBuffer[i + 3] = a;
    }
  }
  
  // Fade out bottom 22% (reflection)
  const reflectionStart = Math.floor(height * 0.76);
  for (let y = reflectionStart; y < height; y++) {
    const fadeProgress = (y - reflectionStart) / (height - reflectionStart);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      newBuffer[idx + 3] = Math.round(newBuffer[idx + 3] * Math.max(0, 1 - fadeProgress * fadeProgress));
    }
  }
  
  await sharp(newBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);
  
  console.log('Done! Saved to', outputPath);
}

removeBackground().catch(console.error);
