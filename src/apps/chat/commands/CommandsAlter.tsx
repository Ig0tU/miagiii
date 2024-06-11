import ClearIcon from '@mui/icons-material/Clear';
import { Command } from './Command'; // assuming Command interface is defined in ICommandsProvider

export interface ICommandsProvider {
  id: string;
  rank: number;
  getCommands: () => Command[];
}

export const CommandsAlter: ICommandsProvider = {
  id: 'chat-alter',
  rank: 25,

  getCommands: () => [
    new Command(
      '/assistant',
      ['/a'],
      ['text'],
      'Injects assistant response'
    ),
    new Command(
      '/system',
      ['/s'],
      ['text'],
      'Injects system message'
    ),
    new Command(
      '/clear',
      [],
      ['all'],
      'Clears the chat (removes all messages)',
      ClearIcon
    ),
  ],
};
