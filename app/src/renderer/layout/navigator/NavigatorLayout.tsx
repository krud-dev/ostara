import NavigatorSidebar from 'renderer/layout/navigator/components/NavigatorSidebar';
import MainSidebarLayout from 'renderer/layout/common/main-sidebar/MainSidebarLayout';
import { NavigatorLayoutProvider } from 'renderer/contexts/NavigatorLayoutContext';

type NavigatorLayoutProps = {};

export default function NavigatorLayout({}: NavigatorLayoutProps) {
  return (
    <NavigatorLayoutProvider>
      <MainSidebarLayout Sidebar={NavigatorSidebar} />
    </NavigatorLayoutProvider>
  );
}
