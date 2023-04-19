import { DependencyList, EffectCallback, useEffect } from 'react';

export default function useDebouncedEffect(effect: EffectCallback, deps: DependencyList, millis: number) {
  const dependencies = [...deps, effect, millis];
  useEffect(() => {
    const timeout = setTimeout(effect, millis);
    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);
}
