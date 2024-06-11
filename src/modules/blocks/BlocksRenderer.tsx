import React, { forwardRef, useRef, useMemo, useState, useCallback } from 'react';
import TimeAgo from 'react-timeago';
import type { Diff as TextDiff } from '@sanity/diff-match-patch';
import { Box, Button, Tooltip, Typography } from '@mui/joy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RenderCode, { RenderCodeMemo } from './code/RenderCode';
import RenderHtml from './RenderHtml';
import RenderImage from './RenderImage';
import RenderMarkdown, { RenderMarkdownMemo } from './markdown/RenderMarkdown';
import RenderChatText from './RenderChatText';
import RenderTextDiff from './RenderTextDiff';
import { areBlocksEqual, Block, parseMessageBlocks } from './blocks';

const USER_COLLAPSED_LINES = 7;

const blocksSx = {
  my: 'auto',
  lineHeight: 1.5,
};

const editBlocksSx = {
  ...blocksSx,
  flexGrow: 1,
};

const renderBlocksSx = {
  ...blocksSx,
  flexGrow: 0,
  overflowX: 'auto',
  '& *::selection': {
    backgroundColor: '#fc70c3',
    color: 'primary.solidColor',
  },
};

type BlocksRendererProps = {
  text: string;
  fromRole: string;
  contentScaling: ContentScaling;
  renderTextAsMarkdown: boolean;
  renderTextDiff?: TextDiff[];
  errorMessage?: React.ReactNode;
  fitScreen: boolean;
  isBottom?: boolean;
  showDate?: number;
  showUnsafeHtml?: boolean;
  wasUserEdited?: boolean;
  specialDiagramMode?: boolean;
  onContextMenu?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onImageRegenerate?: () => void;
  optiAllowMemo?: boolean;
};

