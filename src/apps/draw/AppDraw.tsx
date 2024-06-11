import * as React from 'react';
import { useCapabilityTextToImage } from '~/modules/t2i/t2i.client';
import { useIsMobile } from '~/common/components/useMatchMedia';
import { useRouterQuery } from '~/common/app.routes';
import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { DrawHeading } from './components/DrawHeading';
import { DrawUnconfigured } from './components/DrawUnconfigured';
import { TextToImage } from './TextToImage';
import { Gallery } from './Gallery';

export interface AppDrawIntent {
  backTo: 'app-chat';
}

export function AppDraw() {
  // state
  const [showHeading, setShowHeading] = React.useState<boolean>(true);
  const [drawIntent, setDrawIntent] = React.useState<AppDrawIntent | null>(null);
  const [section, setSection] = React.useState<number>(0);

  // external state
  const isMobile = useIsMobile();
  const query = useRouterQuery<Partial<AppDrawIntent>>();
  const {
    activeProviderId,
    mayWork,
    providers,
    setActiveProviderId,
  } = useCapabilityTextToImage();

  // [effect] set intent from the query parameters
  React.useEffect(() => {
    if (query.backTo) {
      setDrawIntent({
        backTo: query.backTo || 'app-chat',
      });
    }
    return () => {};
  }, [query]);

  return (
    <>
      {/* The container is a 100dvh, flex column with App bg (see `pageCoreSx`) */}

      {showHeading && (
        <DrawHeading
          section={section}
          setSection={setSection}
          showSections
          onRemoveHeading={() => setShowHeading(false)}
          sx={{
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 6 },
          }}
        />
      )}

      {!mayWork && <DrawUnconfigured sx={{ mt: 6 }} />}

      {mayWork && (
        <TextToImage
          isMobile={isMobile}
          providers={providers}
          activeProviderId={activeProviderId}
          setActiveProviderId={setActiveProviderId}
        />
      )}

      {mayWork && <Gallery sx={{ mt: 6 }} />}
    </>
  );
}

function Gallery() {
  return (
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }, (_, i) => i).map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random"
                alt="Random Image"
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  Heading
                </Typography>
                <Typography variant="body2">
                  This is a description of the image.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
