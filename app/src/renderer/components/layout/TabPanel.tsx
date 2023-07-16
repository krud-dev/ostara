import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Badge, Box, Tab, Tabs } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { get } from 'lodash';

export interface TabInfo {
  id: string;
  label: ReactNode;
  badge?: ReactNode;
  icon?: React.ReactElement;
  lazy?: boolean;
  className?: string;
}

interface TabPanelProps extends PropsWithChildren<any> {
  tabs: TabInfo[];
  divider?: ReactNode;
  sx?: SxProps<Theme>;
  sxTabContainer?: SxProps<Theme>;
}

const TabPanel: FunctionComponent<TabPanelProps> = ({ tabs, divider, sx, sxTabContainer, children }: TabPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');
  const activeTabIndex = useMemo<number>(
    () =>
      Math.max(
        0,
        tabs.findIndex((tab) => tab.id === activeTab)
      ),
    [tabs, activeTab]
  );
  const [loadedTabs, setLoadedTabs] = useState<string[]>([]);

  useEffect(() => {
    if (!loadedTabs.includes(activeTab)) {
      setLoadedTabs((prevLoadedTabs) => [...prevLoadedTabs, activeTab]);
    }
  }, [activeTab]);

  const toggleTab = useCallback(
    (event: React.SyntheticEvent, tabIndex: number): void => {
      const tab = get(tabs, tabIndex);
      if (!tab) {
        return;
      }
      setActiveTab(tab.id);
    },
    [tabs, setActiveTab]
  );

  return (
    <Box sx={sx}>
      <Tabs value={activeTabIndex} onChange={toggleTab} scrollButtons={'auto'} variant={'scrollable'}>
        {tabs.map((tab) => (
          <Tab
            label={
              <Badge badgeContent={tab.badge} color="secondary" invisible={!tab.badge}>
                {tab.label}
              </Badge>
            }
            icon={tab.icon}
            disableRipple
            key={tab.id}
          />
        ))}
      </Tabs>

      {divider}

      {React.Children.toArray(children)
        .filter((child) => !!child)
        .map((child: any, index: number) => {
          const tab: TabInfo = get(tabs, index);
          const tabLoaded: boolean = !tab || !tab.lazy || activeTab === tab.id || loadedTabs.includes(tab.id);
          return (
            <Box
              sx={{
                display: activeTab === tab.id ? 'block' : 'none',
                ...sxTabContainer,
              }}
              key={tab.id}
            >
              {tabLoaded && child}
            </Box>
          );
        })}
    </Box>
  );
};
export default TabPanel;
