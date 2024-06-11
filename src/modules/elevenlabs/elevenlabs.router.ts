import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { env } from '~/server/env';
import { fetchJsonOrTRPCError } from '~/server/api/trpc.router.fetchers';

export const speechInputSchema = z.object({
  elevenKey: z.string().optional(),
  text: z.string(),
  voiceId: z.string().optional(),
  nonEnglish: z.boolean(),
  streaming: z.boolean().optional(),
  streamOptimization: z.number().optional(),
});

export type SpeechInputSchema = z.infer<typeof speechInputSchema>;

const listVoicesInputSchema = z.object({
  elevenKey: z.string().optional(),
});

const voiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  previewUrl: z.string().nullable(),
  category: z.string(),
  default: z.boolean(),
});

export type VoiceSchema = z.infer<typeof voiceSchema>;

const listVoicesOutputSchema = z.object({
  voices: z.array(voiceSchema),
});

export const elevenlabsRouter = createTRPCRouter({
  listVoices: publicProcedure
    .input(listVoicesInputSchema)
    .output(listVoicesOutputSchema)
    .query(async ({ input }) => {
      const { elevenKey } = input;
      const { headers, url } = elevenlabsAccess(elevenKey, '/v1/voices');

      const voicesList = await fetchJsonOrTRPCError<ElevenlabsWire.VoicesList>(url, 'GET', headers);

      // bring category != 'premade' to the top
      voicesList.voices.sort((a, b) => {
        if (a.category === 'premade' && b.category !== 'premade') return 1;
        if (a.category !== 'premade' && b.category === 'premade') return -1;
        return 0;
      });

      return {
        voices: voicesList.voices.map((voice) => ({
          id: voice.voice_id,
          name: voice.name,
          description: voice.description,
          previewUrl: voice.preview_url,
          category: voice.category,
          default: true, // assuming the first voice is the default voice
        })),
      };
    }),
});

function elevenlabsAccess(elevenKey: string | undefined, apiPath: string) {
  elevenKey = (elevenKey || env.ELEVENLABS_API_KEY || '').trim();
  if (!elevenKey) throw new Error('Missing ElevenLabs API key');

  let host = (env.ELEVENLABS_API_HOST || 'api.elevenlabs.io').trim();
  if (!host.startsWith('http')) host = `https://${host}`;
  if (host.endsWith('/') && apiPath.startsWith('/')) host = host.slice(0, -1);

  return {
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': elevenKey,
    },
    url: host + apiPath,
  };
}

// This is the upstream API [rev-eng on 2023-04-12]
export namespace ElevenlabsWire {
  export interface TTSRequest {
    text: string;
    model_id?: 'eleven_monolingual_v1' | string;
    voice_settings?: {
      stability: number;
      similarity_boost: number;
    };
  }

  export interface VoicesList {
    voices: Voice[];
  }

  interface Voice {
    voice_id: string;
    name: string;
    //samples: Sample[];
    category: string;
    // fine_tuning: FineTuning;
    labels: Record<string, string>;
    description: string;
    preview_url: string;
    // available_for_tiers: string[];
    settings: {
      stability: number;
      similarity_boost: number;
    };
  }
}
