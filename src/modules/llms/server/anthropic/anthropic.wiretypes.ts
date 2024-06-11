import { z } from 'zod';

const anthropicWireTextBlockSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

const anthropicWireImageBlockSchema = z.object({
  type: z.literal('image'),
  source: z.object({
    type: z.literal('base64'),
    media_type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    data: z.string(),
  }),
});

const anthropicWireContentSchema = z.union([
  anthropicWireTextBlockSchema,
  anthropicWireImageBlockSchema,
]);

const anthropicWireMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.array(anthropicWireContentSchema),
});

const anthropicWireMessagesSchema = z.array(anthropicWireMessageSchema);

const anthropicWireMessagesRequestSchema = z.object({
  model: z.string(),
  system: z.string().optional(),
  messages: anthropicWireMessagesSchema
    .refine((messages) => {
      if (messages.length === 0 || messages[0].role !== 'user') return false;
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === messages[i - 1].role) return false;
      }
      return true;
    }, { message: `messages must alternate between User and Assistant roles, starting with the User role` }),
  max_tokens: z.number(),
  metadata: z.object({
    user_id: z.string().optional(),
  }).optional(),
  stop_sequences: z.array(z.string()).optional(),
  stream: z.boolean().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
});

const anthropicWireMessagesResponseSchema = z.object({
  id: z.string(),
  type: z.literal('message'),
  role: z.literal('assistant'),
  content: z.array(anthropicWireTextBlockSchema),
  model: z.string(),
  stop_reason: z.enum(['end_turn', 'max_tokens', 'stop_sequence']).nullable(),
  stop_sequence: z.string().nullable(),
  usage: z.object({
    input_tokens: z.number(),
    output_tokens: z.number(),
  }),
});

export type AnthropicWireMessagesRequest = z.infer<typeof anthropicWireMessagesRequestSchema>;
export type AnthropicWireMessagesResponse = z.infer<typeof anthropicWireMessagesResponseSchema>;
