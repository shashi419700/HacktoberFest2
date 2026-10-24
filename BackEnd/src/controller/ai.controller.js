const aiService = require("../services/ai.service");

// Generate Website Controller
module.exports.generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await aiService(prompt);

    if (!response) {
      return res.status(500).json({ error: "No response from AI service" });
    }

    // ✅ Send clean JSON response
    res.status(200).json({ success: true, code: response });

  } catch (error) {
    console.error("❌ Error in generateWebsite controller:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to generate website. Please try again later.",
    });
  }
};
