import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { AssignmentOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import MainSidebarTitle from 'renderer/layout/common/MainSidebarTitle';

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
    <Sidebar sidebarConfig={navConfig} header={<MainSidebarTitle title={<FormattedMessage id={'settings'} />} />} />
  );
}
