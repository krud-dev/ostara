import React, { FunctionComponent } from 'react';
import SettingsSidebar from 'renderer/layout/settings/components/SettingsSidebar';
import MainSidebarLayout from 'renderer/layout/common/main-sidebar/MainSidebarLayout';

const SettingsLayout: FunctionComponent = () => {
  return <MainSidebarLayout Sidebar={SettingsSidebar} />;
};

export default SettingsLayout;
