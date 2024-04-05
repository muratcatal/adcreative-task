import { AutocompleteProvider } from './context';
import { AutocompleteCore, AutocompleteProps } from './core';

export const Autocomplete = <T,>({
  results,
  onKeywordChange,
  debounceTime = 500,
  isLoading,
  formatAddedItem,
  error,
  isEqual,
  emptyMessage,
  onScroll,
  formatSuggestionItem,
  placeholder,
  onChange,
  value,
}: AutocompleteProps<T>) => {
  return (
    <AutocompleteProvider<T>
      results={results}
      value={value}
      onChange={onChange}
      isEqual={isEqual}
    >
      <AutocompleteCore
        formatAddedItem={formatAddedItem}
        isEqual={isEqual}
        onKeywordChange={onKeywordChange}
        debounceTime={debounceTime}
        isLoading={isLoading}
        error={error}
        emptyMessage={emptyMessage}
        onScroll={onScroll}
        formatSuggestionItem={formatSuggestionItem}
        placeholder={placeholder}
      />
    </AutocompleteProvider>
  );
};
