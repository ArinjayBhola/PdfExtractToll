export async function extractStructuredDataFromGemini(rawText, apiKey) {
  const prompt = `
Extract the following fields from the hotel voucher text below:

- Hotel Name
- Contact
- Hotel Confirmation
- Address
- Booking Date
- Guest Name
- Child
- Adults
- Check in
- Check out
- Nights
- Rooms
- Room Category
- Inclusions

Return the result as a JSON object with each field clearly labeled. Do not add extra fields. Only extract these exact fields.


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
