import { Box, IconButton, styled, type CSSObject } from '@mui/joy';

const mobileNavItemClasses = {
  typeApp: 'NavButton-typeApp',
  active: 'NavButton-active',
};

const mobileNavGroupBoxClasses: CSSObject = {
  root: {
    // layout
    flex: 1,
    minHeight: 'var(--Bar)',

    // contents
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    // style
    // backgroundColor: 'rgba(0 0 0 / 0.5)', // darken bg

    // debug
    // '& > *': { border: '1px solid red' },
  },
};

const mobileNavIconClasses: CSSObject = {
  root: {
    // custom vars
    '--MarginY': '0.5rem',
    '--ExtraPadX': '1rem',

    // IconButton customization
    '--Icon-fontSize': '1.25rem',
    '--IconButton-size': 'calc(var(--Bar) - 2 * var(--MarginY))',
    paddingInline: 'var(--ExtraPadX)',
    border: 'none',

    '&:hover': {
      backgroundColor: 'var(--variant-solidHoverBg)',
      color: 'var(--neutral-softColor)',
    },
  };
};

export const MobileNavGroupBox = styled(Box)(mobileNavGroupBoxClasses);

export const MobileNavIcon = styled(IconButton)(
  mobileNavIconClasses,
  ({ theme }) => ({
    '&.${mobileNavItemClasses.typeApp}': {
      '--IconButton-color': theme.palette.neutral.softColor,
      '&:hover': {
        backgroundColor: theme.palette.neutral.softHoverBg,
      },
    },
  })
) as typeof IconButton;
