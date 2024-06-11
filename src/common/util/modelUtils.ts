const GPT_4_VISION_PREVIEW = 'gpt-4-vision-preview';
const GPT_4_TURBO_PREVIEW = 'gpt-4-1106-preview';
const GPT_4_32K = 'gpt-4-32k';
const GPT_4 = 'gpt-4';
const GPT_3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct';
const GPT_3_5_TURBO_1106 = 'gpt-3.5-turbo-1106';
const GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-16k';
const GPT_3_5_TURBO = 'gpt-3.5-turbo';
const CLAUDE_3_OPUS = 'claude-3-opus';
const CLAUDE_3_SONNET = 'claude-3-sonnet';
const LM_STUDIO = 'LM Studio';

function getModelFromFile(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  if (parts.length === 0) return '';
  const lastPart = parts.pop() || '';
  return lastPart.replace('.gguf', '');
}

export function prettyBaseModel(model: string | undefined): string {
  if (!model) return '';

  switch (model) {
    case GPT_4_VISION_PREVIEW:
      return 'GPT-4 Vision';
    case GPT_4_TURBO_PREVIEW:
      return 'GPT-4 Turbo';
    case GPT_4_32K:
      return 'gpt-4-32k';
    case GPT_4:
      return 'gpt-4';
    case GPT_3_5_TURBO_INSTRUCT:
      return '3.5 Turbo Instruct';
    case GPT_3_5_TURBO_1106:
    case GPT_3_5_TURBO_16K:
      return '3.5 Turbo 16k';
    case GPT_3_5_TURBO:
      return '3.5 Turbo';
    case CLAUDE_3_OPUS:
      return 'Claude 3 Opus';
    case CLAUDE_3_SONNET:
      return 'Claude 3 Sonnet';
    default:
      if (model.endsWith('.bin')) {
        return model.slice(0, -4);
      }
      if (model.startsWith('C:\\') || model.startsWith('D:\\')) {
        try {
          return getModelFromFile(model);
        } catch (e) {
          return 'Invalid file path';
        }
      }
      if (model.includes(':')) {
        return model.replace(':latest', '').replaceAll(':', ' ');
      }
      return model;
  }
}
