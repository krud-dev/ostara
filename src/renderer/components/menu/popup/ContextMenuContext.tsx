import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { PopupState } from 'material-ui-popup-state/hooks';

export type ContextMenuContextProps = {
  menuState: PopupState;
};

const ContextMenuContext = React.createContext<ContextMenuContextProps>(undefined!);

interface ContextMenuProviderProps extends PropsWithChildren<any> {
  menuState: PopupState;
}

const ContextMenuProvider: FunctionComponent<ContextMenuProviderProps> = ({ menuState, children }) => {
  return (
    <ContextMenuContext.Provider
      value={{
        menuState,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

const useContextMenu = (): ContextMenuContextProps => {
  const context = useContext(ContextMenuContext);

  if (!context) throw new Error('ContextMenuContext must be used inside ContextMenuProvider');

  return context;
};

export { ContextMenuContext, ContextMenuProvider, useContextMenu };
