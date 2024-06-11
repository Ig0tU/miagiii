import * as React from 'react';
import { shallow } from 'zustand/shallow';

import {
  Badge,
  Box,
  Button,
  IconButton,
  ListItemDecorator,
  MenuItem,
  Option,
  Select,
  Typography,
} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

import { getBackendCapabilities } from '~/modules/backend/store-backend-capabilities';

import { CloseableMenu } from '~/common/components/CloseableMenu';
import { ConfirmationModal } from '~/common/components/ConfirmationModal';
import { themeZIndexOverMobileDrawer } from '~/common/app.theme';
import { useIsMobile } from '~/common/components/useMatchMedia';

import { IModelVendor, DModelSourceId, ModelVendorId } from '../vendors/IModelVendor';
import { useModelsStore } from '../store-llms';
import { createModelSourceForVendor, findAllVendors, findVendorById, vendorHasBackendCap } from '../vendors/vendors.registry';

function VendorIcon({ vendor, greenMark }: { vendor: IModelVendor | null, greenMark: boolean }) {
  let icon: React.ReactNode = null;
  if (vendor?.Icon) {
    icon = <vendor.Icon />;
  }
  return (
    <Badge
      size='sm'
      badgeContent=''
      slotProps={{
        badge: {
          sx: {
            backgroundColor: 'lime',
            boxShadow: 'none',
            border: '1px solid gray',
            p: 0,
          },
        },
      }}
    >
      {greenMark && icon}
    </Badge>
  );
}

function ModelsSourceSelector({
  selectedSourceId,
  setSelectedSourceId,
}: {
  selectedSourceId: DModelSourceId | null;
  setSelectedSourceId: (sourceId: DModelSourceId | null) => void;
}) {
  const [vendorsMenuAnchor, setVendorsMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [confirmDeletionSourceId, setConfirmDeletionSourceId] = React.useState<DModelSourceId | null>(null);

  const isMobile = useIsMobile();
  const { modelSources, addModelSource, removeModelSource } = useModelsStore(
    (state) => ({
      modelSources: state.sources,
      addModelSource: state.addSource,
      removeModelSource: state.removeSource,
    }),
    shallow
  );

  const handleShowVendors = (event: React.MouseEvent<HTMLElement>) => setVendorsMenuAnchor(event.currentTarget);
  const closeVendorsMenu = () => setVendorsMenuAnchor(null);

  const handleAddSourceFromVendor = (vendorId: ModelVendorId) => {
    closeVendorsMenu();
    const { sources: modelSources } = useModelsStore.getState();
    const modelSource = createModelSourceForVendor(vendorId, modelSources);
    if (modelSource) {
      addModelSource(modelSource);
      setSelectedSourceId(modelSource.id);
    }
  };

  const enableDeleteButton = !!selectedSourceId && modelSources.length > 1;

  const handleDeleteSource = (id: DModelSourceId) => setConfirmDeletionSourceId(id);

  const handleDeleteSourceConfirmed = () => {
    if (confirmDeletionSourceId) {
      setSelectedSourceId(modelSources.find((source) => source.id !== confirmDeletionSourceId)?.id ?? null);
      removeModelSource(confirmDeletionSourceId);
      setConfirmDeletionSourceId(null);
    }
  };

  const vendorComponents = React.useMemo(() => {
    const backendCaps = getBackendCapabilities();
    return findAllVendors()
      .filter((v) => !!v.instanceLimit)
      .sort((a, b) => {
        if (a.location !== b.location) {
          return a.location === 'cloud' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map((vendor) => {
        const sourceInstanceCount = modelSources.filter((source) => source.vId === vendor.id).length;
        const enabled = vendor.instanceLimit > sourceInstanceCount;
        return {
          vendor,
          enabled,
          component: (
            <MenuItem
              key={vendor.id}
              disabled={!enabled}
              onClick={() => handleAddSourceFromVendor(vendor.id)}
            >
              <ListItemDecorator>
                <VendorIcon vendor={vendor} greenMark={vendorHasBackendCap(vendor, backendCaps)} />
              </ListItemDecorator>
              {vendor.name}
              {sourceInstanceCount > 0 && ' (added)'}
              {!!vendor.hasFreeModels && ' 🎁'}
              {vendor.instanceLimit > 1 && !!sourceInstanceCount && enabled && (
                <Typography component='span' level='body-sm'>
                  #{sourceInstanceCount + 1}
                </Typography>
              )}
              {vendor.location === 'local' && (
                <Typography component='span' level='body-sm'>
                  local
                </Typography>
              )}
            </MenuItem>
          ),
        };
      });
  }, [handleAddSourceFromVendor, modelSources]);

  const sourceItems = React.useMemo(() => {
    return modelSources.map((source) => {
      const icon = <VendorIcon vendor={findVendorById(source.vId)} greenMark={false} />;
      return {
        source,
        icon,
        component: (
          <Option key={source.id} value={source.id}>
            <ListItemDecorator>{icon}</ListItemDecorator>
            {source.label}
          </Option>
        ),
      };
    });
  }, [modelSources]);

  const selectedSourceItem = sourceItems.find((item) => item.source.id === selectedSourceId);
  const noSources = !sourceItems.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {!isMobile && <Typography sx={{ mr: 1 }}>Service:</Typography>}

      <Select
        variant='outlined'
        value={selectedSourceId}
        disabled={noSources}
        onChange={(_event, value) => value && setSelectedSourceId(value)}
        startDecorator={selectedSourceItem?.icon}
        slotProps={{
          root: { sx: { minWidth: 190 } },
          indicator: { sx: { opacity: 0.5 } },
        }}
      >
        {sourceItems.map((item) => item.component)}
      </Select>

      {isMobile ? (
        <IconButton
          variant={noSources ? 'solid' : 'plain'}
          color='primary'
          onClick={handleShowVendors}
          disabled={!!vendorsMenuAnchor}
        >
          <AddIcon />
        </IconButton>
      ) : (
        <Button
          variant={noSources ? 'solid' : 'plain'}
          onClick={handleShowVendors}
          disabled={!!vendorsMenuAnchor}
          startDecorator={<AddIcon />}
        >
          Add
        </Button>
      )}

      <IconButton
        variant='plain'
        color='neutral'
        disabled={!enableDeleteButton}
        sx={{ ml: 'auto' }}
        onClick={() => selectedSourceId && handleDeleteSource(selectedSourceId)}
      >
        <DeleteOutlineIcon />
      </IconButton>

      <CloseableMenu
        placement='bottom-start'
        zIndex={themeZIndexOverMobileDrawer}
        open={!!vendorsMenuAnchor}
        anchorEl={vendorsMenuAnchor}
        onClose={closeVendorsMenu}
        sx={{ minWidth: 200 }}
      >
        {vendorComponents}
      </CloseableMenu>

      <ConfirmationModal
        open={!!confirmDeletionSourceId}
        onClose={() => setConfirmDeletionSourceId(null)}
        onPositive={handleDeleteSourceConfirmed}
        confirmationText={
          'Are you sure you want to remove these models? The configuration data will be lost and you may have to enter it again.'
        }
        positiveActionText={'Remove'}
      />
    </Box>
  );
}

export default ModelsSourceSelector;
