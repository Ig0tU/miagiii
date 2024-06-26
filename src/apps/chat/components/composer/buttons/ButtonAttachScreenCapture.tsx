import * as React from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/joy';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import { takeScreenCapture } from '~/common/util/screenCaptureUtils';

type ButtonAttachScreenCaptureProps = {
  isMobile?: boolean;
  onAttachScreenCapture: (file: File) => void;
};

const ButtonAttachScreenCapture: React.FC<ButtonAttachScreenCaptureProps> = ({ isMobile, onAttachScreenCapture }) => {
  const [capturing, setCapturing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTakeScreenCapture = React.useCallback(async () => {
    setError(null);
    setCapturing(true);
    try {
      const file = await takeScreenCapture();
      file && onAttachScreenCapture(file);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      setError(`Screen capture issue: ${message}`);
    }
    setCapturing(false);
  }, [onAttachScreenCapture]);

  return isMobile ? (
    <IconButton onClick={handleTakeScreenCapture}>
      <ScreenshotMonitorIcon />
    </IconButton>
  ) : (
    <Tooltip
      arrow
      disableInteractive
      variant="solid"
      placement="top-start"
      title={
        <Box sx={{ px: 1, py: 0.75, lineHeight: '1.5rem' }}>
          <b>Attach screen capture</b><br />
          {error || 'Attach the image of a window, a browser tab, or a screen'}
        </Box>
      }
    >
      <Button
        fullWidth
        variant={capturing ? 'solid' : 'plain'}
        color={!!error ? 'danger' : 'neutral'}
        onClick={handleTakeScreenCapture}
        loading={capturing}
        startDecorator={<ScreenshotMonitorIcon />}
        sx={{ justifyContent: 'flex-start' }}
      >
        Screen
      </Button>
    </Tooltip>
  );
};

export const MemoizedButtonAttachScreenCapture = React.memo(ButtonAttachScreenCapture);
