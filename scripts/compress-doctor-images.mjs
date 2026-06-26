import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../public/assets/doctors/finalDoctors");
const DEST = path.join(__dirname, "../public/assets/doctors");

const jobs = [
  // Large PNGs — resize + convert to WebP
  { src: "Dr. Jaydeep Patel.png",   dest: "jaydeep-patel.webp",   width: 400 },
  { src: "Dr. Mita Shah.png",       dest: "mita-shah.webp",       width: 400 },
  { src: "Dr. Rakhee Patel.png",    dest: "rakhee-patel.webp",    width: 400 },
  { src: "Dr.Binal Shah.png",       dest: "binal-shah.webp",      width: 400 },
  // JPGs — already small, just convert to WebP
  { src: "Dr Priyanka Sinha-removebg-preview.jpg", dest: "priyanka-sinha.webp", width: 400 },
  { src: "DR SURABHI VEGAD PHOTO-removebg-preview (1).jpg", dest: "surbhi-vegad.webp", width: 400 },
];

for (const { src, dest, width } of jobs) {
  const srcPath = path.join(SRC, src);
  const destPath = path.join(DEST, dest);
  try {
    await sharp(srcPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);
    const sizeBefore = Math.round(fs.statSync(srcPath).size / 1024);
    const sizeAfter  = Math.round(fs.statSync(destPath).size / 1024);
    console.log(`✓ ${src} → ${dest}  (${sizeBefore}KB → ${sizeAfter}KB)`);
  } catch (err) {
    console.error(`✗ ${src}: ${err.message}`);
  }
}
