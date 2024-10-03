#!/usr/bin/env node
const { Command } = require("commander");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { Groq } = require("groq-sdk");
const toml = require("smol-toml");
require("dotenv").config();
const promptAI = require("./ai");
const defaultPrompt = require("./defaultPrompt");
const getFileContent = require("./getFileContent");

/**
 * Find and load the first .toml config file from the home directory.
 * @returns {Object|null} Parsed configuration data or null if no file is found
 * @throws {Error} if the file exists but can't be parsed as TOML
 */
function loadConfig() {
  const homeDir = os.homedir();
  try {
    // Get all files in the home directory
    const files = fs.readdirSync(homeDir);
    // Filter out .toml files
    const tomlFiles = files.filter(
      (file) => file.endsWith(".toml") && file.startsWith(".")
    );

    // There is no .toml file in the home directory
    if (tomlFiles.length === 0) {
      process.stderr.write(
        `Warning*: No .toml config file found in the home directory
          You need to create a .toml file in your home directory to use the CLI
          Or you need to provide argumnents to the CLI
          Program still running with default configuration for model and temperature\n\n`
      );
      return null;
    }
    // Parse the first .toml file found
    const filePath = path.join(homeDir, tomlFiles[0]);
    const data = fs.readFileSync(filePath, "utf-8");
    return toml.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      // File doesn't exist, ignore and return null
      return null;
    } else {
      // If the file exists but parsing fails, throw an error
      console.error("Failed to parse the TOML config file:", err.message);
      process.exit(1); // Exit the process with an error status
    }
  }
}

// Load configuration from the TOML config if it exists
const config = loadConfig();

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
        process.stderr.write(
          "Debug: No files specified. Please provide at least 1 file. \n"
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
      process.stderr.write(`Debug: temperature: ${finalConfig.temperature}`);
      process.stderr.write(`Debug: model: ${finalConfig.model}`);
    }

    // Combine data if user input multiple files
    const outputData = getFileContent(files, options);

    promptAI(defaultPrompt + outputData, finalConfig.temperature, options);
  });
// Parse command-line arguments
program.parse(process.argv);
