import * as React from 'react';
import { Badge, Box, ColorPaletteProp, Tooltip } from '@mui/joy';

interface TokenMathOutput {
  color: ColorPaletteProp;
  message: string;
  remainingTokens: number;
  costMax?: number;
  costMin?: number;
}

function alignRight(value: number, columnSize: number = 8) {
  const str = value.toLocaleString();
  return str.padStart(columnSize);
}

function formatCost(cost: number) {
  return cost < 1
    ? (cost * 100).toFixed(cost < 0.010 ? 2 : 1) + ' ¢'
    : '$ ' + cost.toFixed(2);
}

function tokensPrettyMath(
  tokenLimit: number | 0,
  directTokens: number,
  historyTokens?: number,
  responseMaxTokens?: number,
  tokenPriceIn?: number,
  tokenPriceOut?: number
): TokenMathOutput {
  const usedInputTokens = directTokens + (historyTokens || 0);
  const usedMaxTokens = usedInputTokens + (responseMaxTokens || 0);
  const remainingTokens = tokenLimit - usedMaxTokens;
  const gteLimit = remainingTokens <= 0 && tokenLimit > 0;

  let message = gteLimit ? '⚠️ ' : '';

  let costMax: number | undefined = undefined;
  let costMin: number | undefined = undefined;

  if (!tokenLimit) {
    message += `Requested: ${usedMaxTokens.toLocaleString()} tokens`;
  } else if (historyTokens || responseMaxTokens) {
    message +=
      `▶ ${Math.abs(remainingTokens).toLocaleString()} ${remainingTokens >= 0 ? 'available' : 'excess'} message tokens\n\n` +
      ` = Model max tokens: ${alignRight(tokenLimit)}\n` +
      `     - This message: ${alignRight(directTokens)}\n` +
      `          - History: ${alignRight(historyTokens || 0)}\n` +
      `     - Max response: ${alignRight(responseMaxTokens || 0)}`;

    if (tokenPriceIn || tokenPriceOut) {
      costMin = tokenPriceIn ? usedInputTokens * tokenPriceIn / 1E6 : undefined;
      const costOutMax = tokenPriceOut && responseMaxTokens ? responseMaxTokens * tokenPriceOut / 1E6 : undefined;

      if (costMin || costOutMax) {
        message += `\n\n\n▶ Chat Turn Cost (max, approximate)\n`;

        if (costMin) message += '\n' +
          `       Input tokens: ${alignRight(usedInputTokens)}\n` +
          `    Input Price $/M: ${(tokenPriceIn!.toFixed(2)).padStart(8)}\n` +
          `         Input cost: ${('$' + costMin!.toFixed(4)).padStart(8)}\n`;

        if (costOutMax) message += '\n' +
          `  Max output tokens: ${alignRight(responseMaxTokens!)}\n` +
          `   Output Price $/M: ${(tokenPriceOut!.toFixed(2)).padStart(8)}\n` +
          `    Max output cost: ${('$' + costOutMax!.toFixed(4)).padStart(8)}\n`;

        if (costMin) message += '\n' +
          `    > Min turn cost: ${formatCost(costMin).padStart(8)}`;
        costMax = costMin && costOutMax ? costMin + costOutMax : undefined;
        if (costMax) message += '\n' +
          `    < Max turn cost: ${formatCost(costMax).padStart(8)}`;
      }
    }
  } else {
    message +=
      `${(tokenLimit + usedMaxTokens).toLocaleString()} available tokens after deleting this\n\n` +
      ` = Currently free: ${alignRight(tokenLimit)}\n` +
      `   + This message: ${alignRight(usedMaxTokens)}`;
  }

  const color: ColorPaletteProp =
    tokenLimit && remainingTokens < 0
      ? 'danger'
      : remainingTokens < tokenLimit / 4
        ? 'warning'
        : 'primary';

  return { color, message, remainingTokens, costMax, costMin };
}

interface TokenTooltipProps {
  message: string | null;
  color: ColorPaletteProp;
  placement?: 'top' | 'top-end';
  children: React.ReactElement;
}

const TokenTooltip = (props: TokenTooltipProps) =>
  <Tooltip
    placement={props.placement}
    variant={props.color !== 'primary' ? 'solid' : 'soft'} color={props.color}
    title={<Box sx={{ p: 2, whiteSpace: 'pre' }}>{props.message}</Box>}
    sx={{
      fontFamily: 'code',
      // fontSize: '0.8125rem',
      border: '1px solid',
      borderColor: `${props.color}.outlinedColor`,
      boxShadow: 'md',
    }}
  >
    {props.children}
  </Tooltip>;

interface TokenBadgeProps {
  direct: number;
  history?: number;
  responseMax?: number;
  limit: number;
  tokenPriceIn?: number;
  tokenPriceOut?: number;
  showCost?: boolean;
  showExcess?: boolean;
  absoluteBottomRight?: boolean;
  inline?: boolean;
}

const TokenBadgeMemo = React.memo(TokenBadge);

function TokenBadge(props: TokenBadgeProps) {
  const { message, color, remainingTokens, costMax, costMin } =
    tokensPrettyMath(props.limit, props.direct, props.history, props.responseMax, props.tokenPriceIn, props.tokenPriceOut);

  let badgeValue = '';

  const showAltCosts = !!props.showCost && !!costMax && costMin !== undefined;
  if (showAltCosts) {
    badgeValue = '< ' + formatCost(costMax);
  } else {
    const value = props.showExcess && remainingTokens <= 0 && props.limit ?
      Math.abs(remainingTokens) : props.direct;

    badgeValue = value.toLocaleString();
  }

  const shallHide = !props.direct && remainingTokens >= 0 && !showAltCosts;
  if (shallHide) return null;

  return (
    <TokenTooltip color={color} message={message} placement='top-end'>
      <Badge
        variant='soft' color={color} max={1000000}
        badgeContent={badgeValue}
        slotProps={{
          root: {
            sx: {
              ...(props.absoluteBottomRight && { position: 'absolute', bottom: 8, right: 8 }),
              cursor: 'help',
            },
          },
          badge: {
            sx: {
              // the badge (not the tooltip)
              fontFamily: 'code',
              fontSize: 'xs',
              ...(props.absoluteBottomRight || props.inline && { position: 'static', transform: 'none' }),
            },
          },
        }}
      />
    </TokenTooltip>
  );
}

export { TokenBadgeMemo as TokenBadge };
