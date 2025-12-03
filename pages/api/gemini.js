import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      try {
        const result = await model.generateContent(prompt);
        const responseText = (await result.response).text();
        console.log('Raw Gemini API response:', responseText);
        res.status(200).json({ text: responseText });
      } catch (error) {
        console.error('Gemini API content generation error:', error);
        if (error.response && error.response.promptFeedback) {
          console.error('Prompt feedback:', error.response.promptFeedback);
        }
        res.status(500).json({ error: 'Failed to generate content from Gemini API.', details: error.message });
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      res.status(500).json({ error: 'Failed to get response from Gemini API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}