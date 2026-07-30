const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/robso/.gemini/antigravity-ide/brain/19a9c853-1b4e-4093-9e81-8c39e70c1a78/gift_box_white_bg_1785356668476.png';
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
      const a = rawBuffer[idx + 3];

      // Since the background is pure solid white (255, 255, 255)
      // We check if the pixel is near-white
      const minVal = Math.min(r, g, b);
      
      if (minVal > 248) {
        // Pure background white -> 100% transparent
        newBuffer[idx] = 0;
        newBuffer[idx + 1] = 0;
        newBuffer[idx + 2] = 0;
        newBuffer[idx + 3] = 0;
      } else if (minVal > 230) {
        // Semi-transparent edge pixels for anti-aliasing (smooth transition)
        const alphaFactor = (255 - minVal) / (255 - 230);
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        newBuffer[idx + 3] = Math.round(255 * alphaFactor);
      } else {
        // Solid box, ribbon, and glow -> 100% opaque
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        newBuffer[idx + 3] = 255;
      }
    }
  }

  await sharp(newBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('White background removed perfectly and saved to public/glowing_gift_box.png!');
}

processImage().catch(console.error);
