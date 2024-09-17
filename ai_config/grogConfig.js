const { Groq } = require("groq-sdk");
const path = require("path");
require("dotenv").config();

// Intergrating with Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Export function to handle Groq-specific prompting
async function promptGroq(prompt, temperature = 0.5) {
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
      max_tokens: 1024,
      top_p: 1,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    return response;
  } catch (error) {
    process.stderr.write(`Error: Error processing data with Groq: ${err}. \n`);
  }
}

module.exports = promptGroq;
