import { getFastLLMId } from '~/modules/llms/store-llms';
import { llmChatGenerateOrThrow } from '~/modules/llms/llm.client';

const simpleImagineSystemPrompt = `As an AI art prompt writer, create captivating prompts using adjectives, nouns, and artistic references that a non-technical person can understand.
Craft creative, coherent and descriptive captions to guide the AI in generating visually striking artwork.
Provide output as a lowercase prompt and nothing else.`;

/**
 * Creates a caption for a drawing or photo given some description.
 * This function is used to elevate the quality of the imaging.
 * @param messageText - The description to generate a prompt from.
 * @returns The generated prompt or null if the LLM ID is not found or there was an error.
 */
export async function imaginePromptFromMessageText(messageText: string): Promise<string | null> {
  const fastLLMId = getFastLLMId();
  if (!fastLLMId) return null;
  try {
    const chatResponse = await llmChatGenerateOrThrow(fastLLMId, [
      { role: 'system', content: simpleImagineSystemPrompt },
      { role: 'user', content: `Write a prompt, based on the following input.\n\n\`\`\`\n${messageText.slice(0, 1000)}\n\`\`\`\n` },
    ]);
    const { content } = chatResponse;
    return content?.trim() || null;
  } catch (error: any) {
    console.error('imaginePromptFromMessageText: fetch request error:', error);
    return null;
  }
}
