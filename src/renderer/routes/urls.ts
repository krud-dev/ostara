export type UrlInfo = {
  url: string;
  path: string;
};

function asUrlInfos<T extends { [key: string]: UrlInfo }>(arg: T): T {
  return arg;
}

// Also update urls in firebase-messaging-sw.js
export const urls = asUrlInfos({
  // Error Root
  error: {
    url: '/error',
    path: 'error',
  },
  // Navigator Root
  navigator: {
    url: '/navigator',
    path: 'navigator',
  },
  emptyInstance: {
    url: '/navigator/empty-instance',
    path: 'empty-instance',
  },
});
