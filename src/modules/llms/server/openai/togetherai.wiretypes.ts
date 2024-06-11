import { z } from 'zod';

// Type aliases for clarity and easier typing in the IDE
type ModelId = string;
type Timestamp = number;

// Defining the shape of a single model object
const modelSchema = z.object({
  id: z.string(),
  object: z.literal('model'),
  created: z.number(),
});

// Creating a type alias for a single model
export type Model = z.infer<typeof modelSchema>;

// Defining the response schema for the list of models
export const wireTogetherAIListOutputSchema = z.array(modelSchema);

// Creating a type alias for the list of models
export type WireTogetherAIListOutput = z.infer<typeof wireTogetherAIListOutputSchema>;
