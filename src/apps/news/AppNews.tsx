import * as React from 'react';
import NextImage from 'next/image';
import TimeAgo from 'react-timeago';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Container,
  Grid,
  Typography,
} from '@mui/joy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import { Brand } from '~/common/app.config';
import { Link } from '~/common/components/Link';
import { ROUTE_INDEX } from '~/common/app.routes';
import { animationColorBlues, animationColorRainbow } from '~/common/util/animUtils';
import { capitalizeFirstLetter } from '~/common/util/textUtils';
import { NewsItems } from './news.data';
import { beamNewsCallout } from './beam.data';

const NEWS_INITIAL_COUNT = 3;
const NEWS_LOAD_STEP = 2;

export const newsRoadmapCallout = (
  <Card variant='solid' invertedColors>
    <CardContent sx={{ gap: 2 }}>
      <Typography level='title-lg'>Open Roadmap</Typography>
      <Typography level='body-sm'>
        Take a peek at our roadmap to see what's in the pipeline. Discover upcoming features and let us know what excites you the most!
      </Typography>
      <Grid container spacing={1}>
        <Grid xs={12} sm={7}>
          <Button
            fullWidth
            variant='soft'
            color='primary'
            endDecorator={<LaunchIcon />}
            component={Link}
            href={Brand.URIs.OpenProject}
            noLinkStyle
            target='_blank'
          >
            Explore
          </Button>
        </Grid>
        <Grid xs={12} sm={5} sx={{ display: 'flex', flexAlign: 'center', justifyContent: 'center' }}>
          <Button
            fullWidth
            variant='plain'
            color='primary'
            endDecorator={<LaunchIcon />}
            component={Link}
            href={`${Brand.URIs.OpenRepo}/issues/new?template=roadmap-request.md&title=%5BSuggestion%5D`}
            noLinkStyle
            target='_blank'
          >
            Suggest a Feature
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export function AppNews() {
  const [lastNewsIdx, setLastNewsIdx] = React.useState<number>(NEWS_INITIAL_COUNT - 1);
  const news = NewsItems.slice(0, lastNewsIdx + 1);
  const firstNews = news[0] ?? null;
  const canExpand = news.length < NewsItems.length;

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        p: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          my: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          level='h1'
          sx={{ fontSize: '2.9rem', mb: 4 }}
        >
          Welcome to {Brand.Title.Base} <Box component='span' sx={{ animation: `${animationColorBlues} 10s infinite`, zIndex: 1 /* perf-opt */ }}>{firstNews?.versionCode}</Box>!
        </Typography>

        <Typography sx={{ mb: 2 }} level='title-sm'>
          {capitalizeFirstLetter(Brand.Title.Base)} has been updated to version {firstNews?.versionCode}
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Button
            variant='solid'
            color='primary'
            size='lg'
            component={Link}
            href={ROUTE_INDEX}
            noLinkStyle
            endDecorator='✨'
            sx={{
              boxShadow: '0 8px 24px -4px rgb(var(--joy-palette-primary-mainChannel) / 20%)',
              minWidth: 180,
            }}
          >
            Continue
          </Button>
        </Box>

        <Container disableGutters maxWidth='sm'>
          {news.map((ni, idx) => (
            <React.Fragment key={idx}>
              {idx === 2 && <Box sx={{ mb: 3 }}>{beamNewsCallout}</Box>}

              <Card sx={{ mb: 3, minHeight: 32, gap: 1 }}>
                <CardContent sx={{ position: 'relative', pr: idx !== 0 ? 4 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography level='title-sm' component='div'>
                      {ni.text ? ni.text : ni.versionName ? <><b>{ni.versionCode}</b> · </> : `Version ${ni.versionCode}:`}
                      <Box
                        component='span'
                        sx={idx !== 0 ? {} : {
                          animation: `${animationColorRainbow} 5s infinite`,
                          fontWeight: 'lg',
                          zIndex: 1, /* perf-opt */
                        }}
                      >
                        {ni.versionName}
                      </Box>
                    </Typography>
                    <Typography level='body-sm' sx={{ ml: 'auto' }}>
                      {!!ni.versionDate && <TimeAgo date={ni.versionDate} />}
                    </Typography>
                  </Box>

                  {!!ni.items && (
                    <ul style={{ marginTop: 8, marginBottom: 8, paddingInlineStart: '1.5rem', listStyleType: '"-  "' }}>
                      {ni.items.filter(item => item.dev !== true).map((item, idx) => (
                        <li key={idx} style={{ listStyle: (item.icon || item.noBullet) ? '" "' : '"-  "', marginLeft: item.icon ? '-1.125rem' : undefined }}>
                          <Typography component='div' sx={{ fontSize: 'sm' }}>
                            {item.icon && <item.icon sx={{ fontSize: 'xs', mr: 0.75 }} />}
                            {item.text}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  )}

                </CardContent>

                {!!ni.versionCoverImage && (
                  <CardOverflow sx={{
                    m: '0 calc(var(--CardOverflow-offset) - 1px) calc(var(--CardOverflow-offset) - 1px)',
                  }}>
                    <AspectRatio ratio='2'>
                      <NextImage
                        src={ni.versionCoverImage}
                        alt={`Cover image for ${ni.versionCode}`}
                        priority={idx === 0}
                        quality={90}
                      />
                    </AspectRatio>
                  </CardOverflow>
                )}

              </Card>

              {idx === 3 && <Box sx={{ mb: 3 }}>{newsRoadmapCallout}</Box>}

            </React.Fragment>
          ))}

          {canExpand && (
            <Button
              fullWidth
              variant='soft'
              color='neutral'
              onClick={() => setLastNewsIdx(index => index + NEWS_LOAD_STEP)}
              endDecorator={<ExpandMoreIcon />}
            >
              Previous News
            </Button>
          )}

        </Container>

      </Box>
    </Box>
  );
}
