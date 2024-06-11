import type { DLLMId } from "~/modules/llms/store-llms";
import type { StreamingClientUpdate } from "~/modules/llms/vendors/unifiedStreamingClient";
import { autoSuggestions } from "~/modules/aifn/autosuggestions/autoSuggestions";
import { conversationAutoTitle } from "~/modules/aifn/autotitle/autoTitle";
import { llmStreamingChatGenerate, VChatMessageIn } from "~/modules/llms/llm.client";
import { speakText } from "~/modules/elevenlabs/elevenlabs.client";
import type { DMessage } from "~/common/state/store-chats";
import { ConversationsManager } from "~/common/chats/ConversationsManager";
import { ChatAutoSpeakType, getChatAutoAI } from "../store-app-chat";

const STREAM_TEXT_INDICATOR = "...";

interface StreamMessageOutcome {
  outcome: "success" | "aborted" | "errored";
  errorMessage?: string;
}

interface StreamMessageStatus extends StreamMessageOutcome {
  spokenLine: boolean;
}

/**
 * The main "chat" function. TODO: this is here so we can soon move it to the data model.
 */
export async function runAssistantUpdatingState(
  conversationId: string,
  history: DMessage[],
  assistantLlmId: DLLMId,
  parallelViewCount: number
): Promise<boolean> {
  const cHandler = ConversationsManager.getHandler(conversationId);

  const { autoSpeak, autoSuggestDiagrams, autoSuggestQuestions, autoTitleChat } = getChatAutoAI();

  const assistantMessageId = cHandler.messageAppendAssistant(STREAM_TEXT_INDICATOR, history[0].purposeId, assistantLlmId, true);

  const abortController = new AbortController();
  cHandler.setAbortController(abortController);

  const messageStatus = await streamAssistantMessage(
    assistantLlmId,
    history.map((m): VChatMessageIn => ({ role: m.role, content: m.text })),
    parallelViewCount,
    autoSpeak,
    (update) => cHandler.messageEdit(assistantMessageId, update, false),
    abortController.signal
  );

  cHandler.setAbortController(null);

  if (autoTitleChat) {
    conversationAutoTitle(conversationId, false);
  }

  if (autoSuggestDiagrams || autoSuggestQuestions) {
    autoSuggestions(conversationId, assistantMessageId, autoSuggestDiagrams, autoSuggestQuestions);
  }

  return messageStatus.outcome === "success";
}

export async function streamAssistantMessage(
  llmId: DLLMId,
  messagesHistory: VChatMessageIn[],
  throttleUnits: number,
  autoSpeak: ChatAutoSpeakType,
  editMessage: (update: Partial<DMessage>) => void,
  abortSignal: AbortSignal
): Promise<StreamMessageStatus> {
  let spokenLine = false;

  // Throttling setup
  let lastCallTime = 0;
  let throttleDelay = 1000 / 12;
  if (throttleUnits > 1) {
    throttleDelay = Math.round(throttleDelay * Math.sqrt(throttleUnits));
  }

  const incrementalAnswer: Partial<DMessage> = { text: "" };

  try {
    await llmStreamingChatGenerate(llmId, messagesHistory, null, null, abortSignal, (update: StreamingClientUpdate) => {
      const textSoFar = update.textSoFar;

      if (update.originLLM) incrementalAnswer.originLLM = update.originLLM;
      if (textSoFar) incrementalAnswer.text = textSoFar;
      if (update.typing !== undefined) incrementalAnswer.typing = update.typing;

      if (!abortSignal.aborted) {
        editMessage(incrementalAnswer);
      }

      if (textSoFar && autoSpeak === "firstLine" && !spokenLine) {
        let cutPoint = textSoFar.lastIndexOf("\n");
        if (cutPoint < 0) {
          cutPoint = textSoFar.lastIndexOf(". ");
        }
        if (cutPoint > 100 && cutPoint < 400) {
          spokenLine = true;
          const firstParagraph = textSoFar.substring(0, cutPoint);
          speakText(firstParagraph);
        }
      }
    });
  } catch (error: any) {
    if (error?.name !== "AbortError") {
      console.error("Fetch request error:", error);
      const errorText = ` [Issue: ${error.message || (typeof error === "string" ? error : "Chat stopped.")}]`;
      incrementalAnswer.text = (incrementalAnswer.text || "") + errorText;
      return {
        outcome: "errored",
        errorMessage: error.message,
        spokenLine,
      };
    } else {
      return {
        outcome: "aborted",
        spokenLine,
      };
    }
  }

  editMessage({ ...incrementalAnswer, typing: false });

  if ((autoSpeak === "all" || autoSpeak === "firstLine") && incrementalAnswer.text && !spokenLine) {
    speakText(incrementalAnswer.text);
  }

  return {
    outcome: "success",
    spokenLine,
  };
}
