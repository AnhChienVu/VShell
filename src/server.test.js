jest.mock("./ai");
jest.mock("./getFileContent");
jest.mock("./utils/configHandler");
jest.mock("./utils/handleDebugMessage");
jest.mock("./defaultPrompt", () => "default prompt text");

const mockProgram = {
  name: jest.fn().mockReturnThis(),
  version: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  arguments: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
  parse: jest.fn().mockReturnThis(),
  opts: jest.fn().mockReturnValue({}),
};

jest.mock("commander", () => ({
  Command: jest.fn(() => mockProgram),
}));

describe("Testing server.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    const ConfigHandler = require("./utils/configHandler");
    ConfigHandler.getTomlFiles.mockReturnValue(["config.toml"]);
    ConfigHandler.loadConfig.mockReturnValue({
      model: "default-model",
      temperature: 0.7,
    });

    jest.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up module cache after each test
    jest.resetModules();
  });

  test("should set up CLI information", () => {
    require("./server");
    expect(mockProgram.name).toHaveBeenCalled();
    expect(mockProgram.version).toHaveBeenCalled();
    expect(mockProgram.description).toHaveBeenCalled();
  });

  test("should use default values when no config file exists", () => {
    // Testing with model="llama3-8b-8192" and temperature=0.7
    const ConfigHandler = require("./utils/configHandler");
    ConfigHandler.loadConfig.mockReturnValue({});
    require("./server");

    const optionCalls = mockProgram.option.mock.calls;
    const modelCall = optionCalls.find((call) => call[0] === "-m, --model");
    const temperatureCall = optionCalls.find(
      (call) => call[0] === "-T, --temperature <number>",
    );
    expect(modelCall[2]).toBe("llama3-8b-8192");
    expect(temperatureCall[3]).toBe(0.7);
  });

  test("should exit when no files are provided with debug enabled", async () => {
    mockProgram.opts.mockReturnValue({ debug: true });
    require("./server");

    const actionHandler = mockProgram.action.mock.calls[0][0];
    await actionHandler([]);

    const handleDebugMessage = require("./utils/handleDebugMessage");
    expect(handleDebugMessage).toHaveBeenCalledWith(
      "No files specified. Please provide at least 1 file.",
      "Debug",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test("should process files and call promptAI", async () => {
    const getFileContent = require("./getFileContent");
    const promptAI = require("./ai");
    require("./server");

    const mockFiles = ["file1.txt"];
    const mockOptions = {
      model: "test-model",
      temperature: 0.8,
      debug: true,
    };

    mockProgram.opts.mockReturnValue(mockOptions);
    getFileContent.mockReturnValue("file content");
    const actionHandler = mockProgram.action.mock.calls[0][0];
    await actionHandler(mockFiles);

    expect(getFileContent).toHaveBeenCalledWith(mockFiles, mockOptions);
    // Written as per current implementation i.e. defaultPrompt + outputData
    expect(promptAI).toHaveBeenCalledWith(
      "default prompt textfile content",
      0.8,
      mockOptions,
    );
  });
});
