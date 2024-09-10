const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { Groq } = require("groq-sdk");
require("dotenv").config();
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
    "-t, --temperature <number>",
    "set the temperature for the model (Groq)",
    parseFloat,
    process.env.GROQ_TEMPERATURE || 0.2
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

    // Process each file in argurment list
    const results = files.map((file) => {
      // convert a file path to an absolute path
      const filePath = path.resolve(file);

      // Log debug information
      if (options.debug) {
        process.stderr.write(`Debug: Resolving file path: ${filePath}. \n`);

        if (!fs.existsSync(filePath)) {
          process.stderr.write(`Error: File not found: ${filePath}. \n`);
          process.exit(1);
        }
        if (fs.statSync(filePath).isDirectory()) {
          process.stderr.write(`Error: Path is a directory: ${filePath}. \n`);
          process.exit(1);
        }
        process.stderr.write(`Debug: Processing file: ${filePath}. \n`);
      }

      return fs.readFileSync(filePath, "utf-8");
    });

    // Combine data if user input multiple files
    const outputData = results.join("\n");

    try {
      // Process the data using Groq
      const processedDataUsingGroq = await getGroqChatCompletion(
        outputData,
        options
      );

      // Write the output to a file or stdout
      if (options.output) {
        if (options.debug) {
          process.stderr.write(
            `Debug: Output will be written to: ${options.output}`
          );
        }
        fs.writeFileSync(path.resolve(options.output), processedDataUsingGroq);
      } else {
        process.stdout.write(processedDataUsingGroq);
      }
    } catch (err) {
      process.stderr.write(
        `Error: Error processing data with Groq: ${err}. \n`
      );
    }
  });

// Intergrating with Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(data, options) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: data,
      },
    ],
    model: "llama3-8b-8192",
    temperature: options.temperature || process.env.GROQ_TEMPERATURE,
  });
  return chatCompletion.choices[0]?.message?.content || "";
}

// Parse command-line arguments
program.parse(process.argv);
