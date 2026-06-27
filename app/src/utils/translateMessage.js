const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
export async function translateMessage(text) {
  const prompt = `Detect the language of this text. If it's Danish, translate to English. If it's English, translate to Danish. Return only the translated text, nothing else. Text: "${text}"`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Google API Error Details:", errorDetails);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}
