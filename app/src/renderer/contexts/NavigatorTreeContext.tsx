import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';

export type NavigatorTreeContextProps = {
  data: readonly TreeItem[] | undefined;
};

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(undefined!);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {
  data: readonly TreeItem[] | undefined;
}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({ data, children }) => {
  return (
    <NavigatorTreeContext.Provider
      value={{
        data,
      }}
    >
      {children}
    </NavigatorTreeContext.Provider>
  );
};

const useNavigatorTree = (): NavigatorTreeContextProps => {
  const context = useContext(NavigatorTreeContext);

  if (!context) throw new Error('NavigatorTreeContext must be used inside NavigatorTreeProvider');

  return context;
};

export { NavigatorTreeContext, NavigatorTreeProvider, useNavigatorTree };
