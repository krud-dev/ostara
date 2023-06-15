import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import {
  ManageHistoryOutlined,
  NotificationsNoneOutlined,
  SettingsApplicationsOutlined,
  SettingsBackupRestoreOutlined,
  ShieldOutlined,
} from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

type SettingsSidebarProps = { width: number };

export default function SettingsSidebar({ width }: SettingsSidebarProps) {
  const navConfig = useMemo<SidebarConfig>(
    () => [
      {
        id: 'settings',
        label: <FormattedMessage id={'settings'} />,
        items: [
          {
            id: 'general',
            icon: <SettingsApplicationsOutlined />,
            label: <FormattedMessage id={'general'} />,
            to: urls.settingsGeneral.url,
          },
          {
            id: 'notifications',
            icon: <NotificationsNoneOutlined />,
            label: <FormattedMessage id={'notifications'} />,
            to: urls.settingsNotifications.url,
          },
          {
            id: 'privacy',
            icon: <ShieldOutlined />,
            label: <FormattedMessage id={'privacy'} />,
            to: urls.settingsPrivacy.url,
          },
          {
            id: 'backups',
            icon: <ManageHistoryOutlined />,
            label: <FormattedMessage id={'localBackups'} />,
            to: urls.settingsBackups.url,
          },
        ],
      },
    ],
    []
  );

  return <Sidebar sidebarConfig={navConfig} width={width} />;
}
