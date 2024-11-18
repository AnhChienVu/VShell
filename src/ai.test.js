const promptAI = require("./ai");
const { promptGroq } = require("./ai_config/grogConfig");
const handleDebugMessage = require("./utils/handleDebugMessage");
const handleOutputFile = require("./utils/handleOutputFile");

jest.mock("./ai_config/grogConfig", () => ({
  promptGroq: jest.fn(),
}));
jest.mock("./utils/handleDebugMessage", () => {
  return jest.fn();
});
jest.mock("./utils/handleOutputFile", () => {
  return jest.fn();
});

describe("Testing ai.js", () => {
  test("return a parsed temperature properly", async () => {
    promptGroq.mockResolvedValue({
      response: "AI response",
      tokenInfo: "Token Info",
    });

    await promptAI("test prompt", "0.5", {});

    expect(handleDebugMessage).toHaveBeenCalledWith(
      "Prompting AI with temperature: 0.5.",
      "Info",
    );
  });

  test("should throw error if parsed temperature is NaN type", async () => {
    await expect(promptAI("test prompt", "invalid", {})).rejects.toThrow(
      "Error: Temperature must be a number.",
    );
  });

  test("should handle ouput file if options.output is provided", async () => {
    promptGroq.mockResolvedValue({
      response: "AI response",
      tokenInfo: "Token Info",
    });

    await promptAI("test prompt", "0.5", { output: "output.txt" });

    expect(handleDebugMessage).toHaveBeenCalledWith(
      "Output file: output.txt.",
      "Info",
    );

    expect(handleOutputFile).toHaveBeenCalledWith("AI response", "output.txt");
  });

  test("should throw error if initializeModel() function throws error", async () => {
    promptGroq.mockRejectedValue("Error");

    await expect(promptAI("test prompt", "0.5", {})).rejects.toThrow("Error");
  });

  test("should return token info", async () => {
    const logSpy = jest.spyOn(console, "log");
    promptGroq.mockResolvedValue({
      response: "AI response",
      tokenInfo: "Token Info",
    });

    await promptAI("test prompt", "0.5", {});
    expect(logSpy).toHaveBeenCalledWith("Token Info");
  });
});
