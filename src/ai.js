const path = require("path");
const fs = require("fs");
const promtpGroq = require("../ai_config/grogConfig");

async function promptAI(prompt, temperature, options) {
  if (typeof temperature === "string") {
    //Convert to number
    const tempNum = parseFloat(temperature);
    if (isNaN(tempNum)) {
      throw new Error("Error: Temperature must be a number.");
    }
    temperature = tempNum;
  }
  process.stderr.write(`Info: Prompting AI with temperature: ${temperature}\n`);
  try {
    const { response } = await initializeModel(prompt, temperature);

    // Handle output
    if (options.outputFile) {
      process.stderr.write(`Debug: Output file: ${options.outputFile}\n`);
      handleOutput(response, outputFile);
    } else {
      process.stdout.write("\n\n" + response);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function initializeModel(prompt, temperature) {
  return await promtpGroq(prompt, temperature);
}

function handleOutput(response, outputFile) {
  process.stderr.write(`Debug: Output will be written to: ${outputFile}`);
  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, response);
}
module.exports = promptAI;