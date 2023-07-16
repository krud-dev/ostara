import React, { FunctionComponent, PropsWithChildren, useContext, useMemo } from 'react';

export type StepperContextProps = {
  selectStep: (stepId: string) => void;
  selectStepByIndex: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
};

const StepperContext = React.createContext<StepperContextProps>(undefined!);

interface StepperProviderProps extends PropsWithChildren<any> {
  selectStep: (stepId: string) => void;
  selectStepByIndex: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const StepperProvider: FunctionComponent<StepperProviderProps> = ({
  selectStep,
  selectStepByIndex,
  nextStep,
  previousStep,
  children,
}) => {
  const memoizedValue = useMemo<StepperContextProps>(
    () => ({ selectStep, selectStepByIndex, nextStep, previousStep }),
    [selectStep, selectStepByIndex, nextStep, previousStep]
  );
  return <StepperContext.Provider value={memoizedValue}>{children}</StepperContext.Provider>;
};

const useStepperContext = (): StepperContextProps => {
  const context = useContext(StepperContext);

  if (!context) throw new Error('StepperContext must be used inside StepperProvider');

  return context;
};

export { StepperContext, StepperProvider, useStepperContext };
