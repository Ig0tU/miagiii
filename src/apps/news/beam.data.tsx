import * as React from 'react';

import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  SxProps,
  ThumbUpRoundedIcon,
  Typography,
} from '@mui/joy';
import LaunchIcon from '@mui/icons-material/Launch';
import { Link as RouterLink } from 'react-router-dom';

export const beamReleaseDate = '2024-04-01T22:00:00Z';
export const beamBlogUrl = 'https://big-agi.com/blog/beam-multi-model-ai-reasoning/';

export type BeamNewsCalloutProps = {
  sx?: SxProps;
};

export const BeamNewsCallout: React.FC<BeamNewsCalloutProps> = ({ sx }) => {
  return (
    <Card variant="solid" invertedColors sx={sx}>
      <CardContent sx={{ gap: 2 }}>
        <Typography level="title-lg" title="Beam - launched in 1.15">
          Beam is a world-first, multi-model AI chat modality that accelerates the discovery of superior solutions by leveraging the collective strengths of diverse LLMs.
        </Typography>
        <Typography level="body-sm">
          Beam is a world-first, multi-model AI chat modality. By combining the strengths of diverse LLMs, Beam allows you to find better answers, faster.
        </Typography>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid xs={12} sm={7} key="blog">
            <Button
              fullWidth
              variant="soft"
              color="primary"
              endDecorator={<LaunchIcon />}
              component={RouterLink}
              to={beamBlogUrl}
              noLinkStyle
              target="_blank"
              rel="noopener noreferrer"
              buttonProps={{
                title: 'Read more about Beam on the blog',
              }}
            >
              Blog
            </Button>
          </Grid>
          <Grid xs={12} sm={5} key="hackernews" sx={{ display: 'flex', flexAlign: 'center', justifyContent: 'center' }}>
            {/*<Button*/}
            {/*  fullWidth variant='outlined' color='primary' startDecorator={<ThumbUpRoundedIcon />}*/}
            {/*  // endDecorator={<LaunchIcon />}*/}
            {/*  component={Link} href={beamHNUrl} noLinkStyle target='_blank'*/}
            {/*>*/}
            {/*  on Hackernews 🙏*/}
            {/*</Button>*/}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
