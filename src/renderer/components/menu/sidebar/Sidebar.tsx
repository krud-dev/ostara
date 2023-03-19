import { Box } from '@mui/material';
import SidebarSection, { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import React, { ReactNode } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import AutoSizer from 'react-virtualized-auto-sizer';
import LogoLoader from '../../common/LogoLoader';

type SidebarProps = { sidebarConfig?: SidebarConfig; width?: number; header?: ReactNode; sx?: SxProps<Theme> };

export default function Sidebar({ sidebarConfig, width, header, sx }: SidebarProps) {
  return (
    <Box
      sx={{
        width: width || '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {!!header && <Box>{header}</Box>}
      <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <Box sx={{ height: height, overflow: 'auto' }}>
              {!sidebarConfig ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogoLoader />
                </Box>
              ) : (
                <SidebarSection sidebarConfig={sidebarConfig} />
              )}
            </Box>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
}
