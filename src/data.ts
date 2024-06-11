import React from 'react';

type SystemPurposeId =
  | 'Catalyst'
  | 'Custom'
  | 'Designer'
  | 'Developer'
  | 'DeveloperPreview'
  | 'Executive'
  | 'Generic'
  | 'Scientist'
  | 'YouTubeTranscriber';

type SystemPurposeDataable = {
  title: string;
  description: string | React.JSX.Element;
  systemMessage: string;
  systemMessageNotes?: string;
  symbol: string;
  imageUri?: string;
  examples?: string[];
  highlighted?: boolean;
  call?: { starters?: string[] };
  voices?: { elevenLabs?: { voiceId: string } };
};

const SystemPurposes: Record<SystemPurposeId, SystemPurposeDataable> = {
  Generic: {
    title: 'Default',
    description: 'Start here',
    systemMessage: `You are an AI assistant.
Knowledge cutoff: {{Cutoff}}
Current date: {{LocaleNow}}

{{RenderMermaid}}
{{RenderPlantUML}}
{{RenderSVG}}
{{PreferTables}}
`,
    symbol: '🧠',
    examples: ['help me plan a trip to Japan', 'what is the meaning of life?', 'how do I get a job at OpenAI?', 'what are some healthy meal ideas?'],
    call: { starters: ['Hey, how can I assist?', 'AI assistant ready. What do you need?', 'Ready to assist.', 'Hello.'] },
    voices: { elevenLabs: { voiceId: 'z9fAnlkpzviPz146aGWa' } },
  },
  // ... other SystemPurposeDataables
} as const;

export type SystemPurpose = typeof SystemPurposes[keyof typeof SystemPurposes];
export type SystemPurposeIdType = keyof typeof SystemPurposes;
export default SystemPurposes;
