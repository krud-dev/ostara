import MainSidebarLayout from 'renderer/layout/common/main-sidebar/MainSidebarLayout';
import SettingsSidebar from 'renderer/layout/settings/components/SettingsSidebar';

type SettingsLayoutProps = {};

export default function SettingsLayout({}: SettingsLayoutProps) {
  return <MainSidebarLayout Sidebar={SettingsSidebar} />;
}
