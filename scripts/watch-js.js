const chokidar = require("chokidar");
const { exec } = require("child_process");

console.log("Watching app.js for changes...");

chokidar.watch("app.js").on("change", () => {
  console.log("app.js changed, updating version...");
  exec("npm run update-version", (error, stdout, stderr) => {
    if (error) {
      console.error("Error updating version:", error.message);
      return;
    }
    if (stderr) {
      console.error("stderr:", stderr);
      return;
    }
    console.log(stdout.trim());
  });
});
