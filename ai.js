const path = require("path");
const fs = require("fs");
const promtpGroq = require("./ai_config/grogConfig");

async function promptAI(prompt, temperature, outputFile) {
  if (typeof temperature === "string") {
    //Convert to number
    const tempNum = parseFloat(temperature);
    if (isNaN(tempNum)) {
      throw new Error("Error: Temperature must be a number.");
    }
    temperature = tempNum;
  }
  process.stderr.write(
    `Debug: Prompting AI with temperature: ${temperature}\n`
  );
  try {
    const response = await initializeModel(prompt, temperature);
    process.stderr.write(`Debug: Output file: ${outputFile}\n`);
    handleOutput(response, outputFile);
  } catch (error) {
    throw new Error(error);
  }
}

async function initializeModel(prompt, temperature) {
  return await promtpGroq(prompt, temperature);
}

function handleOutput(response, outputFile) {
  if (outputFile) {
    process.stderr.write(`Debug: Output will be written to: ${outputFile}`);
    const outputPath = path.resolve(outputFile);
    fs.writeFileSync(outputPath, response);
  } else {
    process.stdout.write(response);
    return;
  }
}
module.exports = promptAI;
