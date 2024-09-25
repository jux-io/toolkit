export const globalEventHandler = <T>(
  externalEventHandler?: (event: T) => void,
  internalEventHandler?: (event: T) => void,
  overrideDefaultPrevented = false
) => {
  return (event: T) => {
    externalEventHandler?.(event);

    if (
      overrideDefaultPrevented ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return internalEventHandler?.(event);
    }
  };
};
