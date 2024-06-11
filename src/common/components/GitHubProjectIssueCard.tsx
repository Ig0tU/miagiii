import * as React from 'react';
import { GitHubIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  Link as MuiLink,
  SxProps,
  Typography,
} from '@mui/joy';
import { string } from 'prop-types';

export const GitHubProjectIssueCard = (props: {
  issue: number;
  text: string;
  note?: string | React.ReactNode;
  note2?: string | React.ReactNode;
  sx?: SxProps;
}) => (
  <Card variant="outlined" color="primary" sx={props.sx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <GitHubIcon />
      <Typography level="body-sm">
        <MuiLink
          overlay
          href={`https://github.com/enricoros/big-AGI/issues/${props.issue}`}
          target="_blank"
          fontSize="1.25rem"
          sx={{ textDecoration: 'none' }}
        >
          <Typography color="neutral">big-AGI #{props.issue}</Typography>
        </MuiLink>
        {' · '}
        <Typography color="neutral">{props.text}.</Typography>
      </Typography>
    </Box>
    {!!props.note && (
      <Typography level="body-sm" sx={{ mt: 1 }}>
        {props.note}
      </Typography>
    )}
    {!!props.note2 && (
      <Typography level="body-sm" sx={{ mt: 1 }}>
        {props.note2}
      </Typography>
    )}
  </Card>
);

GitHubProjectIssueCard.propTypes = {
  issue: string.isRequired,
  text: string.isRequired,
};
