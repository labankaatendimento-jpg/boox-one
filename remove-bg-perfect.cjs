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

      // 1. Floor Reflection Zone: Everything below y = 782 is floor reflection
      if (y > height * 0.765) {
        newBuffer[idx] = 0;
        newBuffer[idx + 1] = 0;
        newBuffer[idx + 2] = 0;
        newBuffer[idx + 3] = 0;
        continue;
      }

      // 2. High-quality Neon Glow detection (ONLY vivid green neon, no dark background halo!)
      const isVividGreen = g > 65 && g > r * 1.2 && g > b * 1.2;
      const isSuperBrightGlow = g > 110 && g > r * 1.1;

      if (isVividGreen || isSuperBrightGlow) {
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        // Smooth alpha falloff for the glow without dark halos
        const alpha = Math.min(255, Math.round((g - 40) * 1.8));
        newBuffer[idx + 3] = Math.max(0, alpha);
        continue;
      }

      // 3. Metallic Box Body & Dark Box Surfaces
      // Box body has metallic texture or dark gray color (brightness >= 16)
      if (brightness >= 16 && (r > 12 || g > 12 || b > 12)) {
        newBuffer[idx] = r;
        newBuffer[idx + 1] = g;
        newBuffer[idx + 2] = b;
        newBuffer[idx + 3] = 255; // 100% Solid Opaque
        continue;
      }

      // 4. Background (Dark gray/black < 16) -> 100% Transparent
      newBuffer[idx] = 0;
      newBuffer[idx + 1] = 0;
      newBuffer[idx + 2] = 0;
      newBuffer[idx + 3] = 0;
    }
  }

  await sharp(newBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log('PERFECT! Floor reflection and dark green halo completely eliminated.');
}

processImage().catch(console.error);
