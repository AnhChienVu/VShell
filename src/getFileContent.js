const path = require("path");
const fs = require("fs");

function getFileContent(files, options) {
  // Process each file in argurment list
  const results = files.map((file) => {
    // convert a file path to an absolute path
    const filePath = path.resolve(file);

    // Log debug information
    if (options.debug) {
      process.stderr.write(`Debug: Resolving file path: ${filePath}. \n`);

      if (!fs.existsSync(filePath)) {
        process.stderr.write(`Error: File not found: ${filePath}. \n`);
        process.exit(1);
      }
      if (fs.statSync(filePath).isDirectory()) {
        process.stderr.write(`Error: Path is a directory: ${filePath}. \n`);
        process.exit(1);
      }
      process.stderr.write(`Debug: Processing file: ${filePath}. \n`);
    }

    return fs.readFileSync(filePath, "utf-8");
  });
  return results.join("\n");
}
module.exports = getFileContent;