export const BlocksRenderer = forwardRef<HTMLDivElement, BlocksRendererProps>(
  (props, ref) => {
    const [forceUserExpanded, setForceUserExpanded] = useState(false);
    const prevBlocksRef = useRef<Block[]>([]);

    const {
      text: _text,
      errorMessage,
      renderTextDiff,
      wasUserEdited = false,
      fromRole,
    } = props;

    const fromAssistant = fromRole === 'assistant';
    const fromSystem = fromRole === 'system';
    const fromUser = fromRole === 'user';

    const { text: displayedText, isTextCollapsed } = useMemo(() => {
      if (fromUser && !forceUserExpanded) {
        const textLines = _text.split('\n');
        if (textLines.length > USER_COLLAPSED_LINES)
          return { text: textLines.slice(0, USER_COLLAPSED_LINES).join('\n'), isTextCollapsed: true };
      }
      return { text: _text, isTextCollapsed: false };
    }, [forceUserExpanded, fromUser, _text]);

    const handleTextCollapse = useCallback(() => {
      setForceUserExpanded(false);
    }, []);

    const handleTextUncollapse = useCallback(() => {
      setForceUserExpanded(true);
    }, []);

    const scaledCodeSx = useMemo(() => ({
      my: props.specialDiagramMode ? 0 : themeScalingMap[props.contentScaling]?.blockCodeMarginY ?? 0,
      backgroundColor: props.specialDiagramMode ? 'background.surface' : fromAssistant ? 'neutral.plainHoverBg' : 'primary.plainActiveBg',
      boxShadow: props.specialDiagramMode ? undefined : 'inset 2px 0px 5px -4px var(--joy-palette-background-backdrop)',
      borderRadius: 'sm',
      fontFamily: 'code',
      fontSize: themeScalingMap[props.contentScaling]?.blockCodeFontSize ?? '0.875rem',
      fontWeight: 'md',
      fontVariantLigatures: 'none',
      lineHeight: themeScalingMap[props.contentScaling]?.blockLineHeight ?? 1.75,
    }), [fromAssistant, props.contentScaling, props.specialDiagramMode]);

    const scaledImageSx = useMemo(() => ({
      fontSize: themeScalingMap[props.contentScaling]?.blockFontSize ?? undefined,
      lineHeight: themeScalingMap[props.contentScaling]?.blockLineHeight ?? 1.75,
      marginBottom: themeScalingMap[props.contentScaling]?.blockImageGap ?? 1.5,
    }), [props.contentScaling]);

    const scaledTypographySx = useMemo(() => ({
      fontSize: themeScalingMap[props.contentScaling]?.blockFontSize ?? undefined,
      lineHeight: themeScalingMap[props.contentScaling]?.blockLineHeight ?? 1.75,
    }), [props.contentScaling]);

    const blocks = useMemo(() => {
      const newBlocks = errorMessage ? [] : parseMessageBlocks(displayedText, fromSystem, renderTextDiff);

      const recycledBlocks: Block[] = [];
      for (let i = 0; i < newBlocks.length; i++) {
        const newBlock = newBlocks[i];
        const prevBlock = prevBlocksRef.current[i];

        if (prevBlock && areBlocksEqual(prevBlock, newBlock)) {
          recycledBlocks.push(prevBlock);
        } else {
          recycledBlocks.push(...newBlocks.slice(i));
          break;
        }
      }

      prevBlocksRef.current = recycledBlocks;

      return props.specialDiagramMode
        ? recycledBlocks.filter(block => block.type === 'code' || recycledBlocks.length === 1)
        : recycledBlocks;
    }, [errorMessage, fromSystem, props.specialDiagramMode, renderTextDiff, displayedText]);

    return (
      <Box
        ref={ref}
        onContextMenu={props.onContextMenu}
        onDoubleClick={props.onDoubleClick}
        sx={renderBlocksSx}
      >
        {!!props.showDate && (
          <Typography level='body-sm' sx={{ mx: 1.5, textAlign: fromAssistant ? 'left' : 'right' }}>
            <TimeAgo date={props.showDate} />
          </Typography>
        )}

        {fromSystem && wasUserEdited && (
          <Typography level='body-sm' color='warning' sx={{ mt: 1, mx: 1.5 }}>modified by user - auto-update disabled</Typography>
        )}

        {errorMessage ? (
          <Tooltip title={<Typography sx={{ maxWidth: 800 }}>{text}</Typography>} variant='soft'>
            <InlineError error={errorMessage} />
          </Tooltip>
        ) : (
          blocks.map(
            (block, index) => {
              const OptimizedRenderCodeMemoOrNot = props.optiAllowMemo && index !== blocks.length - 1 ? RenderCodeMemo : RenderCode;
              const OptimizedRenderMarkdownMemoOrNot = props.optiAllowMemo && index !== blocks.length - 1 ? RenderMarkdownMemo : RenderMarkdown;
              return block.type === 'html'
                ? <RenderHtml key={'html-' + index} htmlBlock={block} sx={scaledCodeSx} />
                : block.type === 'code'
                  ? <OptimizedRenderCodeMemoOrNot key={'code-' + index} codeBlock={block} fitScreen={props.fitScreen} initialShowHTML={props.showUnsafeHtml} noCopyButton={props.specialDiagramMode} optimizeLightweight={!props.optiAllowMemo} sx={scaledCodeSx} />
                  : block.type === 'image'
                    ? <RenderImage key={'image-' + index} imageBlock={block} onRunAgain={props.isBottom ? props.onImageRegenerate : undefined} sx={scaledImageSx} />
                    : block.type === 'diff'
                      ? <RenderTextDiff key={'text-diff-' + index} diffBlock={block} sx={scaledTypographySx} />
                      : (props.renderTextAsMarkdown && !fromSystem && !(fromUser && block.content.startsWith('/')))
                        ? <OptimizedRenderMarkdownMemoOrNot key={'text-md-' + index} textBlock={block} sx={scaledTypographySx} />
                        : <RenderChatText key={'text-' + index} textBlock={block} sx={scaledTypographySx} />;
            }
          )
        )}

        {isTextCollapsed ? (
          <Box sx={{ textAlign: 'right' }}><Button variant='soft' size='sm' onClick={handleTextUncollapse} startDecorator={<ExpandMoreIcon />} sx={{ minWidth: 120 }}>Expand</Button></Box>
        ) : forceUserExpanded && (
          <Box sx={{ textAlign: 'right' }}><Button variant='soft' size='sm' onClick={handleTextCollapse} startDecorator={<ExpandLessIcon />} sx={{ minWidth: 120 }}>Collapse</Button></Box>
        )}
      </Box>
    );
  }
);

BlocksRenderer.displayName = 'BlocksRenderer';
