const path = require("path");
const fs = require("fs");

function getFileContent(files, options) {
  // Create an array to store all files
  let allFiles = [];

  // Process each file path in argurment list
  files.forEach((file) => {
    // convert a file path to an absolute path
    const filePath = path.resolve(file);

    // Log debug information
    if (options.debug) {
      process.stderr.write(`Debug: Processing file path: ${filePath}. \n`);

      if (!fs.existsSync(filePath)) {
        process.stderr.write(`Error: File not found: ${filePath}. \n`);
        process.exit(1);
      }
      if (fs.statSync(filePath).isDirectory()) {
        process.stderr.write(
          `Debug: File path is a directory: ${filePath}. \n`
        );
        const directoryFiles = fs
          .readdirSync(filePath)
          .map((f) => path.join(filePath, f));
        allFiles = allFiles.concat(directoryFiles);
      } else {
        process.stderr.write(`Debug: File path is a file: ${filePath}. \n`);
        allFiles.push(filePath);
      }
    }
  });

  // Read the content of each file
  const results = allFiles.map((file) => {
    process.stderr.write(`Debug: Processing file: ${file}. \n`);
    return fs.readFileSync(file, "utf-8");
  });
  return results.join("\n");
}
module.exports = getFileContent;
