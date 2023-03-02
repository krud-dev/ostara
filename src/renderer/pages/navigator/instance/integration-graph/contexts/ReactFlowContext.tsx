import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

export type ReactFlowContextProps = {
  search: string;
  setSearch: (search: string) => void;
  isHighlight: (searchString: string, data: any) => boolean;
};

const ReactFlowContext = React.createContext<ReactFlowContextProps>(undefined!);

interface ReactFlowProviderProps extends PropsWithChildren<any> {}

const ReactFlowProvider: FunctionComponent<ReactFlowProviderProps> = ({ children }) => {
  const [search, setSearch] = useState<string>('');

  const isHighlight = useCallback(
    (searchString: string, data: any) =>
      !!searchString && data.label.toLowerCase().indexOf(searchString.toLowerCase()) !== -1,
    []
  );

  return (
    <ReactFlowContext.Provider
      value={{
        search,
        setSearch,
        isHighlight,
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
