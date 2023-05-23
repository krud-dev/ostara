import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { ThreadLog } from '../components/ThreadProfilingRequestDetailsDialog';
import useDebounceFn from '../../../../../hooks/useDebounceFn';

export type ThreadLogContextProps = {
  getId: (threadLog: ThreadLog) => string;
  search: string;
  setSearch: (searchString: string) => void;
  openIds: string[];
  toggleOpenHandler: (threadLog?: ThreadLog) => void;
  closeAllHandler: () => void;
  isOpen: (threadLog?: ThreadLog) => boolean;
  isHighlight: (searchString: string, threadLog: ThreadLog) => boolean;
};

const ThreadLogContext = React.createContext<ThreadLogContextProps>(undefined!);

interface ThreadLogProviderProps extends PropsWithChildren<any> {}

const ThreadLogProvider: FunctionComponent<ThreadLogProviderProps> = ({ children }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [search, setSearchInternal] = useState<string>('');
  const setSearch = useDebounceFn(setSearchInternal, 250);

  const getId = useCallback((threadLog: ThreadLog): string => {
    return `${threadLog.threadId}_${threadLog.index}`;
  }, []);

  const toggleOpenHandler = useCallback(
    (threadLog?: ThreadLog): void => {
      if (!threadLog) {
        return;
      }
      const threadLogId = getId(threadLog);
      setOpenIds((prev) =>
        prev.includes(threadLogId) ? prev.filter((id) => id !== threadLogId) : [...prev, threadLogId]
      );
    },
    [setOpenIds, getId]
  );

  const closeAllHandler = useCallback((): void => {
    setOpenIds([]);
  }, [setOpenIds]);

  const isOpen = useCallback(
    (threadLog?: ThreadLog): boolean => !!threadLog && openIds.includes(getId(threadLog)),
    [openIds, getId]
  );

  const isHighlight = useCallback((searchString: string, threadLog: ThreadLog): boolean => {
    if (!searchString) {
      return false;
    }
    const searchStringLowerCase = searchString.toLowerCase();
    return threadLog.stackTrace.some(
      (stackTrace) => stackTrace.className?.toLowerCase().indexOf(searchStringLowerCase) !== -1
    );
  }, []);

  return (
    <ThreadLogContext.Provider
      value={{
        getId,
        search,
        setSearch,
        openIds,
        toggleOpenHandler,
        closeAllHandler,
        isOpen,
        isHighlight,
      }}
    >
      {children}
    </ThreadLogContext.Provider>
  );
};

const useThreadLog = (): ThreadLogContextProps => {
  const context = useContext(ThreadLogContext);

  if (!context) throw new Error('ThreadLogContext must be used inside ThreadLogProvider');

  return context;
};

export { ThreadLogContext, ThreadLogProvider, useThreadLog };
