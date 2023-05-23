import { DependencyList, EffectCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';

const useDelayedEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setFlag((prev) => !prev);
  }, deps);

  useUpdateEffect(effect, [flag]);
};
export default useDelayedEffect;
