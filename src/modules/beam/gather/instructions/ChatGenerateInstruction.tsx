import { Typography } from '@mui/joy';
import { ChatMessage, streamAssistantMessage } from '../../../../apps/chat';
import { VChatMessageIn } from '~/modules/llms/llm.client';
import { DMessage } from '~/common/state/store-chats';
import { getUXLabsHighPerformance } from '~/common/state/store-ux-labs';
import { BaseInstruction, ExecutionInputState } from './beam.gather.execution';
import { GATHER_PLACEHOLDER } from '../../beam.config';
import { beamCardMessageScrollingSx, beamCardMessageSx } from '../../BeamCard';
import { getBeamCardScrolling } from '../../store-module-beam';

type ChatGenerateMethods = 's-s0-h0-u0-aN-u';

interface ChatGenerateInstruction extends BaseInstruction {
  type: 'chat-generate';
  display: 'chat-message' | 'character-count' | 'mute' | undefined;
  method: ChatGenerateMethods;
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Merge Execution: uses a chain of Promises to queue up (cancellable) sequential instructions.
 */
export async function executeChatGenerate(
  instruction: ChatGenerateInstruction,
  inputs: ExecutionInputState,
  prevStepOutput: string
): Promise<string> {
  if (instruction.method === 's-s0-h0-u0-aN-u') {
    const history: VChatMessageIn[] = [
      { role: 'system', content: _mixChatGeneratePrompt(instruction.systemPrompt, inputs.chatMessages.length, prevStepOutput) },
      ...inputs.chatMessages.flatMap((m): VChatMessageIn[] => (m.role === 'user' || m.role === 'assistant') ? [{ role: m.role, content: m.text }] : []),
      ...inputs.rayMessages.map((m): VChatMessageIn => ({ role: 'assistant', content: m.text })),
      { role: 'user', content: _mixChatGeneratePrompt(instruction.userPrompt, inputs.rayMessages.length, prevStepOutput) },
    ];

    Object.assign(inputs.intermediateDMessage, {
      text: GATHER_PLACEHOLDER,
      updated: undefined,
    });

    const onMessageUpdate = (update: Partial<DMessage>) => {
      Object.assign(inputs.intermediateDMessage, update);
      if (update.text) {
        inputs.intermediateDMessage.updated = Date.now();
      }

      switch (instruction.display) {
        case 'mute':
          return;

        case 'character-count':
          inputs.updateInstructionComponent(
            <Typography level='body-xs' sx={{ opacity: 0.5 }}>{update.text?.length || 0} characters</Typography>
          );
          return;

        case 'chat-message':
        default:
          inputs.updateInstructionComponent(
            <ChatMessage
              message={inputs.intermediateDMessage}
              fitScreen={true}
              showAvatar={false}
              adjustContentScaling={-1}
              sx={!getBeamCardScrolling() ? beamCardMessageSx : beamCardMessageScrollingSx}
            />
          );
          return;
      }
    };

    return streamAssistantMessage(inputs.llmId, history, getUXLabsHighPerformance() ? 0 : 1, 'off', onMessageUpdate, inputs.chainAbortController.signal)
      .then((status) => {
        if (status.outcome === 'aborted') {
          throw new Error('Instruction Stopped.');
        }
        if (status.outcome === 'errored') {
          throw new Error(`Model execution error: ${status.errorMessage || 'Unknown error'}`);
        }

        return inputs.intermediateDMessage.text;
      });
  } else {
    throw new Error(`Unsupported Chat Generate method: ${instruction.method}`);
  }
}

function _mixChatGeneratePrompt(prompt: string, chatCount: number, prevStepOutput: string): string {
  return prompt.replace('{{N}}', chatCount.toString()).replace('{{PrevStepOutput}}', prevStepOutput);
}
