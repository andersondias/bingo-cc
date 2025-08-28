const fs = require("fs");

try {
  const html = fs.readFileSync("index.html", "utf8");
  const timestamp = Math.floor(Date.now() / 1000);
  const updated = html.replace(/v=\d+/g, "v=" + timestamp);
  fs.writeFileSync("index.html", updated);
  console.log("Updated version to v=" + timestamp);
} catch (error) {
  console.error("Error updating version:", error.message);
  process.exit(1);
}
