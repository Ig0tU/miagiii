import { ICommandsProvider } from './ICommandsProvider';

type CommandsProviderId =
  | 'ass-browse'
  | 'ass-t2i'
  | 'ass-react'
  | 'chat-alter'
  | 'cmd-help'
  | 'mode-beam';

type TextCommandPiece =
  | { type: 'text'; value: string; }
  | { type: 'cmd'; providerId: CommandsProviderId, command: string; params?: string; isError?: boolean };

type Command = ReturnType<ICommandsProvider['getCommands']>[number];

type ChatCommandProvider = Record<CommandsProviderId, ICommandsProvider>;

const ChatCommandsProviders: ChatCommandProvider = {
  'ass-browse': CommandsBrowse,
  'ass-react': CommandsReact,
  'ass-t2i': CommandsDraw,
  'chat-alter': CommandsAlter,
  'cmd-help': CommandsHelp,
  'mode-beam': CommandsBeam,
};

export function findAllChatCommands(): Command[] {
  return Object.values(ChatCommandsProviders)
    .sort((a, b) => a.rank - b.rank)
    .flatMap(p => p.getCommands());
}

function getCommand(provider: ICommandsProvider, command: string): Command | null {
  const cmd = provider.getCommands().find(c => c.primary === command || c.alternatives?.includes(command));
  return cmd || null;
}

export function extractChatCommand(input: string): TextCommandPiece[] {
  const inputTrimmed = input.trim();

  if (!inputTrimmed.startsWith('/')) {
    return [{ type: 'text', value: inputTrimmed }];
  }

  const firstSpaceIndex = inputTrimmed.indexOf(' ');
  const potentialCommand = inputTrimmed.match(/^\/\S+/)?.[0] || inputTrimmed;
  const textAfterCommand = firstSpaceIndex >= 0 ? inputTrimmed.substring(firstSpaceIndex + 1) : '';

  for (const provider of Object.values(ChatCommandsProviders)) {
    const cmd = getCommand(provider, potentialCommand);
    if (cmd) {
      if (cmd.arguments?.length) {
        return [{
          type: 'cmd',
          providerId: provider.id,
          command: potentialCommand,
          params: textAfterCommand || undefined,
          isError: !textAfterCommand || undefined,
        }];
      }

      const pieces: TextCommandPiece[] = [{
        type: 'cmd',
        providerId: provider.id,
        command: potentialCommand,
        params: undefined,
      }];
      textAfterCommand && pieces.push({
        type: 'text',
        value: textAfterCommand.trim(),
      });
      return pieces;
    }
  }

  return [{
    type: 'text',
    value: inputTrimmed,
    isError: true,
  }];
}

(TextCommandPiece as { prototype: any }).prototype.trim = function (): TextCommandPiece {
  if (this.type === 'text') {
    this.value = this.value.trim();
  }
  return this;
};
