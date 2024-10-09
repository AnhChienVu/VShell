#!/usr/bin/env node
const { Command } = require("commander");
require("dotenv").config();

const promptAI = require("./ai");
const defaultPrompt = require("./defaultPrompt");
const getFileContent = require("./getFileContent");

const ConfigHandler = require("./utils/configHandler");
const handleDebugMessage = require("./utils/handleDebugMessage");

// Get all .toml files in the home directory
const tomlFiles = ConfigHandler.getTomlFiles();

// Load the configuration from the first .toml file found
const config = ConfigHandler.loadConfig(tomlFiles);

const program = new Command();

// Define CLI's name
const CLI_NAME = "VShell";

//versioning CLI
const CLI_VERSION = "0.0.1";

program
  .name(CLI_NAME)
  .version(CLI_VERSION)
  .option("-d, --debug", "output extra debugging")
  .option("-u, --update", "update to the latest version")
  .option(
    "-m, --model",
    "specify the model to use <model>",
    config?.model || "llama3-8b-8192"
  )
  .option(
    "-t, --token-usage",
    "specify the usage of token for prompt and response"
  )
  .option("-s, --stream", "stream the response live as it updates")
  .option(
    "-T, --temperature <number>",
    "set the temperature for the model (Groq)",
    parseFloat,
    config?.temperature || 0.7 // Fallback to config or default to 0.7
  );

// Define a command to handle file inputs
program
  .description("Process one or more files")
  .option("-o, --output <file>", "Specifying output file")
  .arguments("[files...]")
  .action(async (files) => {
    const options = program.opts();

    if (files.length === 0) {
      if (options.debug) {
        handleDebugMessage(
          "No files specified. Please provide at least 1 file.",
          "Debug"
        );
      }
      process.exit(1);
    }

    // Final configuration from program
    const finalConfig = {
      model: options.model || config.model,
      temperature: options.temperature || config.temperature,
    };
    if (options.debug) {
      handleDebugMessage(`temperature1: ${finalConfig.temperature}`, "Debug");
      handleDebugMessage(`model: ${finalConfig.model}`, "Debug");
    }

    // Combine data if user input multiple files
    const outputData = getFileContent(files, options);

    promptAI(defaultPrompt + outputData, finalConfig.temperature, options);
  });
// Parse command-line arguments
program.parse(process.argv);
