import { z, ZodTypeAny } from 'zod';

// Define a type for nullable fields
type Nullable<T> = T | null;

// [Mistral] Models List API - Response

export const wireMistralModelsListOutputSchema = z.object({
  id: z.string(),
  object: z.literal('model'),
  created: z.number(),
  owned_by: z.string(),
  root: z.null(),
  parent: z.null(),
  permissions: z.lazy(() =>
    z.array(wireMistralModelsListPermissionsSchema)
  ),
});

export type WireMistralModelsListOutput = z.infer<typeof wireMistralModelsListOutputSchema>;

// [Mistral] Model Permission API - Response

const wireMistralModelsListPermissionsSchema = z.object({
  id: z.string(),
  object: z.literal('model_permission'),
  created: z.number(),
  allowCreateEngine: z.boolean(),
  allowSampling: z.boolean(),
  allowLogprobs: z.boolean(),
  allowSearchIndices: z.boolean(),
  allowView: z.boolean(),
  allowFineTuning: z.boolean(),
  organization: z.string(),
  group: z.null(),
  isBlocking: z.boolean(),
});

export type WireMistralModelsListPermissions = ZodTypeAny & {
  allowCreateEngine: boolean;
  allowSampling: boolean;
  allowLogprobs: boolean;
  allowSearchIndices: boolean;
  allowView: boolean;
  allowFineTuning: boolean;
};
