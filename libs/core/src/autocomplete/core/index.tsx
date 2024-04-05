import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

import { FloatingProvider } from '../context/floating';
import { Input } from '../input';
import { AutocompleteWrapper } from '../styled';
import { Suggestions } from '../suggestions';
import { SuggestionDisplayItem } from '../suggestions/item';
import { useAutocompleteCore } from './hooks/use-autocomplete-core';

export type AutocompleteProps<T> = {
  results: T[];
  onKeywordChange: (keyword?: string) => void;
  debounceTime?: number;
  isLoading?: boolean;
  formatAddedItem: (result: T) => string;
  isEqual: (a: T[], b: T) => boolean;
  error?: boolean;
  emptyMessage?: string;
  onScroll?: () => void;
  formatSuggestionItem: (item: T) => SuggestionDisplayItem<T>;
  placeholder?: string;
  value?: T[];
  onChange?: (value?: T[]) => void;
};

export const AutocompleteCore = <T,>({
  formatAddedItem,
  isEqual,
  onKeywordChange,
  debounceTime,
  isLoading,
  error,
  emptyMessage,
  onScroll,
  formatSuggestionItem,
  placeholder,
}: Omit<AutocompleteProps<T>, 'results'>) => {
  const { onKeywordChanged, onNextPage } = useAutocompleteCore({
    debounceTime: debounceTime || 500,
    onKeywordChange,
    onScroll,
  });

  return (
    <FloatingProvider>
      {({ opened, setOpened, context }) => {
        return (
          <AutocompleteWrapper>
            <Input
              onKeywordChange={onKeywordChanged}
              onFocus={() => setOpened(true)}
              onFormatAddedItem={formatAddedItem}
              isListOpened={opened}
              error={error}
              placeholder={placeholder || 'Search...'}
            />

            <FloatingPortal>
              {opened && (
                <FloatingFocusManager
                  context={context}
                  initialFocus={-1}
                  visuallyHiddenDismiss
                >
                  <Suggestions
                    emptyMessage={emptyMessage}
                    isLoading={isLoading}
                    isEqual={isEqual}
                    onNextPage={onNextPage}
                    formatSuggestionItem={formatSuggestionItem}
                  />
                </FloatingFocusManager>
              )}
            </FloatingPortal>
          </AutocompleteWrapper>
        );
      }}
    </FloatingProvider>
  );
};
