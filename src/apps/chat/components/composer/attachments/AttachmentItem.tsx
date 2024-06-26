import * as React from 'react';

import {
  Box,
  Button,
  CircularProgress,
  ColorPaletteProp,
  Sheet,
  Typography,
} from '@mui/joy';
import AbcIcon from '@mui/icons-material/Abc';
import CodeIcon from '@mui/icons-material/Code';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import TelegramIcon from '@mui/icons-material/Telegram';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextureIcon from '@mui/icons-material/Texture';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { GoodTooltip } from '~/common/components/GoodTooltip';
import { ellipsizeFront, ellipsizeMiddle } from '~/common/util/textUtils';

import { Attachment, AttachmentConverterType, AttachmentId } from './store-attachments';
import { LLMAttachment } from './useLLMAttachments';

const ATTACHMENT_MIN_STYLE = {
  height: '100%',
  minHeight: '40px',
  minWidth: '64px',
};

const DEFAULT_ELLIPSIZED_LABEL_LENGTH = 30;

const converterTypeToIconMap: { [key in AttachmentConverterType]: React.ComponentType<any> } = {
  'text': TextFieldsIcon,
  'rich-text': CodeIcon,
  'rich-text-table': PivotTableChartIcon,
  'pdf-text': PictureAsPdfIcon,
  'pdf-images': PictureAsPdfIcon,
  'image': ImageOutlinedIcon,
  'image-ocr': AbcIcon,
  'ego-message-md': TelegramIcon,
  'unhandled': TextureIcon,
};

const getAttachmentIcon = (attachment: Attachment) => {
  const converter = attachment.converterIdx !== null ? attachment.converters[attachment.converterIdx] ?? null : null;
  if (converter && converter.id) {
    const Icon = converterTypeToIconMap[converter.id] ?? null;
    if (Icon)
      return <Icon sx={{ width: 24, height: 24 }} />;
  }
  return null;
};

const getAttachmentLabelText = (attachment: Attachment): string => {
  const converter = attachment.converterIdx !== null ? attachment.converters[attachment.converterIdx] ?? null : null;
  if (converter && attachment.label === 'Rich Text') {
    if (converter.id === 'rich-text-table')
      return 'Rich Table';
    if (converter.id === 'rich-text')
      return 'Rich HTML';
  }
  return ellipsizeFront(attachment.label, 24);
};

const getAttachmentLabel = (attachment: Attachment) => {
  const label = attachment.source.media !== 'text' ? `${attachment.source.media}: ` : '';
  return ellipsizeMiddle(`${label}${attachment.label}`, DEFAULT_ELLIPSIZED_LABEL_LENGTH);
};

const LoadingIndicator = React.forwardRef((props: { label: string }, ref) =>
  <Sheet
    color='success' variant='soft'
    sx={{
      border: '1px solid',
      borderColor: 'success.solidBg',
      borderRadius: 'sm',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
      ...ATTACHMENT_MIN_STYLE,
      boxSizing: 'border-box',
      px: 1,
      py: 0.5,
    }}
  >
    <CircularProgress color='success' size='sm' />
    <Typography level='title-sm' sx={{ whiteSpace: 'nowrap' }}>
      {getAttachmentLabel(props.label)}
    </Typography>
  </Sheet>,
);
LoadingIndicator.displayName = 'LoadingIndicator';

const InputErrorIndicator = () =>
  <WarningRoundedIcon sx={{ color: 'danger.solidBg' }} />;


interface AttachmentItemProps {
  llmAttachment: LLMAttachment;
  menuShown: boolean;
  onItemMenuToggle: (attachmentId: AttachmentId, anchor: HTMLAnchorElement) => void;
}

export function AttachmentItem(props: AttachmentItemProps) {
  const {
    llmAttachment: {
      attachment,
      isUnconvertible,
      isOutputMissing,
      isOutputAttachable,
      inputError,
      inputLoading,
      outputsConverting,
    },
    menuShown,
    onItemMenuToggle,
  } = props;

  const isInputError = Boolean(inputError);
  const showWarning = isUnconvertible || isOutputMissing || !isOutputAttachable;

  const handleToggleMenu = React.useCallback((event) => {
    event.preventDefault();
    onItemMenuToggle(attachment.id, event.currentTarget);
  }, [attachment, onItemMenuToggle]);

  let tooltip = getAttachmentLabel(attachment);
  let color: ColorPaletteProp;
  let buttonVariant: 'soft' | 'outlined' | 'contained' = 'soft';

  if (inputLoading || outputsConverting) {
    color = 'success';
  } else if (isInputError) {
    tooltip = `Issue loading the attachment: ${inputError}\n\n${tooltip}`;
    color = 'danger';
  } else if (showWarning) {
    tooltip = menuShown
      ? null
      : isUnconvertible
        ? `Attachments of type '${attachment.input?.mimeType}' are not supported yet. You can open a feature request on GitHub.\n\n${tooltip}`
        : `Not compatible with the selected LLM or not supported. Please select another format.\n\n${tooltip}`;
    color = 'warning';
  } else {
    // all good
    tooltip = null;
    color = /*menuShown ? 'primary' :*/ 'neutral';
    buttonVariant = 'outlined';
  }

  return (
    <Box>
      <GoodTooltip
        title={tooltip}
        isError={isInputError}
        isWarning={showWarning}
        sx={{ p: 1, whiteSpace: 'break-spaces' }}
      >
        {inputLoading
          ? <LoadingIndicator label={attachment} />
          : (
            <Button
              size='sm'
              variant={buttonVariant} color={color}
              onClick={handleToggleMenu}
              onContextMenu={handleToggleMenu}
              sx={{
                backgroundColor: menuShown ? `${color}.softActiveBg` : buttonVariant === 'outlined' ? 'background.popup' : undefined,
                border: buttonVariant === 'soft' ? '1px solid' : undefined,
                borderColor: buttonVariant === 'soft' ? `${color}.solidBg` : undefined,
                borderRadius: 'sm',
                ...ATTACHMENT_MIN_STYLE,
                px: 1, py: 0.5,
                display: 'flex', flexDirection: 'row', gap: 1,
              }}
            >
              {isInputError
                ? <InputErrorIndicator />
                : <>
                  {getAttachmentIcon(attachment)}
                  {outputsConverting
                    ? <>Converting <CircularProgress color='success' size='sm' /></>
                    : <Typography level='title-sm' sx={{ whiteSpace: 'nowrap' }}>
                      {getAttachmentLabelText(attachment)}
                    </Typography>}
                </>}
            </Button>
          )}
      </GoodTooltip>
    </Box>
  );
}
