import NavigatorSidebar from 'renderer/layout/navigator/components/NavigatorSidebar';
import MainSidebarLayout from 'renderer/layout/common/main-sidebar/MainSidebarLayout';
import { NavigatorTreeProvider } from '../../contexts/NavigatorTreeContext';

type NavigatorLayoutProps = {};

export default function NavigatorLayout({}: NavigatorLayoutProps) {
  return (
    <NavigatorTreeProvider>
      <MainSidebarLayout Sidebar={NavigatorSidebar} />
    </NavigatorTreeProvider>
  );
}
