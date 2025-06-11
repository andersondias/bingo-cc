const sharp = require("sharp");
const path = require("path");

async function optimizeImages() {
  try {
    // Optimize logo.png to WebP
    await sharp("logo.png").webp({ quality: 80 }).toFile("logo.webp");

    console.log("Image optimization completed successfully!");
  } catch (error) {
    console.error("Error optimizing images:", error);
    process.exit(1);
  }
}

optimizeImages();
