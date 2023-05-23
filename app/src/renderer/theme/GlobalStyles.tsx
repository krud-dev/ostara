import { alpha, useTheme } from '@mui/material/styles';
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        textarea: {
          '&::-webkit-input-placeholder': {
            color: theme.palette.text.disabled,
          },
          '&::-moz-placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          '&:-ms-input-placeholder': {
            color: theme.palette.text.disabled,
          },
          '&::placeholder': {
            color: theme.palette.text.disabled,
          },
        },

        img: { display: 'block', maxWidth: '100%' },

        // Allotment
        ':root': {
          '--focus-border': theme.palette.primary.main,
          '--separator-border': theme.palette.divider,
        },
        '.sash': {
          zIndex: 1210,
        },
        '.sash-vertical': {
          transform: 'translateX(3px)',
          '&:before': {
            transform: 'translateX(-3px)',
          },
        },

        // Perfect Scrollbar
        '.ps__rail-y, .ps__rail-x': {
          zIndex: 1,
        },
        '.ps__thumb-y, .ps__thumb-x': {
          backgroundColor: alpha(theme.palette.grey[600], 0.48),
        },
        '.ps .ps__rail-x:hover, .ps .ps__rail-y:hover, .ps .ps__rail-x:focus, .ps .ps__rail-y:focus, .ps .ps__rail-x.ps--clicking, .ps .ps__rail-y.ps--clicking':
          {
            backgroundColor: 'transparent',
          },
        '.ps__rail-x:hover > .ps__thumb-x, .ps__rail-x:focus > .ps__thumb-x, .ps__rail-x.ps--clicking .ps__thumb-x, .ps__rail-y:hover > .ps__thumb-y, .ps__rail-y:focus > .ps__thumb-y, .ps__rail-y.ps--clicking .ps__thumb-y':
          {
            backgroundColor: alpha(theme.palette.grey[600], 0.6),
          },

        // Native scrollbars
        '::-webkit-scrollbar': {
          width: 10,
          height: 8,
          backgroundColor: alpha(theme.palette.grey[600], 0.12),
        },

        '::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.grey[600], 0.24),
          borderRadius: 10,
        },

        '::-webkit-scrollbar-corner': {
          background: 'transparent',
        },
      }}
    />
  );
}
