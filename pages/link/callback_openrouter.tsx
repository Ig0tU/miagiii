import * as React from 'react';
import { Box, Typography } from '@mui/joy';
import { useModelsStore } from '~/modules/llms/store-llms';
import { InlineError } from '~/common/components/InlineError';
import { apiQuery } from '~/common/util/trpc.client';
import { useRouterQuery, navigateToIndex } from '~/common/app.routes';
import { withLayout } from '~/common/layout/withLayout';

interface CallbackOpenRouterPageProps {
  openRouterCode?: string;
}

function CallbackOpenRouterPage(props: CallbackOpenRouterPageProps) {
  const { openRouterCode } = props;

  const { data, isError, error, isLoading } = apiQuery.backend.exchangeOpenRouterKey.useQuery(
    { code: openRouterCode || '' },
    {
      enabled: !!openRouterCode,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const isErrorInput = !openRouterCode;
  const openRouterKey = data?.key ?? undefined;
  const isSuccess = !!openRouterKey;

  React.useEffect(() => {
    if (!isSuccess) return;

    useModelsStore.getState().setOpenRoutersKey(openRouterKey);
    navigateToIndex(true);
  }, [isSuccess, openRouterKey]);

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography level="title-lg">Welcome Back</Typography>

        {isLoading && <Typography level="body-sm">Loading...</Typography>}

        {isErrorInput && <InlineError error="There was an issue retrieving the code from OpenRouter." />}

        {isError && <InlineError error={error} />}

        {data && (
          <Typography level="body-md">
            Success! You can now close this window.
          </Typography>
        )}

      </Box>
    </Box>
  );
}

interface CallbackPageProps {}

export default function CallbackPage(props: CallbackPageProps) {
  const { code } = useRouterQuery<{ code: string | undefined }>();

  return withLayout({ type: 'plain' }, <CallbackOpenRouterPage openRouterCode={code} />);
}
