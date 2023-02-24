import React, { FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

export type ReactFlowContextProps = {
  search: string;
  setSearch: (darkMode: string) => void;
};

const ReactFlowContext = React.createContext<ReactFlowContextProps>(undefined!);

interface ReactFlowProviderProps extends PropsWithChildren<any> {}

const ReactFlowProvider: FunctionComponent<ReactFlowProviderProps> = ({ children }) => {
  const [search, setSearch] = useState<string>('');

  return (
    <ReactFlowContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </ReactFlowContext.Provider>
  );
};

const useReactFlow = (): ReactFlowContextProps => {
  const context = useContext(ReactFlowContext);

  if (!context) throw new Error('ReactFlowContext must be used inside ReactFlowProvider');

  return context;
};

export { ReactFlowContext, ReactFlowProvider, useReactFlow };
