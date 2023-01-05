import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { matchPath, NavLink as RouterLink, useLocation } from 'react-router-dom';
import { alpha, experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { Box, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import typography from 'renderer/theme/config/typography';
import { KeyboardArrowDown, KeyboardArrowRight, SvgIconComponent } from '@mui/icons-material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';

const ListItemStyle = styled(ListItem)(({ theme }) => ({
  ...typography.body2,
  height: NAVIGATOR_ITEM_HEIGHT,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(COMPONENTS_SPACING),
  paddingRight: theme.spacing(COMPONENTS_SPACING),
  '&:before': {
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  width: 22,
  height: 22,
  marginRight: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export interface SidebarItemProps {
  id: string;
  label: ReactNode;
  to: string;
  disabled?: boolean;
  hidden?: boolean;
  icon?: JSX.Element;
  info?: JSX.Element;
  subs?: SidebarItemProps[];
}

export default function SidebarItem({ item }: { item: SidebarItemProps }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { label, to, disabled, hidden, icon, info, subs } = item;

  const isActiveRoot = useMemo<boolean>(() => matchPath({ path: to, end: false }, pathname) !== null, [pathname, to]);
  // const isActiveRoot = useMemo<boolean>(() => true, [pathname, to]);
  const [open, setOpen] = useState<boolean>(isActiveRoot);

  const toggleHandler = useCallback((): void => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const ToggleIcon = useMemo<SvgIconComponent>(() => (open ? KeyboardArrowDown : KeyboardArrowRight), [open]);

  const activeRootStyle = {
    // color: 'primary.main',
    // fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' },
  };

  const activeSubStyle = {
    color: 'text.primary',
    // fontWeight: 'fontWeightMedium',
  };

  if (hidden) {
    return null;
  }

  if (subs) {
    return (
      <>
        <ListItemStyle
          // @ts-ignore
          button
          disableGutters
          disabled={disabled}
          onClick={toggleHandler}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>

          <ListItemText
            disableTypography
            primary={label}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
          {info && info}
          <IconButton
            sx={{
              p: 0.25,
              ml: 1,
              color: 'text.primary',
            }}
          >
            <ToggleIcon fontSize="small" />
          </IconButton>
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subs.map((sub) => {
              const isActiveSub = matchPath({ path: sub.to, end: false }, pathname) !== null;

              if (sub.hidden) {
                return null;
              }

              return (
                <ListItemStyle
                  // @ts-ignore
                  button
                  disableGutters
                  disabled={sub.disabled}
                  component={RouterLink}
                  to={sub.to}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                  }}
                  key={sub.id}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (t) => t.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main',
                        }),
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={sub.label} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      // @ts-ignore
      button
      disableGutters
      disabled={disabled}
      component={RouterLink}
      to={to}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={label} />
      {info && info}
    </ListItemStyle>
  );
}
