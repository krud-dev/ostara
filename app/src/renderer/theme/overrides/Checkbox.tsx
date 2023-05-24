import { Theme } from '@mui/material/styles';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { Components } from '@mui/material/styles/components';

function Icon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M17 3a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4h10zm0 2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
    </SvgIcon>
  );
}

function CheckedIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M17 3a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4h10zm-1.372 4.972a1.006 1.006 0 00-.928.388l-3.78 5-1.63-2.08a1.001 1.001 0 00-1.58 1.23l2.44 3.11a1 1 0 001.58-.01l4.57-6v-.03a1.006 1.006 0 00-.672-1.608z" />
    </SvgIcon>
  );
}

function IndeterminateIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M17 3a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4h10zm-1.75 8h-6.5a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h6.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75z" />
    </SvgIcon>
  );
}

export default function Checkbox(theme: Theme): Components {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <Icon />,
        checkedIcon: <CheckedIcon />,
        indeterminateIcon: <IndeterminateIcon />,
      },

      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
          '& .MuiSvgIcon-fontSizeMedium': {
            width: 24,
            height: 24,
          },
          '& .MuiSvgIcon-fontSizeSmall': {
            width: 20,
            height: 20,
          },
          svg: {
            fontSize: 24,
            '&[font-size=small]': {
              fontSize: 20,
            },
          },
        },
      },
    },
  };
}
