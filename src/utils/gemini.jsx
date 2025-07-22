export async function extractStructuredDataFromGemini(rawText, apiKey) {
  const prompt = `
From this hotel voucher text, extract the following fields:
- Guest names
- Booking references
- Hotel name and address
- Check-in/check-out dates
- Number of guests
- Room category, inclusions, and meal plans
- Emergency contact, remarks, policies, etc.

Return your answer as a JSON object.

PDF TEXT:
${rawText}
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  const result = await response.json();

  const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error("Empty response from Gemini.");
  }

  const cleanedJson = textResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedJson);
}
