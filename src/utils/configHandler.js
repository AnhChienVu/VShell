/* eslint-disable no-undef */
const os = require("os");
const fs = require("fs");
const toml = require("smol-toml");
const path = require("path");

const handleDebugMessage = require("./handleDebugMessage");

// Class to handle .toml configuration files in the home directory
class ConfigHandler {
  constructor() {
    this.homeDir = os.homedir();
  }

  getTomlFiles() {
    // Get all files in the home directory
    const files = fs.readdirSync(this.homeDir);

    // Filter out .toml files
    const tomlFiles = files.filter(
      (file) => file.endsWith(".toml") && file.startsWith("."),
    );
    return tomlFiles;
  }

  loadConfig(tomlFiles) {
    try {
      // There is no .toml file in the home directory
      if (tomlFiles.length === 0) {
        handleDebugMessage(
          ` No .toml config file found in the home directory
            You need to create a .toml file in your home directory to use the CLI
            Or you need to provide argumnents to the CLI
            Program still running with default configuration for model and temperature`,
          "Warning",
        );
        return null;
      }

      // Parse the first .toml file found
      const filePath = path.join(this.homeDir, tomlFiles[0]);
      const data = fs.readFileSync(filePath, "utf-8");

      return toml.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") {
        // File doesn't exist, ignore and return null
        return null;
      } else {
        // If the file exists but parsing fails, throw an error
        handleDebugMessage(
          `Failed to parse the TOML config file: ${err.message}`,
          "Error",
        );
        process.exit(1); // Exit the process with an error status
      }
    }
  }
}

module.exports = new ConfigHandler();
