import { Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SidebarSection, { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { ReactNode } from 'react';

type SidebarProps = { sidebarConfig: SidebarConfig; width?: number; header?: ReactNode };

export default function Sidebar({ sidebarConfig, width, header }: SidebarProps) {
  return (
    <Box sx={{ width: width || '100%', height: '100%', overflow: 'hidden' }}>
      <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
        {header}
        <SidebarSection sidebarConfig={sidebarConfig} />
      </PerfectScrollbar>
    </Box>
  );
}
