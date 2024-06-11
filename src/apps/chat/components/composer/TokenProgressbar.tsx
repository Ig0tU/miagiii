import * as React from 'react';
import { Box, useTheme } from '@mui/joy';
import { TokenTooltip, tokensPrettyMath } from './TokenBadge';

/**
 * Progress bar, with curves to match the rounded-corners Textarea
 *
 * The Textarea contains it within the Composer (at least).
 */
const TokenProgressbarMemo = React.memo(TokenProgressbar);

function TokenProgressbar({
  direct,
  history,
  responseMax,
  limit,
  tokenPriceIn,
  tokenPriceOut,
}) {
  const theme = useTheme();

  if (!(limit > 0) || (!direct && !history && !responseMax)) return null;

  const historyPct = (history / limit) * 100;
  const responsePct = (responseMax / limit) * 100;
  const directPct = (direct / limit) * 100;
  const totalPct = historyPct + responsePct + directPct;
  const isOverflow = totalPct > 100;

  const scale = isOverflow ? 100 / totalPct : 1;
  const scaledHistoryPct = historyPct * scale;
  const scaledResponsePct = responsePct * scale;
  const scaledDirectPct = directPct * scale;

  const historyColor = theme.palette.primary.softActiveBg;
  const directColor = theme.palette.primary.solidBg;
  const responseColor = theme.palette.neutral.softActiveBg;
  const overflowColor = theme.palette.danger.softColor;

  const { message, color } = tokensPrettyMath(
    limit,
    direct,
    history,
    responseMax,
    tokenPriceIn,
    tokenPriceOut
  );

  const containerHeight = 8;
  const barHeight = isOverflow ? 8 : 4;

  return (
    <TokenTooltip color={color} message={!direct ? message : null}>
      <Box
        sx={{
          position: 'absolute',
          left: 1,
          right: 1,
          bottom: 1,
          height: containerHeight,
          overflow: 'hidden',
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
        }}
      >
        {scaledHistoryPct > 0 && (
          <Box
            sx={{
              background: historyColor,
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: `${scaledHistoryPct}%`,
              height: barHeight,
            }}
          />
        )}

        {scaledDirectPct > 0 && (
          <Box
            sx={{
              background: directColor,
              position: 'absolute',
              left: `${scaledHistoryPct}%`,
              bottom: 0,
              width: `${scaledDirectPct}%`,
              height: barHeight,
            }}
          />
        )}

        {scaledResponsePct > 0 && (
          <Box
            sx={{
              background: responseColor,
              position: 'absolute',
              left: `${totalPct > 100 ? scaledHistoryPct + scaledDirectPct : 100 - scaledResponsePct}%`,
              bottom: 0,
              width: `${scaledResponsePct}%`,
              height: barHeight,
            }}
          />
        )}

        {isOverflow && (
          <Box
            sx={{
              background: overflowColor,
              position: 'absolute',
              left: `${totalPct > 100 ? scaledHistoryPct + scaledDirectPct + scaledResponsePct : 100}%`,
              right: 0,
              bottom: 0,
              height: barHeight,
            }}
          />
        )}
      </Box>
    </TokenTooltip>
  );
}

export { TokenProgressbarMemo as TokenProgressbar };
