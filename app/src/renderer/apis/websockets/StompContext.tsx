import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { StompTopicKey, StompTopics } from './stompTopics';
import { forEach } from 'lodash';
import { generatePath } from 'react-router-dom';
import { PathParam } from '../../utils/urlUtils';

export type StompContextProps = {
  subscribe: <SubscribeTopic extends StompTopicKey>(
    topic: SubscribeTopic,
    params: { [key in PathParam<SubscribeTopic>]: string },
    callback: (message: StompTopics[SubscribeTopic]) => void
  ) => () => Promise<void>;
};

const StompContext = React.createContext<StompContextProps>(undefined!);

interface StompProviderProps extends PropsWithChildren<any> {}

const StompProvider: FunctionComponent<StompProviderProps> = ({ children }) => {
  const subscriptions = useRef<{ [key: string]: ((message: StompTopics[StompTopicKey]) => void)[] }>({});

  const getTopicCallback = useCallback((topic: string): ((message: IMessage) => void) => {
    return (message: IMessage): void => {
      const callbacksForTopic = subscriptions.current[topic];
      if (callbacksForTopic) {
        for (const callback of callbacksForTopic) {
          callback(JSON.parse(message.body));
        }
      }
    };
  }, []);

  const stompClient = useRef<Client>(
    new Client({
      brokerURL: window.daemonWsAddress,
      onConnect: () => {
        forEach(subscriptions.current, (callbacks, topic) => {
          stompSubscribe(topic);
        });
      },
    })
  );

  const stompSubscribe = useCallback((topic: string): void => {
    if (stompClient.current.connected) {
      stompClient.current.subscribe(topic, getTopicCallback(topic));
    }
  }, []);

  const stompUnsubscribe = useCallback((topic: string): void => {
    if (stompClient.current.connected) {
      stompClient.current.unsubscribe(topic);
    }
  }, []);

  useEffect(() => {
    stompClient.current.activate();
    return () => {
      stompClient.current.deactivate();
    };
  }, []);

  const subscribe = useCallback(
    <SubscribeTopic extends StompTopicKey>(
      topic: SubscribeTopic,
      params: { [key in PathParam<SubscribeTopic>]: string },
      callback: (message: StompTopics[SubscribeTopic]) => void
    ): (() => Promise<void>) => {
      const generatedTopic = generatePath(topic, params as any);

      const topicCallbacks = subscriptions.current[generatedTopic] || [];
      if (topicCallbacks.length === 0) {
        stompSubscribe(generatedTopic);
      }
      subscriptions.current[generatedTopic] = [...topicCallbacks, callback as any];

      return async (): Promise<void> => {
        subscriptions.current[generatedTopic] = subscriptions.current[generatedTopic].filter((cb) => cb !== callback);
        if (subscriptions.current[generatedTopic].length === 0) {
          delete subscriptions.current[generatedTopic];
          stompUnsubscribe(generatedTopic);
        }
      };
    },
    []
  );

  const memoizedValue = useMemo<StompContextProps>(() => ({ subscribe }), [subscribe]);

  return <StompContext.Provider value={memoizedValue}>{children}</StompContext.Provider>;
};

const useStomp = (): StompContextProps => {
  const context = useContext(StompContext);

  if (!context) throw new Error('StompContext must be used inside StompProvider');

  return context;
};

export { StompContext, StompProvider, useStomp };
