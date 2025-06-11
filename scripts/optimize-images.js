const sharp = require("sharp");
const path = require("path");

const images = [
  {
    input: "logo.png",
    output: "logo.webp",
  },
  {
    input: "logo-simple.png",
    output: "logo-simple.webp",
  },
];

async function optimizeImages() {
  try {
    for (const image of images) {
      await sharp(image.input).webp({ quality: 80 }).toFile(image.output);
    }

    console.log("Image optimization completed successfully!");
  } catch (error) {
    console.error("Error optimizing images:", error);
    process.exit(1);
  }
}

optimizeImages();
