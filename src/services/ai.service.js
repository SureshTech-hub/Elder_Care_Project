const ai = require("../config/gemini");

exports.generateAIResponse = async (prompt) => {
  if (!ai) {
    return {
      success: false,
      response:
        "AI service is not configured. Please add GEMINI_API_KEY.",
    };
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return {
      success: true,
      response: result.text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);

    return {
      success: false,
      response: "Unable to generate AI response.",
    };
  }
};