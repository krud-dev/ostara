export const calculateElementDocumentOffsetTop = (element: HTMLElement): number => {
  let calculatedTopOffset = element.getBoundingClientRect().top;

  let offsetElement: HTMLElement | null = element;
  while (offsetElement !== document.documentElement) {
    offsetElement = offsetElement.parentElement;
    if (offsetElement === null) {
      break;
    }
    calculatedTopOffset += offsetElement.scrollTop;
  }

  return calculatedTopOffset;
};
