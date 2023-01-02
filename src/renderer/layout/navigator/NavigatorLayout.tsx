import NavigatorSidebar from 'renderer/layout/navigator/components/NavigatorSidebar';
import { NavigatorTreeProvider } from 'renderer/contexts/NavigatorTreeContext';
import MainSidebarLayout from 'renderer/layout/common/MainSidebarLayout';

type NavigatorLayoutProps = {};

export default function NavigatorLayout({}: NavigatorLayoutProps) {
  return (
    <NavigatorTreeProvider>
      <MainSidebarLayout Sidebar={NavigatorSidebar} />
    </NavigatorTreeProvider>
  );
}
