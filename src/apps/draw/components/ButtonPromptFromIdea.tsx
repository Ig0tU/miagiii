import * as React from 'react';
import { Button, ButtonGroup, IconButton, Tooltip } from '@mui/joy';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export function ButtonPromptFromIdea(props: {
  isMobile?: boolean;
  disabled: boolean;
  onIdeaNext: () => void;
  onIdeaUse: () => void;
}) {
  const { onIdeaNext, onIdeaUse, isMobile, disabled } = props;

  const handleIdeaNext = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onIdeaNext();
    },
    [onIdeaNext]
  );

  if (isMobile) {
    return (
      <Button
        fullWidth
        startDecorator={<LightbulbOutlinedIcon />}
        variant="soft"
        color="neutral"
        disabled={disabled}
        onClick={handleIdeaNext}
      >
        Idea
      </Button>
    );
  }

  return (
    <ButtonGroup
      variant="soft"
      color="neutral"
      disabled={disabled}
      sx={{
        minWidth: 160,
      }}
    >
      <Button
        fullWidth
        startDecorator={<LightbulbOutlinedIcon />}
        variant="soft"
        color="neutral"
        disabled={disabled}
        onClick={handleIdeaNext}
      >
        Idea
      </Button>
      <Tooltip disableInteractive title="Use Idea">
        <IconButton size="sm" onClick={onIdeaUse} disabled={disabled}>
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
