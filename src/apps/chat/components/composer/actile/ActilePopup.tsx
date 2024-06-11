import * as React from 'react';

import { Box, ListItem, ListItemButton, ListItemDecorator, Sheet, Typography } from '@mui/joy';

import { CloseableMenu } from '~/common/components/CloseableMenu';

export interface ActileItem {
  key: string;
  label: string;
  Icon?: React.ComponentType;
  argument?: string;
  description?: string;
  onClick?: () => void;
}

export function ActilePopup(props: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title?: string;
  items: ActileItem[];
  activeItemIndex: number | undefined;
  activePrefixLength: number;
  onItemClick: (item: ActileItem) => void;
  children?: React.ReactNode;
}) {
  const hasAnyIcon = props.items.some(item => !!item.Icon);

  const listItemRef = React.useRef<HTMLLIElement>(null);

  return (
    <CloseableMenu
      noTopPadding
      noBottomPadding
      open
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      sx={{ minWidth: 320 }}
      ref={listItemRef}
    >
      {!!props.title && (
        <Sheet variant="soft" sx={{ p: 1, borderBottom: '1px solid', borderBottomColor: 'neutral.softActiveBg' }}>
          <Typography id={props.title} level="title-sm">
            {props.title}
          </Typography>
        </Sheet>
      )}

      {!props.items.length && (
        <ListItem variant="soft" color="warning">
          <Typography level="body-md">
            No matching command
          </Typography>
        </ListItem>
      )}

      {props.items.map((item, idx) => {
        const isActive = idx === props.activeItemIndex;
        const labelBold = item.label.slice(0, props.activePrefixLength);
        const labelNormal = item.label.slice(props.activePrefixLength);
        return (
          <ListItem
            key={item.key}
            variant={isActive ? 'soft' : undefined}
            color={isActive ? 'primary' : undefined}
            onClick={item.onClick}
            sx={{
              '&:focus': {
                backgroundColor: 'primary.softBg',
                color: 'primary.contrastText',
                '& svg': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemButton
              color="primary"
              disabled={!item.onClick}
              onClick={() => props.onItemClick(item)}
            >
              {hasAnyIcon && (
                <ListItemDecorator>
                  {item.Icon ? <item.Icon /> : null}
                </ListItemDecorator>
              )}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    id={`${item.label}-bold`}
                    level="title-sm"
                    color={isActive ? 'primary' : undefined}
                  >
                    <span style={{ textDecoration: 'underline' }}><b>{labelBold}</b></span>{labelNormal}
                  </Typography>
                  {item.argument && (
                    <Typography
                      id={`${item.label}-argument`}
                      level="body-sm"
                    >
                      {item.argument}
                    </Typography>
                  )}
                </Box>
                {!!item.description && (
                  <Typography
                    id={`${item.label}-description`}
                    level="body-xs"
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}

      {props.children}

    </CloseableMenu>
  );
}
