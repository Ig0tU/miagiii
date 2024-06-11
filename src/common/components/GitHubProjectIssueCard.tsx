import * as React from 'react';
import { GitHubIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  Link as MuiLink,
  SxProps,
  Typography,
} from '@mui/joy';
import { string, node, shape } from 'prop-types';

export interface GitHubProjectIssueCardProps {
  issue: string;
  text: string;
  note?: string | React.ReactNode;
  note2?: string | React.ReactNode;
  sx?: SxProps;
  title?: string;
}

export const GitHubProjectIssueCard = React.forwardRef<
  HTMLDivElement,
  GitHubProjectIssueCardProps
>((props, ref) => {
  const { issue, text, note, note2, sx, title, ...other } = props;

  return (
    <Card
      variant="outlined"
      color="primary"
      ref={ref}
      sx={sx}
      {...other}
      key={issue}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GitHubIcon />
        <Typography level="body-sm">
          <MuiLink
            overlay
            href={`https://github.com/enricoros/big-AGI/issues/${issue}`}
            target="_blank"
            fontSize="1.25rem"
            underline="none"
            title={title}
            component="a"
            sx={{ textDecoration: 'none' }}
          >
            <Typography color="neutral">big-AGI #{issue}</Typography>
          </MuiLink>
          {' · '}
          <Typography color="neutral">{text}.</Typography>
        </Typography>
      </Box>
      {!!note && (
        <Typography level="body-sm" sx={{ mt: 1 }}>
          {note}
        </Typography>
      )}
      {!!note2 && (
        <Typography level="body-sm" sx={{ mt: 1 }}>
          {note2}
        </Typography>
      )}
    </Card>
  );
});

GitHubProjectIssueCard.propTypes = {
  issue: string.isRequired,
  text: string.isRequired,
  note: node,
  note2: node,
  sx: shape({}),
  title: string,
};

