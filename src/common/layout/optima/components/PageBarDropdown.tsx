import * as React from 'react';
import type { SelectSlotsAndSlotProps } from '@mui/joy/Select/SelectProps';
import {
  Box,
  ListDivider,
  listItemButtonClasses,
  ListItemDecorator,
  Option,
  optionClasses,
  Select,
  selectClasses,
  Typography,
  useTheme,
} from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const useDenseDropdowns = false;
const useBigIcons = true;

const selectSlotProps: SelectSlotsAndSlotProps<false>['slotProps'] = {
  root: {
    sx: {
      backgroundColor: 'transparent',
      maxWidth: 'calc(100dvw - 4.5rem)',
    },
  },
  button: {
    className: 'agi-ellipsize',
    sx: {
      display: 'inline-block',
      maxWidth: 300,
    },
  },
  indicator: {
    sx: {
      color: 'rgba(255 255 255 / 0.5)',
      transition: '0.2s',
      '&.Mui-expanded': {
        transform: 'rotate(-180deg)',
      },
    },
  },
  listbox: {
    variant: 'outlined',
    sx: {
      '--ListItem-minHeight': useDenseDropdowns ? '2.25rem' : '2.75rem',
      '--Icon-fontSize': useBigIcons ? '1.5rem' : '1rem',
      paddingBlock: 0,
      maxHeight: `calc(100dvh - 56px - 24px)`,
      '& .MuiOption-root': {
        maxWidth: 'min(360px, calc(100dvw - 1rem))',
        minWidth: 160,
      },
      '& .MuiListItemButton-root': {
        minWidth: 160,
      },
    },
  },
};

export type DropdownItems = Record<string, {
  title: string,
  symbol?: string,
  type?: 'separator',
  icon?: React.ReactNode,
}>;

export const PageBarDropdownMemo = React.memo(PageBarDropdown);

function PageBarDropdown<TValue extends string>(props: {
  items: DropdownItems,
  value: TValue | null,
  onChange: (value: TValue | null) => void,
  activeEndDecorator?: React.ReactNode,
  appendOption?: React.ReactNode,
  placeholder?: string,
  showSymbols?: boolean,
}) {
  const { onChange } = props;
  const theme = useTheme();

  const handleOnChange = React.useCallback((_event: any, value: TValue | null) => {
    onChange(value);
  }, [onChange]);

  return (
    <Select
      variant='plain'
      value={props.value}
      onChange={handleOnChange}
      placeholder={props.placeholder}
      indicator={<KeyboardArrowDownIcon />}
      slotProps={selectSlotProps}
    >
      {Object.keys(props.items).map((_itemKey: string, idx: number) => {
        const _item = props.items[_itemKey];
        const isActive = _itemKey === props.value;
        return _item.type === 'separator' ? (
          <ListDivider key={'key-sep-' + idx}>
            {_item.icon && <ListItemDecorator>{_item.icon}</ListItemDecorator>}
            {_item.title}
          </ListDivider>
        ) : (
          <Option key={'key-' + idx} value={_itemKey}>
            {props.showSymbols && _item.icon && <ListItemDecorator>{_item.icon}</ListItemDecorator>}
            {props.showSymbols && _item.symbol && <ListItemDecorator sx={{ fontSize: 'xl' }}>{_item.symbol + ' '}</ListItemDecorator>}
            <Typography className='agi-ellipsize' noWrap>
              {_item.title}
            </Typography>
            {isActive && props.activeEndDecorator}
          </Option>
        );
      })}
      {!!props.appendOption && Object.keys(props.items).length >= 1 && <ListDivider sx={{ mt: 0 }} />}
      {props.appendOption}
      {!!props.appendOption && <Box sx={{ height: theme.vars.spacing(2) }} />}
    </Select>
  );
}
