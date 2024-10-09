const path = require("path");
const fs = require("fs");
const promptGroq = require("../ai_config/grogConfig");
const handleDebugMessage = require("./utils/handleDebugMessage");
const handleOutputFile = require("./utils/handleOutputFile");

async function promptAI(prompt, temperature, options) {
  if (typeof temperature === "string") {
    //Convert to number
    const temperatureNumber = parseFloat(temperature);

    if (isNaN(temperatureNumber)) {
      throw new Error("Error: Temperature must be a number.");
    }

    temperature = temperatureNumber;
  }

  handleDebugMessage(`Prompting AI with temperature: ${temperature}.`, "Info");

  try {
    const { response, tokenInfo } = await initializeModel(
      prompt,
      temperature,
      options
    );

    console.log("==================");
    console.log(tokenInfo);
    console.log("==================");

    // Handle output
    if (options.output) {
      handleDebugMessage(`Output file: ${options.output}.`, "Info");
      handleOutputFile(response, options.output);
    } else if (!options.stream) {
      process.stdout.write("\n\n" + response);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function initializeModel(prompt, temperature, options) {
  return await promptGroq(prompt, temperature, options);
}

module.exports = promptAI;
