const fs = require("fs");
const os = require("os");
const configHandler = require("./configHandler");

jest.mock("fs");
jest.mock("path");
jest.mock("os");
jest.mock("./handleDebugMessage");

describe("Test the ConfigHandler class", () => {
  beforeEach(() => {
    os.homedir.mockReturnValue("/mock/home/dir");
    configHandler.homeDir = os.homedir(); // Ensure homeDir is set correctly
  });

  describe("Test the getTomlFiles function", () => {
    test("should return an empty array when there are no .toml files", () => {
      fs.readdirSync.mockReturnValue(["file1.txt", "file2.json"]);
      const result = configHandler.getTomlFiles();
      expect(result).toEqual([]);
    });

    test("should return an array of .toml files", () => {
      fs.readdirSync.mockReturnValue([".file1.toml", ".file2.toml"]);
      const result = configHandler.getTomlFiles();
      expect(result).toEqual([".file1.toml", ".file2.toml"]);
    });
  });

  describe("Test the loadConfig function", () => {
    test("should return null when there are no .toml files", () => {
      fs.readdirSync.mockReturnValue(["file1.txt", "file2.json"]);
      const result = configHandler.loadConfig([]);
      expect(result).toBeNull();
    });

    test("should return parsed config from the first .toml file when there are list of .toml files exist", () => {
      const tomlFiles = [".config1.toml", ".config2.toml"];

      fs.readdirSync.mockReturnValue(tomlFiles);
      fs.readFileSync.mockReturnValue("model = 'llama3-8b-8192'");

      const result = configHandler.loadConfig(tomlFiles);
      expect(result).toEqual({ model: "llama3-8b-8192" });
    });

    test("should return null if the file doesn't exist (ENOENT error)", () => {
      const tomlFiles = [".config1.txt", ".config2.json"];

      fs.readFileSync.mockImplementation(() => {
        const error = new Error("File not found");
        error.code = "ENOENT";
        throw error;
      });

      const result = configHandler.loadConfig(tomlFiles);
      expect(result).toBeNull();
    });

    test("should exit process with code 1 when file exists but parsing fails", () => {
      const tomlFiles = [".config1.toml", ".config2.toml"];

      fs.readFileSync.mockReturnValue("model : 'llama3-8b-8192'");
      fs.readFileSync.mockImplementation(() => {
        const error = new Error("Parsing Error");
        throw error;
      });

      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

      const result = configHandler.loadConfig(tomlFiles);
      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });
  });
});
