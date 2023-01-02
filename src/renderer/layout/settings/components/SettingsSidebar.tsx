import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { AssignmentOutlined, FilterListOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import CreateItemMenu from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenu';
import SearchTextField from 'renderer/components/input/SearchTextField';
import SearchItemMenu from 'renderer/layout/navigator/components/sidebar/menus/SearchItemMenu';
import { IconViewer } from 'renderer/components/icon/IconViewer';

type SettingsSidebarProps = { width: number };

export default function SettingsSidebar({ width }: SettingsSidebarProps) {
  const navConfig = useMemo<SidebarConfig>(
    () => [
      {
        id: 'general',
        label: <FormattedMessage id={'general'} />,
        items: [
          {
            id: 'tasks',
            icon: <AssignmentOutlined />,
            label: <FormattedMessage id={'tasks'} />,
            to: urls.tasks.url,
          },
        ],
      },
    ],
    []
  );

  return (
    <Sidebar
      sidebarConfig={navConfig}
      header={
        <Box sx={{ height: NAVBAR_HEIGHT, minHeight: NAVBAR_HEIGHT, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: COMPONENTS_SPACING }}>
            <IconViewer icon={'SettingsOutlined'} fontSize={'medium'} sx={{ color: 'text.secondary', mr: 1.5 }} />
            <Typography variant={'h6'}>
              <FormattedMessage id={'settings'} />
            </Typography>
          </Box>

          <Divider />
        </Box>
      }
    />
  );
}
