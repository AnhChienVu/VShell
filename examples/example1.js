#!/usr/bin/env node
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { Groq } = require("groq-sdk");
require("dotenv").config();
const promptAI = require("./ai");
const defaultPrompt = require("./defaultPrompt");
const getFileContent = require("./getFileContent");

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
  .option("-m, --model", "specify the model to use")
  .option(
    "-t, --token-usage",
    "specify the usage of token for prompt and response"
  )
  .option(
    "-T, --temperature <number>",
    "set the temperature for the model (Groq)",
    parseFloat,
    process.env.GROQ_TEMPERATURE
      ? parseFloat(process.env.GROQ_TEMPERATURE)
      : 0.7
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
