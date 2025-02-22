import type { LLMProvider, DishAnalysis } from './types';

export class DeepseekProvider implements LLMProvider {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor() {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('Deepseek API key is required');
    }
    this.apiKey = apiKey;
  }

  async analyzeMenu(menuText: string): Promise<DishAnalysis[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
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
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Deepseek API error: ${response.status} ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ''
          }`
        );
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from Deepseek API');
      }

      let parsedContent;
      try {
        parsedContent = JSON.parse(data.choices[0].message.content);
      } catch (e) {
        throw new Error('Failed to parse Deepseek API response as JSON');
      }

      if (!Array.isArray(parsedContent?.dishes)) {
        throw new Error('Invalid response format: missing dishes array');
      }

      return parsedContent.dishes;
    } catch (error) {
      console.error('Error analyzing menu with Deepseek:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze menu with Deepseek');
    }
  }
}