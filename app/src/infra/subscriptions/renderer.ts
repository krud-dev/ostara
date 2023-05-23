import { ipcRenderer } from 'electron';

export const subscriptionsBridge: SubscriptionsBridge = {
  subscribe: (channel, listener) => {
    ipcRenderer.on(channel, listener);
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },
};
