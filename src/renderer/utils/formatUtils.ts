export const roundNumber = (number: number, decimals: number): number => {
  return parseFloat(number.toFixed(decimals));
};
