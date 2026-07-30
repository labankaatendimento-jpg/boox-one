const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/robso/.gemini/antigravity-ide/brain/19a9c853-1b4e-4093-9e81-8c39e70c1a78/glowing_gift_box_1785353043739.png';

async function analyze() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  console.log(`Image dimensions: ${width}x${height}`);

  // Find lowest y coordinate for metallic box body (where r, g, b are non-green metallic gray or bright green ribbon)
  let lowestBoxY = 0;
  
  // Let's print brightness and color at various y levels from 700 to 900
  for (let y = 700; y < height; y += 20) {
    let nonBlackCount = 0;
    let greenCount = 0;
    let metallicCount = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = rawBuffer[idx];
      const g = rawBuffer[idx + 1];
      const b = rawBuffer[idx + 2];
      const brightness = (r + g + b) / 3;
      
      if (brightness > 15) nonBlackCount++;
      if (g > 60 && g > r * 1.2) greenCount++;
      if (brightness > 20 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) metallicCount++;
    }
    console.log(`y=${y}: nonBlack=${nonBlackCount}, green=${greenCount}, metallic=${metallicCount}`);
  }
}

analyze().catch(console.error);
