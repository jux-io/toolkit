import * as React from 'react';

export function createCustomContext<ContextValueType>(
  componentName: string,
  defaultContextValue?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContextValue
  );

  const Provider = (
    props: ContextValueType & {
      children: React.ReactNode;
    }
  ) => {
    const { children, ...context } = props;
    const value = React.useMemo(() => context, [context]) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContext = (consumerName: string) => {
    const context = React.useContext(Context);
    if (context) return context;

    if (defaultContextValue !== undefined) return defaultContextValue;

    throw new Error(`${consumerName} must be used within ${componentName}`);
  };

  Provider.displayName = componentName + '.Provider';

  return {
    Provider,
    useContext,
  };
}
