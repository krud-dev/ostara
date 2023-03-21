import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { ClassOutlined, ListAltOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { ApplicationRO } from '../../../../common/generated_definitions';

type ApplicationSidebarProps = { item: ApplicationRO; width: number };

export default function ApplicationSidebar({ item, width }: ApplicationSidebarProps) {
  const isServiceInactive = useCallback((): boolean => {
    return item.health.status === 'EMPTY' || item.health.status === 'ALL_DOWN';
  }, [item]);

  const navConfig = useMemo<SidebarConfig | undefined>(
    () => [
      {
        id: 'overview',
        label: <FormattedMessage id={'overview'} />,
        items: [
          // {
          //   id: 'dashboard',
          //   icon: <BarChartOutlined />,
          //   label: <FormattedMessage id={'dashboard'} />,
          //   to: generatePath(urls.applicationDashboard.url, { id: item.id }),
          // },
          {
            id: 'instances',
            icon: <IconViewer icon={getItemTypeIcon('instance')} />,
            label: <FormattedMessage id={'instances'} />,
            to: generatePath(urls.applicationInstances.url, { id: item.id }),
          },
        ],
      },
      {
        id: 'manage',
        label: <FormattedMessage id={'manage'} />,
        items: [
          {
            id: 'loggers',
            icon: <ListAltOutlined />,
            label: <FormattedMessage id={'loggers'} />,
            to: generatePath(urls.applicationLoggers.url, { id: item.id }),
            disabled: isServiceInactive(),
          },
          {
            id: 'caches',
            icon: <ClassOutlined />,
            label: <FormattedMessage id={'caches'} />,
            to: generatePath(urls.applicationCaches.url, { id: item.id }),
            disabled: isServiceInactive(),
          },
        ],
      },
    ],
    [item]
  );

  return <Sidebar sidebarConfig={navConfig} header={<ItemHeader item={item} />} />;
}
