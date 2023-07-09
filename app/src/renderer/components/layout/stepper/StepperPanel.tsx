import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { get } from 'lodash';
import { StepperProvider } from 'renderer/components/layout/stepper/StepperContext';

export interface StepInfo {
  id: string;
  label: ReactNode;
  lazy?: boolean;
  className?: string;
}

interface StepperPanelProps extends PropsWithChildren<any> {
  steps: StepInfo[];
  divider?: ReactNode;
  sx?: SxProps<Theme>;
  sxTabContainer?: SxProps<Theme>;
}

const StepperPanel: FunctionComponent<StepperPanelProps> = ({
  steps,
  divider,
  sx,
  sxTabContainer,
  children,
}: StepperPanelProps) => {
  const [activeStep, setActiveStep] = useState<string>(steps[0]?.id || '');
  const activeStepIndex = useMemo<number>(
    () =>
      Math.max(
        0,
        steps.findIndex((s) => s.id === activeStep)
      ),
    [steps, activeStep]
  );
  const [loadedSteps, setLoadedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!loadedSteps.includes(activeStep)) {
      setLoadedSteps((prev) => [...prev, activeStep]);
    }
  }, [activeStep]);

  const selectStep = useCallback(
    (stepId: string): void => {
      const step = steps.find((s) => s.id === stepId);
      if (!step) {
        return;
      }
      setActiveStep(step.id);
    },
    [steps, setActiveStep]
  );

  const selectStepByIndex = useCallback(
    (stepIndex: number): void => {
      const step = get(steps, stepIndex);
      if (!step) {
        return;
      }
      setActiveStep(step.id);
    },
    [steps, setActiveStep]
  );

  const nextStep = useCallback((): void => {
    const step = get(steps, activeStepIndex + 1);
    if (!step) {
      return;
    }
    setActiveStep(step.id);
  }, [steps, activeStepIndex, setActiveStep]);

  const previousStep = useCallback((): void => {
    const step = get(steps, activeStepIndex - 1);
    if (!step) {
      return;
    }
    setActiveStep(step.id);
  }, [steps, activeStepIndex, setActiveStep]);

  return (
    <StepperProvider
      selectStep={selectStep}
      selectStepByIndex={selectStepByIndex}
      nextStep={nextStep}
      previousStep={previousStep}
    >
      <Box sx={sx}>
        <Stepper activeStep={activeStepIndex} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {divider}

        {React.Children.toArray(children)
          .filter((child) => !!child)
          .map((child: any, index: number) => {
            const step: StepInfo = get(steps, index);
            const stepLoaded: boolean = !step || !step.lazy || activeStep === step.id || loadedSteps.includes(step.id);
            return (
              <Box
                sx={{
                  display: activeStep === step.id ? 'block' : 'none',
                  ...sxTabContainer,
                }}
                key={step.id}
              >
                {stepLoaded && child}
              </Box>
            );
          })}
      </Box>
    </StepperProvider>
  );
};
export default StepperPanel;
