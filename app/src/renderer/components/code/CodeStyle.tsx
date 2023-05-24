import { alpha, useTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

export default function CodeStyle() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '.cm-panels': {
          backgroundColor: `${theme.palette.background.paper}!important`,
          color: `${theme.palette.text.primary}!important`,
        },
        '.cm-panels-bottom': {
          borderTop: `1px solid ${theme.palette.divider}!important`,
        },
        '.cm-search [name=close]': {
          top: '50%!important',
          right: `${theme.spacing(2)}!important`,
          transform: 'translate(0%, -50%)!important',
          marginTop: `-1px!important`,
          color: `${theme.palette.text.secondary}!important`,
          fontSize: `20px!important`,
          cursor: 'pointer',
        },
        '.cm-search': {
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: `${theme.spacing(1)} ${theme.spacing(3.5)} ${theme.spacing(1)} ${theme.spacing(2)} !important`,

          label: {
            display: 'flex',
            alignItems: 'center',
            color: `${theme.palette.text.secondary}!important`,
            textTransform: 'capitalize',
            fontSize: '12px!important',
          },

          'input[type=checkbox]': {
            accentColor: theme.palette.primary.main,
            width: '16px!important',
          },

          input: {
            height: '30px',
            marginTop: `0!important`,
            marginBottom: `0!important`,
            fontSize: '12px!important',
            color: `${theme.palette.text.primary}!important`,
            outline: 'none',
            border: `1px solid ${theme.palette.divider}!important`,
            borderRadius: `${theme.shape.borderRadius}px!important`,

            '&:hover': {
              border: `1px solid ${theme.palette.text.primary}!important`,
            },

            '&:focus': {
              border: `1px solid ${theme.palette.primary.main}!important`,
            },

            '&::placeholder': {
              color: `${theme.palette.text.secondary}!important`,
            },
          },

          '.cm-button': {
            height: '30px',
            marginTop: `0!important`,
            marginBottom: `0!important`,
            fontSize: '12px!important',
            color: `${theme.palette.primary.main}!important`,
            outline: 'none',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}!important`,
            borderRadius: `${theme.shape.borderRadius}px!important`,
            background: 'transparent!important',
            textTransform: 'capitalize',
            cursor: 'pointer',
            transition:
              'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

            '&:hover': {
              border: `1px solid ${theme.palette.primary.main}!important`,
              background: `${alpha(theme.palette.primary.main, 0.1)}!important`,
            },
          },
        },
      }}
    />
  );
}
