import React, { FunctionComponent, PropsWithChildren, useContext, useMemo } from 'react';
import { PopupState } from 'material-ui-popup-state/hooks';

export type ContextMenuContextProps = {
  menuState: PopupState;
};

const ContextMenuContext = React.createContext<ContextMenuContextProps>(undefined!);

interface ContextMenuProviderProps extends PropsWithChildren<any> {
  menuState: PopupState;
}

const ContextMenuProvider: FunctionComponent<ContextMenuProviderProps> = ({ menuState, children }) => {
  const memoizedValue = useMemo<ContextMenuContextProps>(() => ({ menuState }), [menuState]);

  return <ContextMenuContext.Provider value={memoizedValue}>{children}</ContextMenuContext.Provider>;
};

const useContextMenuContext = (): ContextMenuContextProps => {
  const context = useContext(ContextMenuContext);

  if (!context) throw new Error('ContextMenuContext must be used inside ContextMenuProvider');

  return context;
};

export { ContextMenuContext, ContextMenuProvider, useContextMenuContext };
