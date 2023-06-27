import React, { FunctionComponent, PropsWithChildren, useContext, useMemo } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';

export type NavigatorTreeContextProps = {
  data: readonly TreeItem[] | undefined;
};

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(undefined!);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {
  data: readonly TreeItem[] | undefined;
}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({ data, children }) => {
  const memoizedValue = useMemo<NavigatorTreeContextProps>(() => ({ data }), [data]);

  return <NavigatorTreeContext.Provider value={memoizedValue}>{children}</NavigatorTreeContext.Provider>;
};

const useNavigatorTreeContext = (): NavigatorTreeContextProps => {
  const context = useContext(NavigatorTreeContext);

  if (!context) throw new Error('NavigatorTreeContext must be used inside NavigatorTreeProvider');

  return context;
};

export { NavigatorTreeContext, NavigatorTreeProvider, useNavigatorTreeContext };
