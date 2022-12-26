export const actuatorKeys = {
  actuator: () => ['actuator'],
  health: (url: string) => [...actuatorKeys.actuator(), 'health', url],
};
