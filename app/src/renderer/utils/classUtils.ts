export const isClassName = (className: string): boolean => {
  const split = className.split('.');
  if (split.length < 2) {
    return false;
  }
  const last = split[split.length - 1];
  const firstChar = last.charAt(0);
  return firstChar.toLowerCase() !== firstChar.toUpperCase() && firstChar === firstChar.toUpperCase();
};
