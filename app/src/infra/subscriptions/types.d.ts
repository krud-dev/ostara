import { Subscriptions } from './subscriptions';

declare global {
  type SubscriptionsBridge = {
    subscribe<EventKey extends keyof Subscriptions>(event: EventKey, listener: Subscriptions[EventKey]): () => void;
  };

  interface Window {
    subscriptions: SubscriptionsBridge;
  }
}

export {};
