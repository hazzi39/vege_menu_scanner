import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider, DishAnalysis } from './types';

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async analyzeMenu(menuText: string): Promise<DishAnalysis[]> {
    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze these menu items and determine which are vegetarian/vegan. Return ONLY the JSON object with no markdown formatting or code blocks:
      {
        "dishes": [
          {
            "name": "Dish Name",
            "is_vegetarian": true,
            "is_vegan": false,
            "confidence": 95,
            "reasoning": "Brief explanation",
            "ingredients": ["ingredient1", "ingredient2"]
          }
        ]
      }
      
      Menu text:
      ${menuText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Remove any markdown code block formatting if present
      text = text.replace(/```json\n?|\n?```/g, '');
      
      try {
        const parsedResult = JSON.parse(text);
        if (!parsedResult.dishes || !Array.isArray(parsedResult.dishes)) {
          throw new Error('Invalid response format: missing dishes array');
        }
        return parsedResult.dishes;
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Invalid JSON response from Gemini');
      }
    } catch (error) {
      console.error('Error analyzing menu with Gemini:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze menu with Gemini');
    }
  }
}