import * as React from 'react';

import { Box, Button, FormLabel } from '@mui/joy';
import SyncIcon from '@mui/icons-material/Sync';

import type { ToggleableBoolean } from '~/common/util/useToggleableBoolean';

type SetupFormRefetchButtonProps = {
  refetch: () => void,
  disabled: boolean,
  isLoading: boolean,
  hasError: boolean,
  leftButton?: React.ReactNode,
  showAdvanced?: ToggleableBoolean
}

/**
 * Bottom row: model reload and optional 'advanced' toggle
 */
export function SetupFormRefetchButton(props: SetupFormRefetchButtonProps) {
  const [refetching, setRefetching] = React.useState(false);

  const handleRefetch = async () => {
    setRefetching(true);
    try {
      await props.refetch();
    } catch (error) {
      console.error(error);
      // handle error here
    } finally {
      setRefetching(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>

      {props.leftButton}

      {!!props.showAdvanced && (
        <FormLabel onClick={props.showAdvanced.toggle} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
          {props.showAdvanced.on ? 'Hide Advanced' : 'Advanced'}
        </FormLabel>
      )}

      <Button
        color={props.hasError ? 'warning' : 'primary'}
        disabled={props.disabled || refetching}
        loading={refetching}
        endDecorator={<SyncIcon />}
        onClick={handleRefetch}
        data-testid="refetch-button"
        title="Refetch models"
        sx={{ minWidth: 120, ml: 'auto' }}
      >
        Models
      </Button>

    </Box>
  );
}
