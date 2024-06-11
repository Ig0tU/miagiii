import type { SvgIcon } from '@mui/material';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import MediationOutlinedIcon from '@mui/icons-material/MediationOutlined';
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded';

import type { Instruction } from './beam.gather.execution';

export type FFactoryId = string;
export const CUSTOM_FACTORY_ID = 'custom' as const;

export type FusionFactoryInstruction = {
  type: 'chat-generate' | 'user-input-checklist';
  label?: string;
  display?: 'chat-message';
  method?: string;
  systemPrompt?: string;
  userPrompt?: string;
  outputPrompt?: string;
};

export type FusionFactoryInstructionType =
  | 'chat-generate'
  | 'user-input-checklist';

export interface FusionFactorySpec {
  factoryId: FFactoryId;
  shortLabel: string; // used in the button group selector
  addLabel: string;   // used in the add card
  cardTitle: string;   // used as the title
  Icon?: typeof SvgIcon;
  description: string;
  createInstructions: () => FusionFactoryInstruction[];
}

const getFusionFactory = (factoryId: FFactoryId): FusionFactorySpec | null => {
  const factory = FUSION_FACTORIES.find(f => f.factoryId === factoryId);
  return factory || null;
};

export function findFusionFactory(factoryId?: FFactoryId | null): FusionFactorySpec | null {
  if (!factoryId) return null;
  return getFusionFactory(factoryId) || null;
}

export const FUSION_FACTORY_DEFAULT = 'fuse';

export const FUSION_FACTORIES: FusionFactorySpec[] = [
  {
    factoryId: 'fuse',
    shortLabel: 'Fuse',
    addLabel: 'Add Fusion',
    cardTitle: 'Combined Response',
    Icon: MediationOutlinedIcon,
    description: 'AI combines conversation details and ideas into one clear, comprehensive answer.',
    createInstructions: () => [
      {
        type: 'chat-generate',
        label: 'Synthesizing Fusion',
        method: 's-s0-h0-u0-aN-u',
        systemPrompt: `
You are an expert AI text synthesizer, your task is to analyze the following inputs and generate a single, comprehensive response that addresses the core objectives or questions.

Consider the conversation history, the last user message, and the diverse perspectives presented in the {{N}} response alternatives.

Your response should integrate the most relevant insights from these inputs into a cohesive and actionable answer.

Synthesize the perfect response that merges the key insights and provides clear guidance or answers based on the collective intelligence of the alternatives.`.trim(),
        userPrompt: `
Synthesize the perfect cohesive response to my last message that merges the collective intelligence of the {{N}} alternatives above.`.trim(),
      },
    ],
  },
  // ... other factory specifications
];
