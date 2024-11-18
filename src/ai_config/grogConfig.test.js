const nock = require("nock");
const { promptGroq, readStream } = require("./grogConfig.js");
const handleDebugMessage = require("../utils/handleDebugMessage");

jest.mock("../utils/handleDebugMessage");

describe("Test the grogConfig file", () => {
  beforeEach(() => {
    jest.resetModules(); // Clear cached modules
    nock.cleanAll();
    // jest.clearAllMocks(); // Clear all mock data
  });

  afterEach(() => {
    nock.cleanAll();
    jest.resetModules();
    // jest.clearAllMocks();
  });

  test("should return the expected response from the LLM", async () => {
    const mockResponse = {
      id: "chatcmpl-0b910ec8-e9d9-4095-99ed-1311b8efcf39",
      object: "chat.completion",
      created: 1730865897,
      model: "llama3-8b-8192",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a test response from the LLM.",
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        queue_time: 0.003401526000000002,
        prompt_tokens: 300,
        prompt_time: 0.079328471,
        completion_tokens: 500,
        completion_time: 0.215833333,
        total_tokens: 800,
        total_time: 0.295161804,
      },
      system_fingerprint: "fp_a97cfe35ae",
      x_groq: { id: "req_01jbztb85cf4nv71cyjd6pms9w" },
    };

    nock("https://api.groq.com/openai")
      .post("/v1/chat/completions")
      .reply(200, mockResponse);

    const prompt = "Test prompt";
    const options = { model: "llama3-8b-8192", stream: false };
    const result = await promptGroq(prompt, 0.5, options);

    expect(result.response).toBe(mockResponse.choices[0].message.content);
    expect(result.tokenInfo).toEqual({
      promptToken: 300,
      completionToken: 500,
      totalToken: 800,
    });
  });

  // test("should return the streaming response from the LLM", async () => {
  //   jest.doMock("groq-sdk", () => {
  //     return {
  //       Groq: jest.fn().mockImplementation(() => ({
  //         chat: {
  //           completions: {
  //             create: jest.fn().mockImplementation(() => {
  //               // Simulate the stream response with async iterator
  //               const mockStream = {
  //                 [Symbol.asyncIterator]: jest
  //                   .fn()
  //                   .mockImplementation(async function* () {
  //                     // Yield the chunks
  //                     yield {
  //                       choices: [
  //                         {
  //                           delta: {
  //                             content: "This is a test response from the LLM.",
  //                           },
  //                         },
  //                       ],
  //                     };

  //                     yield {
  //                       choices: [
  //                         { delta: { content: " More content from the LLM." } },
  //                       ],
  //                     };

  //                     // Last chunk contains the usage info
  //                     yield {
  //                       x_groq: {
  //                         usage: {
  //                           prompt_tokens: 300,
  //                           completion_tokens: 500,
  //                           total_tokens: 800,
  //                         },
  //                       },
  //                     };

  //                     return { done: true }; // End the stream
  //                   }),
  //               };

  //               return mockStream;
  //             }),
  //           },
  //         },
  //       })),
  //     };
  //   });

  //   // 2. Reset modules to ensure the mock is applied.
  //   jest.resetModules();
  //   // Import the actual code under test (after the mock is set up)
  //   const promptGroq = require("./grogConfig");
  //   const prompt = "Test prompt";
  //   const options = { model: "llama3-8b-8192", stream: true };

  //   // Call `promptGroq`, which uses the mocked `groq` instance
  //   const result = await promptGroq(prompt, 0.5, options);
  //   console.log("Streaming result:", result);
  //   // Verify the streaming response was accumulated correctly
  //   expect(result.response).toBe(
  //     "This is a test response from the LLM. More content from the LLM.",
  //   );
  //   // Verify token information
  //   expect(tokenInfo).toEqual({
  //     promptToken: 300,
  //     completionToken: 500,
  //     totalToken: 800,
  //   });
  // });

  test("should handle errors gracefully", async () => {
    const errorMessage =
      "Error processing data with Groq: Error: Connection error..";

    nock("https://api.groq.com/openai")
      .post("/v1/chat/completions")
      .replyWithError("Test error");

    const prompt = "Test prompt";
    const options = { model: "llama3-8b-8192", stream: false };
    const result = await promptGroq(prompt, 0.5, options);

    expect(handleDebugMessage).toHaveBeenCalledWith(errorMessage, "Error");
    // expect(result).toEqual({
    //   response: "",
    //   tokenInfo: { promptToken: 0, completionToken: 0, totalToken: 0 },
    // });
  });

  test("should return an object with response and tokenInfo properties", async () => {
    // Mock the stream
    const stream = [
      { choices: [{ delta: { content: "Hello" } }] },
      {
        choices: [{ delta: { content: " World" } }],
        x_groq: {
          usage: {
            queue_time: 0.001,
            prompt_tokens: 300,
            prompt_time: 0.046,
            completion_tokens: 500,
            completion_time: 0.203,
            total_tokens: 800,
            total_time: 0.25,
          },
        },
      },
    ];

    // Call the readStream function
    const result = await readStream(stream);

    // Assert the result
    expect(result.response).toBe("Hello World");
    expect(result.tokenInfo).toEqual({
      completionToken: 500,
      promptToken: 300,
      totalToken: 800,
    });
  });

  test("should return empty response and token info if stream is empty", async () => {
    // Empty mock stream
    const emptyStream = null;

    const result = await readStream(emptyStream);

    expect(result.response).toBe("");
    expect(result.tokenInfo).toBeUndefined(); // Token info will be undefined in case of an empty stream
  });
});
