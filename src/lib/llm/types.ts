export interface LLMProvider {
  analyzeMenu(menuText: string): Promise<DishAnalysis[]>;
}

export interface DishAnalysis {
  name: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  confidence: number;
  reasoning: string;
  ingredients: string[];
}