import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import InstanceSidebar from 'renderer/layout/instance/components/InstanceSidebar';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import InstanceUnreachable from 'renderer/layout/instance/components/health/InstanceUnreachable';
import InstanceInvalid from 'renderer/layout/instance/components/health/InstanceInvalid';
import InstancePending from 'renderer/layout/instance/components/health/InstancePending';
import { InstanceRO } from 'common/generated_definitions';
import LoadingPage from 'renderer/components/layout/LoadingPage';
import DemoInstanceUnreachable from 'renderer/layout/instance/components/health/DemoInstanceUnreachable';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

const InstanceLayout: FunctionComponent = () => {
  const { selectedItem, selectedItemAbilities } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO | undefined>(() => selectedItem as InstanceRO | undefined, [selectedItem]);

  const content = useMemo<ReactNode | undefined>(() => {
    if (!item) {
      return <LoadingPage />;
    }
    if (item.health.status === 'UNREACHABLE') {
      if (item.demo) {
        return <DemoInstanceUnreachable item={item} />;
      }
      return <InstanceUnreachable item={item} />;
    }
    if (item.health.status === 'INVALID') {
      return <InstanceInvalid item={item} />;
    }
    if (item.health.status === 'PENDING') {
      return <InstancePending item={item} />;
    }
    if (!selectedItemAbilities) {
      return <LoadingPage />;
    }
    return undefined;
  }, [item, selectedItemAbilities]);

  const sidebarDisabled = useMemo<boolean>(() => !!content, [content]);

  if (!item) {
    return null;
  }

  return (
    <SecondarySidebarLayout
      Sidebar={InstanceSidebar}
      sidebarProps={{ item, itemAbilities: selectedItemAbilities, disabled: sidebarDisabled }}
      content={content}
    />
  );
};

export default InstanceLayout;
