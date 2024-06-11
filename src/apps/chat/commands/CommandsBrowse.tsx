import LanguageIcon from '@mui/icons-material/Language';
import { BrowserRouter as Router, Link } from 'react-router-dom';

type Command = {
  primary: string;
  arguments?: string[];
  description: string;
  Icon: any;
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

// Usage example
const example = () => {
  const commands = CommandsBrowse.getCommands();

  return (
    <Router>
      {commands.map((command, index) => (
        <Link key={index} to={`/${command.primary}`}>
          <command.Icon /> {command.primary}
          {command.arguments && <> ({command.arguments.join(', ')})</>}
          <p>{command.description}</p>
        </Link>
      ))}
    </Router>
  );
}
