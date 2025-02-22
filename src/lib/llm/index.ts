import type { LLMProvider } from './types';
import { GeminiProvider } from './gemini';
import { DeepseekProvider } from './deepseek';

export type LLMProviderType = 'gemini' | 'deepseek';

export function createLLMProvider(type: LLMProviderType): LLMProvider {
  switch (type) {
    case 'gemini':
      return new GeminiProvider();
    case 'deepseek':
      return new DeepseekProvider();
    default:
      throw new Error(`Unsupported LLM provider: ${type}`);
  }
}

export { type LLMProvider, type DishAnalysis } from './types';