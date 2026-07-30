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

      // 1. Floor reflection zone (y > 76% height and not metallic box body)
      if (y > height * 0.76 && brightness < 50) {
        newBuffer[idx] = 0;
        newBuffer[idx + 1] = 0;
        newBuffer[idx + 2] = 0;
        newBuffer[idx + 3] = 0;
        continue;
      }

      // 2. Outer pitch black background pixels
      if (brightness <= 5) {
        newBuffer[idx] = 0;
        newBuffer[idx + 1] = 0;
        newBuffer[idx + 2] = 0;
        newBuffer[idx + 3] = 0;
        continue;
      }

      // 3. Keep 100% original pixel data for box, ribbon & glow (no math distortion, no green blobs)
      newBuffer[idx] = r;
      newBuffer[idx + 1] = g;
      newBuffer[idx + 2] = b;
      newBuffer[idx + 3] = 255;
    }
  }

  await sharp(newBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('Clean pristine image generated!');
}

processImage().catch(console.error);
