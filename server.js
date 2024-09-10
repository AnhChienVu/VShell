const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const program = new Command();

// Define CLI's name
const CLI_NAME = "VShell";
program.name(CLI_NAME);

//versioning CLI
const CLI_VERSION = "0.0.1";
program.version(CLI_VERSION);
program
  .option("-d, --debug", "output extra debugging")
  .option("-u, --update", "update to the latest version");

// Define a command to handle file inputs
program
  .description("Process one or more files")
  .option("-o, --output <file>", "Specifying output file")
  .arguments("[files...]")
  .action((files) => {
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

    const outputData = results.join("\n");

    if (options.output) {
      if (options.debug) {
        process.stderr.write(
          `Debug: Output will be written to: ${options.output}`
        );
      }
      fs.writeFileSync(path.resolve(options.output), outputData);
    } else {
      process.stdout.write(outputData);
    }
  });

// Parse command-line arguments
program.parse(process.argv);
