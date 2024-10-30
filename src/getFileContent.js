/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const handleDebugMessage = require("./utils/handleDebugMessage");

function getFileContent(files, options) {
  // Create an array to store all files
  let filePaths = [];

  // Process each file path in argurment list
  files.forEach((file) => {
    // convert a file path to an absolute path
    const filePath = path.resolve(file);

    // Log debug information
    if (options.debug) {
      handleDebugMessage(`Processing file path: ${filePath}.`, "Debug");
    }
    if (!fs.existsSync(filePath)) {
      handleDebugMessage(`File not found: ${filePath}.`, "Error");
      process.exit(1);
    }
    if (fs.statSync(filePath).isDirectory()) {
      if (options.debug) {
        handleDebugMessage(`File path is a directory: ${filePath}.`, "Debug");
      }

      // Get all files in a directory and subdirectories
      const directoryFiles = glob
        .sync("**/*", { cwd: filePath, nodir: true })
        .map((f) => path.join(filePath, f));

      filePaths = filePaths.concat(directoryFiles);
    } else {
      if (options.debug) {
        handleDebugMessage(`File path is a file: ${filePath}.`, "Debug");
      }
      filePaths.push(filePath);
    }
  });

  // Read the content of each file
  const fileContents = filePaths.map((file) => {
    handleDebugMessage(`Processing file: ${file}.`, "Info");

    return fs.readFileSync(file, "utf-8");
  });

  return fileContents.join("\n");
}
module.exports = getFileContent;
