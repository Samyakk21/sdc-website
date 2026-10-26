/**
 * Regenerates the site favicons from the SDC emblem used in the hero
 * (`public/images/sdc-logo.svg`).
 *
 *   node scripts/generate-favicons.mjs
 *
 * Writes:
 *   src/app/favicon.ico    multi-size ICO (16/32/48/64/128/256, PNG-encoded)
 *   src/app/apple-icon.png 180×180 on white (iOS ignores transparency)
 *
 * `sharp` is already installed as an optional dependency of Next.js.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const logo = path.join(root, "public/images/sdc-logo.svg");

/** Renders the emblem to a square PNG at the requested size. */
async function render(size, background) {
  let pipeline = sharp(logo).resize(size, size, {
    fit: "contain",
    background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (background) pipeline = pipeline.flatten({ background });

  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Packs PNG buffers into an ICO container. Vista+ browsers accept PNG data
 * inside .ico, which keeps the file far smaller than BMP entries.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // image count

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  const entries = [];

  images.forEach(({ size, data }, index) => {
    const at = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, at + 0); // width
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1); // height
    directory.writeUInt8(0, at + 2); // palette count
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // color planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
    entries.push(data);
  });

  return Buffer.concat([header, directory, ...entries]);
}

const sizes = [16, 32, 48, 64, 128, 256];
const images = [];
for (const size of sizes) {
  images.push({ size, data: await render(size) });
}

const icoPath = path.join(root, "src/app/favicon.ico");
await fs.writeFile(icoPath, buildIco(images));

const applePath = path.join(root, "src/app/apple-icon.png");
await fs.writeFile(applePath, await render(180, { r: 255, g: 255, b: 255, alpha: 1 }));

const [icoSize, appleSize] = await Promise.all([
  fs.stat(icoPath).then((s) => s.size),
  fs.stat(applePath).then((s) => s.size),
]);

console.log(
  `Wrote src/app/favicon.ico (${Math.round(icoSize / 1024)} KB, ${sizes.join("/")})`,
);
console.log(`Wrote src/app/apple-icon.png (${Math.round(appleSize / 1024)} KB, 180×180)`);
