const fetch = require("node-fetch");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const buildPrompt = (emailText) => `
You are a subscription email parser for an app called TrackWise.

Read the email/SMS text below and extract subscription details.

Return ONLY a valid JSON object with these exact fields:
{
  "serviceName": string,
  "amount": number,
  "currency": string,
  "billingCycle": string,
  "startDate": string or null,
  "renewalDate": string or null,
  "category": string,
  "confidence": "high" | "medium" | "low"
}

Rules:
- currency: 3-letter code like "INR", "USD", "EUR"
- billingCycle: exactly "monthly" or "yearly"
- dates: ISO format YYYY-MM-DD or null
- category: one of "Entertainment", "Productivity", "Health", "Education", "Shopping", "Other"
- Output ONLY the JSON. No markdown, no explanation, no preamble.

EMAIL TEXT:
"""
${emailText}
"""
`;

exports.parseSubscriptionEmail = async (req, res) => {
  try {
    const { emailText } = req.body;

    if (!emailText || emailText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Email text is too short.",
      });
    }

    if (emailText.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Email text is too long (max 10,000 characters).",
      });
    }

   const response = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": "http://localhost:8000",
    "X-Title": "TrackWise"
  },
  body: JSON.stringify({
model: "openrouter/free",
    messages: [
      { role: "user", content: buildPrompt(emailText) }
    ],
  }),
});

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API error:", errData);
      return res.status(500).json({
        success: false,
        message: "AI service error. Try again.",
      });
    }

   const openRouterData = await response.json();
const rawText = openRouterData?.choices?.[0]?.message?.content || "";

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error("JSON parse failed. Raw output:", rawText);
      return res.status(500).json({
        success: false,
        message: "Could not understand the email. Try adding manually.",
      });
    }

    if (!parsed.serviceName || !parsed.amount) {
      return res.status(422).json({
        success: false,
        message: "Could not find subscription details. Please add manually.",
        data: parsed,
      });
    }

    return res.status(200).json({ success: true, data: parsed });

  } catch (err) {
    console.error("parseEmail error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};