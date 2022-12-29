import { Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SidebarSection, { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { ReactNode } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type SidebarProps = { sidebarConfig: SidebarConfig; width?: number; header?: ReactNode; sx?: SxProps<Theme> };

export default function Sidebar({ sidebarConfig, width, header, sx }: SidebarProps) {
  return (
    <Box sx={{ width: width || '100%', height: '100%', overflow: 'hidden', ...sx }}>
      <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
        {header}
        <SidebarSection sidebarConfig={sidebarConfig} />
      </PerfectScrollbar>
    </Box>
  );
}
