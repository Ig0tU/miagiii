import { z, ZodTypeAny } from 'zod';

export const wireOpenrouterModelsListOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  pricing: z.record(z.string(), z.string()),
  contextLength: z.number(),
  architecture: z.object({
    modality: z.preprocess((val) => val?.toLowerCase(), z.string()).optional(), // optional and case-insensitive
    tokenizer: z.string(),
    instructType: z.string().optional(),
  }),
  topProvider: z.object({
    maxCompletionTokens: z.number().optional(),
    isModerated: z.boolean(),
  }),
  perRequestLimits: z.object({
    promptTokens: z.string(),
    completionTokens: z.string(),
  }).optional(), // optional
});

export type WireOpenrouterModelsListOutput = z.infer<typeof wireOpenrouterModelsListOutputSchema>;
