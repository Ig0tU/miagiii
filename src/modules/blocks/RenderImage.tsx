import * as React from 'react';
import type { SxProps } from '@mui/joy/styles/types';
import { Alert, Box, IconButton, Sheet } from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReplayIcon from '@mui/icons-material/Replay';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { GoodTooltip } from '~/common/components/GoodTooltip';
import { Link } from '~/common/components/Link';
import { OverlayButton, overlayButtonsSx } from './code/RenderCode';
import type { ImageBlock } from './blocks';

const mdImageReferenceRegex = /^!\[([^\]]*)]\(([^)]+)\)$/;
const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)/i;
const prodiaUrlRegex = /^(https?:\/\/images\.prodia\.\S+)$/i;

/**
 * Checks if the entire content consists solely of Markdown image references.
 * If so, returns an array of ImageBlock objects for each image reference.
 * If any non-image content is present or if there are no image references, returns null.
 */
export function heuristicMarkdownImageReferenceBlocks(fullText: string) {
  const imageBlocks: ImageBlock[] = [];
  for (const line of fullText.split('\n')) {
    if (line.trim() === '') continue; // skip empty lines
    const match = mdImageReferenceRegex.exec(line);
    if (match && imageExtensions.test(match[2])) {
      const alt = match[1];
      const url = match[2];
      imageBlocks.push({ type: 'image', url, alt });
    } else {
      return null;
    }
  }
  return imageBlocks.length > 0 ? imageBlocks : null;
}

export function heuristicLegacyImageBlocks(fullText: string): ImageBlock[] | null {
  const imageBlocks: ImageBlock[] = [];
  for (const line of fullText.split('\n')) {
    const match = prodiaUrlRegex.exec(line);
    if (match) {
      const url = match[1];
      imageBlocks.push({ type: 'image', url });
    } else {
      return null;
    }
  }
  return imageBlocks.length > 0 ? imageBlocks : null;
}

export const RenderImage = (props: {
  imageBlock: ImageBlock;
  noTooltip?: boolean;
  onRunAgain?: (e: React.MouseEvent) => void;
  sx?: SxProps;
}) => {
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(true);
  const { url, alt } = props.imageBlock;
  const isTempDalleUrl = url.startsWith('https://oaidalle');

  React.useEffect(() => {
    if (isTempDalleUrl) {
      const timer = setTimeout(() => setShowAlert(false), 3600000); // hide alert after 1 hour
      return () => clearTimeout(timer);
    }
  }, [isTempDalleUrl]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Sheet
        variant='solid'
        sx={{
          mx: 1.5,
          minWidth: 256,
          minHeight: 128,
          boxShadow: 'md',
          position: 'relative',
          display: 'grid',
          justifyContent: 'center',
          alignItems: 'center',
          '& picture': { display: 'flex' },
          '& img': { maxWidth: '100%', maxHeight: '100%' },
          '&:hover > .overlay-buttons': { opacity: 1 },
          ...props.sx,
        }}
      >
        <picture>
          <img src={url} alt={alt ? `Generated Image: ${alt}` : 'Generated Image'} />
        </picture>

        {!!alt && (
          <Box sx={{ p: { xs: 1, md: 3 }, position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
            {alt}
          </Box>
        )}

        <Box className='overlay-buttons' sx={{ ...overlayButtonsSx, pt: 0.5, px: 0.5, gap: 0.5, position: 'absolute', top: 0, right: 0 }}>
          {!!props.onRunAgain && (
            <GoodTooltip title='Draw again'>
              <OverlayButton variant='outlined' onClick={props.onRunAgain}>
                <ReplayIcon />
              </OverlayButton>
            </GoodTooltip>
          )}

          {!!alt && (
            <GoodTooltip title={infoOpen ? 'Hide Prompt' : 'Show Prompt'}>
              <OverlayButton variant={infoOpen ? 'solid' : 'outlined'} onClick={() => setInfoOpen(open => !open)}>
                <InfoOutlinedIcon />
              </OverlayButton>
            </GoodTooltip>
          )}

          <GoodTooltip title='Open in new tab'>
            <OverlayButton variant='outlined' component={Link} href={url} download={alt || 'image'} target='_blank'>
              <OpenInNewIcon />
            </OverlayButton>
          </GoodTooltip>
        </Box>
      </Sheet>

      {isTempDalleUrl && showAlert && (
        <Alert
          variant='soft' color='neutral'
          startDecorator={<WarningRoundedIcon />}
          endDecorator={
            <IconButton variant='soft' aria-label='Close Alert' onClick={() => setShowAlert(on => !on)} sx={{ my: -0.5 }}>
              <CloseRoundedIcon />
            </IconButton>
          }
          sx={{
            mx: 0.5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            ...props.sx,
          }}
        >
          <div>
            <strong>Please Save Locally</strong> · OpenAI will delete this image link from their servers one hour after creation.
          </div>
        </Alert>
      )}
    </Box>
  );
};
