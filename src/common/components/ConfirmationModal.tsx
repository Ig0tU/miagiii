import * as React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/joy';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CloseIcon from '@mui/icons-material/Close';

import { GoodModal } from '~/common/components/GoodModal';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string | React.ReactNode;
  noTitleBar?: boolean;
  lowStakes?: boolean;
  content?: string | React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  cancelStartDecorator?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  noTitleBar = false,
  lowStakes = false,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  cancelStartDecorator,
}: ConfirmationModalProps) {
  const theme = useTheme();

  return (
    <GoodModal
      open={isOpen}
      title={noTitleBar ? undefined : title}
      titleStartDecorator={
        noTitleBar ? undefined : (
          <IconButton
            size="sm"
            color="neutral"
            onClick={onClose}
            sx={{ p: '4px' }}
          >
            <CloseIcon />
          </IconButton>
        )
      }
      noTitleBar={noTitleBar}
      onClose={onClose}
      hideBottomClose
    >
      {!noTitleBar && <Divider />}

      {content && (
        <Typography level="body-md" sx={{ mt: theme.spacing(1.5) }}>
          {content}
        </Typography>
      )}

      {lowStakes && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <WarningRoundedIcon color="warning" />
          <Typography level="body-sm" sx={{ ml: 1 }}>
            This is a low stakes action
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
        <Button
          autoFocus
          variant="plain"
          color="neutral"
          onClick={onClose}
          startDecorator={cancelStartDecorator}
        >
          {cancelText}
        </Button>
        <Button
          variant={lowStakes ? 'soft' : 'solid'}
          color={lowStakes ? undefined : 'danger'}
          onClick={onConfirm}
          sx={{ lineHeight: '1.5em' }}
        >
          {confirmText}
        </Button>
      </Box>
    </GoodModal>
  );
}
