import OpenAI from 'openai';
import type { LLMProvider, DishAnalysis } from './types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async analyzeMenu(menuText: string): Promise<DishAnalysis[]> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a culinary expert specializing in dietary requirements. Analyze menu items to determine if they are vegetarian or vegan.
            For each dish, provide:
            - Whether it's vegetarian and/or vegan
            - Confidence level (%)
            - Reasoning
            - Likely ingredients
            Be conservative with vegan classification - if in doubt, mark as vegetarian only.
            Return the analysis in the exact JSON format provided in the example.`
          },
          {
            role: "user",
            content: `Analyze these menu items and determine which are vegetarian/vegan. Return in this exact format:
            {
              "dishes": [
                {
                  "name": "Dish Name",
                  "is_vegetarian": true/false,
                  "is_vegan": true/false,
                  "confidence": 95,
                  "reasoning": "Brief explanation",
                  "ingredients": ["ingredient1", "ingredient2"]
                }
              ]
            }
            
            Menu text:
            ${menuText}`
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.dishes || [];
    } catch (error) {
      console.error('Error analyzing menu with OpenAI:', error);
      throw new Error('Failed to analyze menu with OpenAI');
    }
  }
}