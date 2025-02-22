import type { LLMProvider, DishAnalysis } from './types';

export class QwenProvider implements LLMProvider {
  private apiKey: string;
  private baseUrl = 'https://dashscope.aliyuncs.com/api/v1';

  constructor() {
    const apiKey = import.meta.env.VITE_QWEN_API_KEY;
    if (!apiKey) {
      throw new Error('Qwen API key is required');
    }
    this.apiKey = apiKey;
  }

  async analyzeMenu(menuText: string): Promise<DishAnalysis[]> {
    try {
      const response = await fetch(`${this.baseUrl}/services/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-max',
          input: {
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
            ]
          },
          parameters: {
            result_format: 'json_object',
            temperature: 0.5,
            top_p: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Qwen API error: ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.output.text);
      return result.dishes || [];
    } catch (error) {
      console.error('Error analyzing menu with Qwen:', error);
      throw new Error('Failed to analyze menu with Qwen');
    }
  }
}