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
import { ApplicationRO, InstanceAbility } from '../../../../common/generated_definitions';

type ApplicationSidebarProps = { item: ApplicationRO; itemAbilities?: InstanceAbility[]; width: number };

export default function ApplicationSidebar({ item, itemAbilities, width }: ApplicationSidebarProps) {
  const isServiceInactive = useCallback(
    (ability: InstanceAbility): boolean => {
      return item.health.status === 'EMPTY' || !itemAbilities || itemAbilities.indexOf(ability) === -1;
    },
    [item, itemAbilities]
  );

  const navConfig = useMemo<SidebarConfig | undefined>(
    () =>
      itemAbilities
        ? [
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
                  disabled: isServiceInactive('LOGGERS'),
                },
                {
                  id: 'caches',
                  icon: <ClassOutlined />,
                  label: <FormattedMessage id={'caches'} />,
                  to: generatePath(urls.applicationCaches.url, { id: item.id }),
                  disabled: isServiceInactive('CACHES'),
                },
              ],
            },
          ]
        : undefined,
    [item, itemAbilities, isServiceInactive]
  );

  return <Sidebar sidebarConfig={navConfig} header={<ItemHeader item={item} />} />;
}
