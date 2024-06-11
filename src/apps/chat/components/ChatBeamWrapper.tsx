import * as React from 'react';
import type { SxProps } from '@mui/joy/styles/types';
import { Box, Modal, ModalClose } from '@mui/joy';
import { ScrollToBottom } from '~/common/scroll-to-bottom/ScrollToBottom';
import { BeamStoreApi, useBeamStore } from '~/modules/beam/store-beam.hooks';
import { BeamView } from '~/modules/beam/BeamView';

type ChatBeamWrapperProps = {
  beamStore: BeamStoreApi;
  isMobile: boolean;
  inlineSx?: SxProps;
}

export function ChatBeamWrapper({ beamStore, isMobile, inlineSx }: ChatBeamWrapperProps) {
  // state
  const { isMaximized } = useBeamStore(beamStore, state => ({
    isMaximized: state.isMaximized,
  }));

  const handleUnMaximize = React.useCallback(() => {
    beamStore.getState().setIsMaximized(false);
  }, [beamStore]);

  // memo the beamview
  const beamView = React.useMemo(() => (
    <BeamView
      beamStore={beamStore}
      isMobile={isMobile}
      showExplainer
    />
  ), [beamStore, isMobile]);

  return isMaximized ? (
    <Modal open onClose={handleUnMaximize}>
      <Box sx={{
        backgroundColor: 'background.level1',
        position: 'absolute',
        inset: 0,
      }}>
        <ScrollToBottom disableAutoStick>
          {beamView}
        </ScrollToBottom>
        <ModalClose sx={{ color: 'white', backgroundColor: 'background.surface', boxShadow: 'xs', mr: 2 }} />
      </Box>
    </Modal>
  ) : (
    <Box sx={inlineSx}>
      {beamView}
    </Box>
  );
}
