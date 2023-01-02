import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, BoxProps, List, ListSubheader } from '@mui/material';
import SidebarItem, { SidebarItemProps } from 'renderer/components/menu/sidebar/SidebarItem';
import { ListSubheaderProps } from '@mui/material/ListSubheader/ListSubheader';
import typography from 'renderer/theme/config/typography';
import { ReactNode } from 'react';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';

const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))<ListSubheaderProps>(({ theme }) => ({
  ...typography.overline,
  height: NAVIGATOR_ITEM_HEIGHT,
  lineHeight: `${NAVIGATOR_ITEM_HEIGHT}px`,
  paddingLeft: theme.spacing(COMPONENTS_SPACING),
  color: theme.palette.text.primary,
}));

export type SidebarConfig = {
  id: string;
  label: ReactNode;
  items: SidebarItemProps[];
}[];

interface SidebarSectionProps extends BoxProps {
  sidebarConfig: SidebarConfig;
}

export default function SidebarSection({ sidebarConfig, ...other }: SidebarSectionProps) {
  return (
    <Box {...other}>
      {sidebarConfig.map((list) => {
        const { id, label, items } = list;

        return (
          <List key={id} disablePadding>
            <ListSubheaderStyle>{label}</ListSubheaderStyle>
            {items.map((item: SidebarItemProps) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
