export interface DishAnalysis {
  name: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  confidence: number;
  reasoning: string;
  ingredients: string[];
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  results?: DishAnalysis[];
}

export interface ImageFile extends File {
  preview?: string;
}