import LanguageIcon from '@mui/icons-material/Language';
import { BrowserRouter as Router, Link } from 'react-router-dom';

type Command = {
  primary: string;
  arguments?: string[];
  description: string;
  Icon: any;
  execute?: (url: string) => void;
};

type ICommandsProvider = {
  id: string;
  rank: number;
  getCommands: () => Command[];
};

export const CommandsBrowse: ICommandsProvider = {
  id: 'ass-browse',
  rank: 20,

  getCommands: () => [{
    primary: '/browse',
    arguments: ['URL'],
    description: 'Open the web page in a new tab',
    Icon: LanguageIcon,
    execute: (url: string) => {
      window.open(url, '_blank');
    }
  }],

};

const Command = ({ command }: { command: Command }) => {
  const handleClick = (url: string) => {
    if (command.execute) {
      command.execute(url);
    }
  };

  return (
    <Link
      to={`/${command.primary}`}
      title={command.description}
      onClick={() => handleClick(command.primary)}
    >
      <command.Icon /> {command.primary}
      {command.arguments && <> ({command.arguments.join(', ')})</>}
      <p>{command.description}</p>
    </Link>
  );
};

const example = () => {
  const commands = CommandsBrowse.getCommands();

  return (
    <Router>
      {commands.map((command, index) => (
        <Command key={index} command={command} />
      ))}
    </Router>
  );
};
