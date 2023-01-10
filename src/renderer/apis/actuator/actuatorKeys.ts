export const actuatorKeys = {
  actuator: () => ['actuator'],
  testConnection: (url: string) => [...actuatorKeys.actuator(), 'testConnection', url],
};
