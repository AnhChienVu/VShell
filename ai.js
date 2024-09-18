const path = require("path");
const fs = require("fs");
const promtpGroq = require("./ai_config/grogConfig");

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
    const { response, promptTokens, responseTokens } = await initializeModel(
      prompt,
      temperature
    );

    // Show token usage
    if (options.tokenUsage) {
      process.stderr.write(
        `Info: Prompt Token Usages: ${promptTokens}
      Response Token Usages:${responseTokens}
      Completed Token Usages: ${promptTokens + responseTokens}\n`
      );
    }

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
