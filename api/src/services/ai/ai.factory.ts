import { AIProvider } from "./ai.interface";
import { GeminiProvider } from "./gemini.provider";

let currentProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!currentProvider) {
    currentProvider = new GeminiProvider();
  }
  return currentProvider;
}
