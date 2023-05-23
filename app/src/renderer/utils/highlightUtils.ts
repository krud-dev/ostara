export const highlightElement = (elementId: string, color: string, options: { duration?: number } = {}): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  if (element.style.backgroundColor === color) {
    return;
  }

  const originalColor = element.style.backgroundColor;
  const originalTransition = element.style.transition;

  const duration = options.duration || 800;
  const transition = `background-color ${duration}ms linear`;
  if (originalTransition.indexOf(transition) > -1) {
    return;
  }

  element.style.transition = transition;
  element.style.backgroundColor = color;

  setTimeout(() => {
    element.style.backgroundColor = originalColor;
  }, duration);

  setTimeout(() => {
    element.style.transition = originalTransition;
  }, duration * 2);
};
