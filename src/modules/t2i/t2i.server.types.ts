import { ZodArray, ZodObject, z } from 'zod';

// Image generation output

interface IT2iCreateImageOutput {
  // one of these two will be present
  imageUrl?: string;
  base64ImageDataUrl?: string;

  // could be the revised prompt, or an alt textual description of the image
  altText: string;

  // optional
  elapsed?: number;
}

const t2iCreateImageOutputSchema = ZodObject<IT2iCreateImageOutput>({
  // one of these two will be present
  imageUrl: z.string().optional(),
  base64ImageDataUrl: z.string().optional(),

  // could be the revised prompt, or an alt textual description of the image
  altText: z.string(),

  // optional
  elapsed: z.number().optional(),
});

export const t2iCreateImagesOutputSchema = ZodArray(t2iCreateImageOutputSchema);
