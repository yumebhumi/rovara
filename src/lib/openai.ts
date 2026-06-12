import "server-only";
import OpenAI from "openai";

let _client: OpenAI | null = null;

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIConfigurationErrorMessage() {
  return "AI itinerary generation is not configured for this environment yet. Add a valid OPENAI_API_KEY to continue.";
}

export function getOpenAIClient(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new Error(getOpenAIConfigurationErrorMessage());
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}
