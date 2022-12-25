import { SvgIconComponent } from '@mui/icons-material';
import { useMemo } from 'react';
import { Item } from 'infra/configuration/model/configuration';
import { Avatar, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';

type InstanceSidebarProps = { item: Item };

export default function ItemHeader({ item }: InstanceSidebarProps) {
  const theme = useTheme();

  const TypeIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon(item.type), [item]);
  const color = useMemo<string>(() => item.color || theme.palette.text.secondary, [item, theme.palette]);

  return (
    <Box sx={{ height: NAVIGATOR_ITEM_HEIGHT * 2, px: 2.5, display: 'flex', alignItems: 'center' }}>
      <Avatar variant={'circular'} sx={{ backgroundColor: color, color: 'white' }}>
        <TypeIcon fontSize={'medium'} />
      </Avatar>
      <Box sx={{ ml: 2, overflow: 'hidden' }}>
        <Typography
          variant="subtitle2"
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          noWrap
        >
          {item.alias}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'success.main', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          noWrap
        >
          {'Healthy'}
        </Typography>
      </Box>
    </Box>
  );
}
