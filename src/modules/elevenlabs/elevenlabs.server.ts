import { NextRequest, NextResponse } from 'next/server';
import { createEmptyReadableStream, nonTrpcServerFetchOrThrow, safeErrorString } from '~/server/wire';
import { elevenlabsAccess, elevenlabsVoiceId, ElevenlabsWire, speechInputSchema } from './elevenlabs.router';

type ElevenLabsHandlerRequestBody = {
  elevenKey: string;
  text: string;
  voiceId: string;
  nonEnglish?: boolean;
  streaming: boolean;
  streamOptimization?: number;
};

export async function elevenLabsHandler(req: NextRequest) {
  try {
    const requestBody = await req.json() as ElevenLabsHandlerRequestBody;

    const { elevenKey, text, voiceId, nonEnglish, streaming, streamOptimization } = speechInputSchema.parse(requestBody);

    const path = `/v1/text-to-speech/${elevenlabsVoiceId(voiceId)}${streaming ? `/stream?optimize_streaming_latency=${streamOptimization || 1}` : ''}`;

    const { headers, url } = elevenlabsAccess(elevenKey, path);

    const body: ElevenlabsWire.TTSRequest = {
      text,
      ...(nonEnglish && { model_id: 'eleven_multilingual_v1' }),
    };

    const upstreamResponse = await nonTrpcServerFetchOrThrow(url, 'POST', headers, body);

    if (!streaming) {
      const audioArrayBuffer = await upstreamResponse.arrayBuffer();
      return new NextResponse(audioArrayBuffer, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
    }

    const audioReadableStream = upstreamResponse.body || createEmptyReadableStream();

    return new Response(audioReadableStream, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });

  } catch (error: any) {
    const fetchOrVendorError = safeErrorString(error) + (error?.cause ? ' · ' + error.cause : '');
    console.log(`api/elevenlabs/speech: fetch issue: ${fetchOrVendorError}`);
    return new Response(`[Issue] elevenlabs: ${fetchOrVendorError}`, { status: 500 });
  }
}
