import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  ListItemDecorator,
  Typography,
} from '@mui/joy';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChatIcon from '@mui/icons-material/Chat';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MicIcon from '@mui/icons-material/Mic';
import RecordVoiceOverTwoToneIcon from '@mui/icons-material/RecordVoiceOverTwoTone';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useOptimaLayout } from '~/common/layout/optima/useOptimaLayout';
import { animationColorRainbow } from '~/common/util/animUtils';
import { navigateBack } from '~/common/app.routes';
import { useCapabilityBrowserSpeechRecognition, useCapabilityElevenLabs } from '~/common/components/useCapabilities';
import { useChatStore } from '~/common/state/store-chats';
import { useUICounter } from '~/common/state/store-ui';

interface StatusCardProps {
  icon: React.ReactNode;
  hasIssue: boolean;
  text: string;
  button?: React.ReactNode;
}

function StatusCard(props: StatusCardProps) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemDecorator>{props.icon}</ListItemDecorator>
        <Typography level='title-md' color={props.hasIssue ? 'warning' : undefined} sx={{ flexGrow: 1 }}>
          {props.text}
          {props.button}
        </Typography>
        <ListItemDecorator>{props.hasIssue ? <WarningRoundedIcon color='warning' /> : <CheckRoundedIcon color='success' />}</ListItemDecorator>
      </CardContent>
    </Card>
  );
}

export function CallWizard({ strict = false, conversationId, children }: { strict?: boolean, conversationId: string | null, children: React.ReactNode }) {
  const [chatEmptyOverride, setChatEmptyOverride] = React.useState(false);
  const [recognitionOverride, setRecognitionOverride] = React.useState(false);

  const { openPreferencesTab } = useOptimaLayout();
  const recognition = useCapabilityBrowserSpeechRecognition();
  const synthesis = useCapabilityElevenLabs();
  const chatIsEmpty = useChatStore(state => {
    if (!conversationId)
      return false;
    const conversation = state.conversations.find(conversation => conversation.id === conversationId);
    return !(conversation?.messages?.length);
  });
  const { novel, touch } = useUICounter('call-wizard');

  const outOfTheBlue = !conversationId;
  const overriddenEmptyChat = chatEmptyOverride || !chatIsEmpty;
  const overriddenRecognition = recognitionOverride || recognition.mayWork;
  const allGood = overriddenEmptyChat && overriddenRecognition && synthesis.mayWork;
  const fatalGood = overriddenRecognition && synthesis.mayWork;

  React.useEffect(() => {
    if (novel && fatalGood) {
      touch();
    }
  }, [novel, fatalGood, touch]);

  const handleOverrideChatEmpty = () => setChatEmptyOverride(true);
  const handleOverrideRecognition = () => setRecognitionOverride(true);
  const handleConfigureElevenLabs = () => {
    openPreferencesTab(PreferencesTab.Voice);
  };
  const handleFinishButton = () => {
    if (!allGood)
      return navigateBack();
    touch();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          level='title-lg'
          sx={{
            fontSize: '3rem',
            fontWeight: 'sm',
            textAlign: 'center',
            mb: 2,
            animation: `${animationColorRainbow} 15s linear infinite`,
          }}
        >
          Welcome to<br />
          your first call
        </Typography>
        <Typography level='body-lg' sx={{ textAlign: 'center', mb: 4 }}>
          {!outOfTheBlue ? 'Let’s get you all set up.' : 'Before you receive your first call,'}
        </Typography>
      </Box>

      {!outOfTheBlue && (
        <StatusCard
          icon={<ChatIcon />}
          hasIssue={!overriddenEmptyChat}
          text={overriddenEmptyChat ? 'Great! Your chat has messages.' : 'The chat is empty. Calls are effective when the caller has context.'}
          button={overriddenEmptyChat ? undefined : (
            <Button variant='outlined' onClick={handleOverrideChatEmpty} sx={{ mx: 1 }}>
              Ignore
            </Button>
          )}
        />
      )}

      <StatusCard
        icon={<MicIcon />}
        text={
          ((overriddenRecognition && !recognition.warnings.length) ? 'Speech recognition should be good to go.' : 'There might be a speech recognition issue.') +
          (recognition.isApiAvailable ? '' : ' Your browser does not support the speech recognition API.') +
          (recognition.isDeviceNotSupported ? ' Your device does not provide this feature.' : '') +
          (recognition.warnings.length ? ' ⚠️ ' + recognition.warnings.join(' · ') : '')
        }
        button={overriddenRecognition ? undefined : (
          <Button variant='outlined' onClick={handleOverrideRecognition} sx={{ mx: 1 }}>
            Ignore
          </Button>
        )}
        hasIssue={!overriddenRecognition}
      />

      <StatusCard
        icon={<RecordVoiceOverTwoToneIcon />}
        text={
          (synthesis.mayWork ? 'Voice synthesis should be ready.' : 'There might be an issue with ElevenLabs voice synthesis.') +
          (synthesis.isConfiguredServerSide ? '' : (synthesis.isConfiguredClientSide ? '' : ' Please add your API key in the settings.'))
        }
        button={synthesis.mayWork ? undefined : (
          <Button variant='outlined' onClick={handleConfigureElevenLabs} sx={{ mx: 1 }}>
            Configure
          </Button>
        )}
        hasIssue={!synthesis.mayWork}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 2, px: 0.5, mt: 4 }}>
        <Typography level='body-lg' sx={{ flexGrow: 1 }}>
          {allGood ? 'Ready, Set, Call' : 'Please resolve the issues above before proceeding with the call'}
        </Typography>
        <IconButton
          size='lg'
          variant='solid'
          color={allGood ? 'success' : 'danger'}
          onClick={handleFinishButton}
          sx={{
            borderRadius: '50px',
            mr: 0.5,
            // animation: `${cssRainbowBackgroundKeyframes} 15s linear infinite`,
            // boxShadow: allGood ? 'md' : 'none',
          }}
        >
          {allGood ? <ArrowForwardRoundedIcon sx={{ fontSize: '1.5em' }} /> : <CloseRoundedIcon sx={{ fontSize: '1.5em' }} />}
        </IconButton>
      </Box>
    </>
  );
}
