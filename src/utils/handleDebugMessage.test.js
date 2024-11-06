const handleDebugMessage = require("./handleDebugMessage");

describe("Test the handleDebugMessage function", () => {
  beforeEach(() => {
    jest.spyOn(process.stderr, "write").mockImplementation(() => {});
  });
  afterEach(() => {
    process.stderr.write.mockRestore();
  });

  test("should write the correct message to stderr", () => {
    const message = "Test debug message";
    const option = "DEBUG";

    handleDebugMessage(message, option);

    expect(process.stderr.write).toHaveBeenCalledWith(
      `${option}: ${message}\n`,
    );
  });
});
