const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 4000,
    responseMimeType: "application/json",
  },
});

module.exports = { model };
