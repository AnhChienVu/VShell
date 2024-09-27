const { Groq } = require("groq-sdk");
const path = require("path");
require("dotenv").config();

// Intergrating with Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Export function to handle Groq-specific prompting
async function promptGroq(prompt, temperature = 0.5, options) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "you are a AI helpful assistant",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature,
      max_tokens: 2048,
      top_p: 1,
      stream: options.stream || false,
    });

    if (options.stream) {
      // Handle streaming response
      const { response, tokenInfo } = await readStream(chatCompletion);

      process.stdout.write("\n");

      return { response, tokenInfo };
    } else {
      // Response from Groq
      const response = chatCompletion.choices[0]?.message?.content || "";

      // Retrieve Token Usage from Response
      const usage = chatCompletion?.usage;
      const promptToken = usage?.prompt_tokens || 0;
      const completionToken = usage?.completion_tokens || 0;
      const totalToken = usage?.total_tokens || 0;
      const tokenInfo = { promptToken, completionToken, totalToken };

      return { response, tokenInfo };
    }
  } catch (error) {
    process.stderr.write(
      `Error: Error processing data with Groq: ${error}. \n`
    );
  }
}

async function readStream(stream) {
  let response = "";
  let tokenInfo;
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
      response += content;
    }

    // The last chunk will contain the usage information
    if (chunk?.x_groq?.usage) {
      // Retrieve Token Usage from Response
      const usage = chunk?.x_groq?.usage;
      const promptToken = usage?.prompt_tokens || 0;
      const completionToken = usage?.completion_tokens || 0;
      const totalToken = usage?.total_tokens || 0;
      tokenInfo = { promptToken, completionToken, totalToken };
    }
  }
  return { response, tokenInfo };
}

module.exports = promptGroq;
