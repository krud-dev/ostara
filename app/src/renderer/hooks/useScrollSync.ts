import { RefObject, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

export type Options = {
  horizontal?: boolean;
  vertical?: boolean;
  proportional?: boolean;
  throttleWaitTime?: number; // ms
};

const defaultOptions: Options = {
  horizontal: true,
  vertical: true,
  proportional: true,
  throttleWaitTime: 100,
};

type ScrollSync = <T extends HTMLElement>(refs: RefObject<T>[], options?: Options) => void;

const updateScrollsPosition = <T extends HTMLElement>(target: HTMLElement, refs: RefObject<T>[], options: Options) => {
  const scrollLeftOffset = target.scrollLeft / (target.scrollWidth - target.clientWidth);

  const scrollTopOffset = target.scrollTop / (target.scrollHeight - target.clientHeight);

  refs.forEach(({ current }) => {
    if (!current) return;

    if (options.vertical) {
      const position = options.proportional
        ? scrollTopOffset * (current.scrollHeight - current.clientHeight)
        : target.scrollTop;

      current.scrollTop = Math.round(position);
    }

    if (options.horizontal) {
      const position = options.proportional
        ? scrollLeftOffset * (current.scrollWidth - current.clientWidth)
        : target.scrollLeft;

      current.scrollLeft = Math.round(position);
    }
  });
};

const useScrollSyncOptions = (options = {}) =>
  useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    [JSON.stringify(options)]
  );

export const useScrollSync: ScrollSync = (refs, options) => {
  if (refs.length < 2) {
    throw Error('You need to pass at least two refs');
  }

  const scrollSyncOptions = useScrollSyncOptions(options);
  const throttleScrollRef = useRef() as React.MutableRefObject<Function>;

  useEffect(() => {
    const handleScroll = (currentRefs: Array<React.MutableRefObject<HTMLElement>>, { target }: Event) => {
      if (!target) throw Error("Event target shouldn't be null");

      const refsWithoutTarget = currentRefs.filter(({ current }) => current !== target);

      window.requestAnimationFrame(() => {
        updateScrollsPosition(target as HTMLElement, refsWithoutTarget, scrollSyncOptions);
      });
    };

    const scrollEvent = _.throttle(handleScroll, scrollSyncOptions.throttleWaitTime);

    throttleScrollRef.current = scrollEvent;

    return scrollEvent.cancel;
  }, [scrollSyncOptions, throttleScrollRef]);

  useEffect(() => {
    const scrollEvent = (e: Event) => throttleScrollRef.current(refs, e);

    refs.forEach(({ current }) => current?.addEventListener('scroll', scrollEvent));

    return () => {
      refs.forEach(({ current }) => current?.removeEventListener('scroll', scrollEvent));
    };
  }, [refs, throttleScrollRef]);
};
