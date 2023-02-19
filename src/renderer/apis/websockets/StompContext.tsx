import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Client } from '@stomp/stompjs';
import { StompTopicKey, stompTopicsToSubscribe, StompTopics } from './stompTopics';

export type StompContextProps = {
  subscribe: <SubscribeTopic extends StompTopicKey>(
    topic: SubscribeTopic,
    callback: (message: StompTopics[SubscribeTopic]) => void
  ) => () => void;
};

const StompContext = React.createContext<StompContextProps>(undefined!);

interface StompProviderProps extends PropsWithChildren<any> {}

const StompProvider: FunctionComponent<StompProviderProps> = ({ children }) => {
  const callbacks = useRef<{ [key: string]: ((message: StompTopics[StompTopicKey]) => void)[] }>({});

  const stompClient = useMemo<Client>(
    () =>
      new Client({
        brokerURL: window.daemonWsAddress,
        onConnect: () => {
          for (const stompTopic of stompTopicsToSubscribe) {
            stompClient.subscribe(stompTopic, (message) => {
              const callbacksForTopic = callbacks.current[stompTopic];
              if (callbacksForTopic) {
                for (const callback of callbacksForTopic) {
                  callback(JSON.parse(message.body));
                }
              }
            });
          }
        },
      }),
    []
  );

  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  const subscribe = useCallback(
    <SubscribeTopic extends StompTopicKey>(
      topic: SubscribeTopic,
      callback: (message: StompTopics[SubscribeTopic]) => void
    ): (() => void) => {
      const topicCallbacks = callbacks.current[topic] || [];
      callbacks.current[topic] = [...topicCallbacks, callback as any];
      return () => {
        callbacks.current[topic] = callbacks.current[topic].filter((cb) => cb !== callback);
      };
    },
    []
  );

  return (
    <StompContext.Provider
      value={{
        subscribe,
      }}
    >
      {children}
    </StompContext.Provider>
  );
};

const useStomp = (): StompContextProps => {
  const context = useContext(StompContext);

  if (!context) throw new Error('StompContext must be used inside StompProvider');

  return context;
};

export { StompContext, StompProvider, useStomp };
