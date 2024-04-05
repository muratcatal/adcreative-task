import { createContext, useContext, useEffect } from 'react';
import { autocompleteActor } from './states';

const AutocompleteContext = createContext(autocompleteActor);

type AutocompleteProviderProps<T> = {
  children: React.ReactNode;
  value?: T[];
  onChange?: (value?: T[]) => void;
  isEqual?: (a: T[], b: T) => boolean;
  results?: T[];
};

export const AutocompleteProvider = <T,>({
  children,
  results,
  onChange,
  value,
  isEqual,
}: AutocompleteProviderProps<T>) => {
  useEffect(() => {
    autocompleteActor.send({
      type: 'fetched',
      value: results ?? [],
    });

    if (value) {
      autocompleteActor.send({
        type: 'init_values',
        value,
      });
    }
  }, [results, value]);

  useEffect(() => {
    onChange &&
      autocompleteActor.send({
        type: 'set_on_change_fn',
        callback: onChange as any,
      });

    isEqual &&
      autocompleteActor.send({
        type: 'set_is_equal_fn',
        callback: isEqual as any,
      });
  }, [isEqual, onChange]);

  return (
    <AutocompleteContext.Provider value={autocompleteActor}>
      {children}
    </AutocompleteContext.Provider>
  );
};

export const useAutocompleteContext = () => {
  const context = useContext(AutocompleteContext);

  if (context === undefined) {
    throw new Error(
      'useAutocompleteContext must be used within a AutocompleteProvider'
    );
  }
  return context;
};
