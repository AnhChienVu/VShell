const path = require("path");
const fs = require("fs");

function handleOutputFile(response, outputFile) {
  process.stderr.write(`Debug: Output will be written to: ${outputFile}`);
  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, response);
}

module.exports = handleOutputFile;
