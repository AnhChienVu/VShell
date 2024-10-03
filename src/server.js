#!/usr/bin/env node
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { Groq } = require("groq-sdk");
const toml = require("smol-toml");
require("dotenv").config();
const promptAI = require("./ai");
const defaultPrompt = require("./defaultPrompt");
const getFileContent = require("./getFileContent");

/**
 * Parse data from a toml configuration file
 * @param {string} filepath
 * @returns parsed configuration data
 * @throws Error if parsing operation fails
 */
function loadConfig(filepath) {
  try {
    const data = fs.readFileSync(filepath, "utf-8");
    return toml.parse(data);
  } catch (err) {
    // Output error except non-existent file error
    if (err.code !== "ENOENT") console.error("Error:", err);
  }
}

// Load configuration from config.toml
const config = loadConfig("../.toml");

const program = new Command();

// Define CLI's name
const CLI_NAME = "VShell";
program.name(CLI_NAME);

//versioning CLI
const CLI_VERSION = "0.0.1";
program.version(CLI_VERSION);

program
  .option("-d, --debug", "output extra debugging")
  .option("-u, --update", "update to the latest version")
  .option("-m, --model", "specify the model to use <model>", config.model)
  .option(
    "-t, --token-usage",
    "specify the usage of token for prompt and response"
  )
  .option("-s, --stream", "stream the response live as it updates")
  .option(
    "-T, --temperature <number>",
    "set the temperature for the model (Groq)",
    parseFloat,
    process.env.GROQ_TEMPERATURE
      ? parseFloat(process.env.GROQ_TEMPERATURE)
      : config.temperature || 0.7 // Fallback to config or default to 0.7
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
        process.stderr.write(
          "Debug: No files specified. Please provide at least 1 file. \n"
        );
      }
      process.exit(1);
    }

    // Combine data if user input multiple files
    const outputData = getFileContent(files, options);

    if (options.temperature) {
      promptAI(defaultPrompt + outputData, options.temperature, options);
    } else {
      promptAI(
        defaultPrompt + outputData,
        process.env.GROQ_TEMPERATURE,
        options
      );
    }
  });
// Parse command-line arguments
program.parse(process.argv);
