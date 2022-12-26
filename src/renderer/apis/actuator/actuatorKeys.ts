export const actuatorKeys = {
  actuator: () => ['actuator'],
  health: (url: string) => [...actuatorKeys.actuator(), 'health', url],
  testConnection: (url: string) => [...actuatorKeys.actuator(), 'testConnection', url],
};
