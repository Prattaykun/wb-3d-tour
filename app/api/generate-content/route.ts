// pages/api/generate-content.ts
import { NextApiRequest, NextApiResponse } from "next";
import { textModel } from "@/lib/gemini";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const prompt = `
      Generate travel content about "${query}".
      Include places, hotels, events, artisans, or products.
      Return ONLY valid JSON array of objects, nothing else.
      Each object must have:
      - id (string, unique)
      - type ("place" | "hotel" | "event" | "artisan" | "product")
      - name (string)
      - description (string)
      - location (string)
      - image (string URL)
    `;

    const result = await textModel.generateContent(prompt);

    // Gemini sometimes nests output differently
    const response = await result.response;
    const text = response.text();

    let generatedContent: any[] = [];

    try {
      generatedContent = JSON.parse(text);
    } catch (err) {
      console.warn("Gemini returned non-JSON. Wrapping raw text.");
      generatedContent = [
        {
          id: "gen-1",
          type: "info",
          name: query,
          description: text,
          location: "",
          image: "",
        },
      ];
    }

    res.status(200).json({ content: generatedContent });
  } catch (error: any) {
    console.error("Error generating content:", error?.message || error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}
