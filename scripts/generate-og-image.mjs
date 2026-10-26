/**
 * Regenerates the 1200×630 social card at public/og.png.
 *
 *   node scripts/generate-og-image.mjs
 *
 * Uses the logo that ships with the site, so re-run this after a rebrand.
 * `sharp` is already installed as an optional dependency of Next.js.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const logo = await fs.readFile(path.join(root, "public/images/sdc-logo.svg"));
const logoData = `data:image/svg+xml;base64,${logo.toString("base64")}`;

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b2438" />
      <stop offset="100%" stop-color="#12395a" />
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <circle cx="1080" cy="90" r="240" fill="#ec1c2f" opacity="0.16" />
  <circle cx="60" cy="600" r="180" fill="#3b82f6" opacity="0.12" />

  <rect x="72" y="175" width="280" height="280" rx="36" fill="#ffffff" />
  <image href="${logoData}" x="100" y="203" width="224" height="224" />

  <text x="416" y="262" font-family="DejaVu Sans, Arial, sans-serif" font-size="44" font-weight="bold" fill="#ffffff">Student Development Council</text>
  <text x="418" y="306" font-family="DejaVu Sans, Arial, sans-serif" font-size="21" fill="#9fb3c8">Indian Institute of Science Education and Research Bhopal</text>

  <rect x="418" y="336" width="120" height="6" rx="3" fill="#ec1c2f" />

  <text x="418" y="402" font-family="DejaVu Sans, Arial, sans-serif" font-size="28" fill="#e2e8f0">Building Tomorrow&#8217;s Leaders</text>
</svg>`;

const output = path.join(root, "public/og.png");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);

const { size } = await fs.stat(output);
console.log(`Wrote ${path.relative(root, output)} (${Math.round(size / 1024)} KB)`);
