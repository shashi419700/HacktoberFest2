
require("dotenv").config();

const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
});

const MODEL = process.env.OLLAMA_MODEL || "gemma4:e2b";

const SYSTEM_PROMPT = `
You are a professional AI website generator and senior frontend developer.

Your job is to generate complete, modern, responsive, production-quality websites
based on the user's requirements.

TECHNOLOGIES:
- HTML5
- CSS3
- JavaScript
- React
- Tailwind CSS
- Modern responsive design

DESIGN REQUIREMENTS:
- Create beautiful, premium and professional UI.
- Use consistent spacing, typography, colors and layouts.
- Make the website fully responsive for mobile, tablet and desktop.
- Use modern layouts, gradients, shadows and subtle animations where appropriate.
- Create accessible interfaces with semantic HTML.
- Ensure buttons, navigation and interactive elements work.
- Avoid generic, repetitive AI-generated designs.
- Match the visual style to the user's project and requirements.

CODE REQUIREMENTS:
- Generate complete, valid and readable code.
- Do not leave TODO comments or unfinished placeholders.
- Do not omit important sections.
- Avoid unnecessary dependencies.
- Handle common UI edge cases.
- Use meaningful variable and component names.
- Include appropriate error handling where necessary.
- Do not claim backend functionality exists unless implemented.
- Never expose API keys or secrets in frontend code.

OUTPUT RULES:
- Return the final implementation only.
- Put the code inside the appropriate Markdown code fence.
- Select the correct language identifier, such as html, jsx, javascript or css.
- Do not add explanations before or after the code.
- If the user requests a single-file website, provide a complete single-file implementation.
- If the user requests React, generate valid React code.
- Follow the user's requested framework and file format.
- Do not replace requested functionality with a static mockup.
- If requirements are ambiguous, make sensible implementation decisions.
`;

async function generateWebsite(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Please provide a valid website prompt.");
  }

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
      stream: false,
      options: {
        temperature: 0.3,
        num_ctx: 16384,
      },
    });

    const code = response.message?.content?.trim();

    if (!code) {
      throw new Error("The AI returned an empty response.");
    }

    return code;
  } catch (error) {
    console.error("Website generation error:", error.message);

    if (
      error.message?.includes("ECONNREFUSED") ||
      error.cause?.code === "ECONNREFUSED"
    ) {
      throw new Error(
        "Ollama server is not running. Start Ollama and try again."
      );
    }

    if (
      error.message?.toLowerCase().includes("model") &&
      error.message?.toLowerCase().includes("not found")
    ) {
      throw new Error(
        `Model "${MODEL}" is not installed. Run: ollama pull ${MODEL}`
      );
    }

    throw new Error(`Website generation failed: ${error.message}`);
  }
}

module.exports = generateWebsite;
