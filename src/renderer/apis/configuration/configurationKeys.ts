export const configurationKeys = {
  configuration: () => ['configuration'],
  items: () => [...configurationKeys.configuration(), 'items'],
  item: (id: string) => [...configurationKeys.configuration(), 'items', id],
};
