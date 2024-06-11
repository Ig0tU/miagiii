import { llmChatGenerateOrThrow } from '~/modules/llms/llm.client';
import { useModelsStore } from '~/modules/llms/store-llms';
import { useChatStore } from '~/common/state/store-chats';

type PlantUMLType =
  | 'sequence'
  | 'class'
  | 'usecase'
  | 'activity'
  | 'component'
  | 'state'
  | 'object'
  | 'deployment'
  | 'wireframe'
  | 'mindmap'
  | 'gantt'
  | 'flowchart'
  | '';

const suggestPlantUMLFn: VChatFunctionIn = {
  name: 'draw_plantuml_diagram',
  description: 'Generates a PlantUML diagram or mindmap from the last message, if applicable, relevant, and no other diagrams are present.',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'The suitable type of diagram. Options: sequence, class, usecase, activity, component, state, object, deployment, wireframe, mindmap, gantt, flowchart, or an empty string.',
      },
      code: {
        type: 'string',
        description: 'A valid PlantUML string (@startuml...@enduml) to be rendered as a diagram or mindmap, or an empty string. Use quotation marks for proper escaping, avoid external references and avoid unescaped spaces in participants/actors.',
      },
    },
    required: ['type', 'code'],
  },
};

/**
 * Formulates proposals for follow-up questions, prompts, and counterpoints, based on the last 2 chat messages
 */
export async function autoSuggestions(
  conversationId: string,
  assistantMessageId: string,
  suggestDiagrams = false,
  suggestQuestions = false
) {
  const { funcLLMId } = useModelsStore.getState();
  if (!funcLLMId) return;

  const { conversations, editMessage } = useChatStore.getState();
  const conversation = conversations.find((c) => c.id === conversationId) ?? null;
  if (!conversation || conversation.messages.length < 3) return;

  const [systemMessage, userMessage, assistantMessage] = conversation.messages.slice(-3);
  if (
    systemMessage?.role !== 'system' ||
    userMessage?.role !== 'user' ||
    assistantMessage?.role !== 'assistant'
  )
    return;

  let assistantMessageText = assistantMessage.text;

  if (suggestQuestions) {
    // llmChatGenerateOrThrow(funcLLMId, [
    //   { role: 'system', content: systemMessage.text },
    //   { role: 'user', content: userMessage.text },
    //   { role: 'assistant', content: assistantMessageText },
    // ], [suggestUserFollowUpFn], 'suggest_user_prompt',
    // );
  }

  if (suggestDiagrams) {
    try {
      const chatResponse = await llmChatGenerateOrThrow<{
        function_arguments: { code: string; type: PlantUMLType };
      }>(funcLLMId, [
        { role: 'system', content: systemMessage.text },
        { role: 'user', content: userMessage.text },
        { role: 'assistant', content: assistantMessageText },
      ], [suggestPlantUMLFn], 'draw_plantuml_diagram');

      const { code, type } = chatResponse?.function_arguments || {};
      if (code && type) {
        const plantUML = code.trim();
        if (plantUML.startsWith('@start') && (plantUML.endsWith('@enduml') || plantUML.endsWith('@endmindmap'))) {
          editMessage(conversationId, assistantMessageId, {
            text: `${assistantMessageText}\n\n\`\`\`${type}.diagram\n${plantUML}\n\`\`\`\n`,
          }, false);
        }
      }
    } catch (err) {
      console.error('autoSuggestions::diagram:', err);
    }
  }
}
