import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFloatingContext } from '../context/floating';
import { useSuggestions } from './hooks/use-suggestions';
import { SuggestionDisplayItem, SuggestionItem } from './item';
import { EmptyListItem, SuggestionBox } from './styled';

type SuggestionsProps<T> = {
  isEqual: (a: T[], b: T) => boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  onNextPage?: () => void;
  formatSuggestionItem: (item: T) => SuggestionDisplayItem<T>;
};

export const Suggestions = <T,>({
  isEqual,
  isLoading,
  emptyMessage = 'No results found',
  onNextPage,
  formatSuggestionItem,
}: SuggestionsProps<T>) => {
  const floatingContext = useFloatingContext();
  const { suggestions, addedItems, onItemSelected } = useSuggestions({
    formatSuggestionItem,
  });

  const { ref: lastElmRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      onNextPage?.();
    }
  }, [inView, onNextPage]);

  return (
    <SuggestionBox {...floatingContext?.floatingProps}>
      {suggestions.length === 0 && !isLoading && (
        <EmptyListItem>{emptyMessage}</EmptyListItem>
      )}
      {suggestions.map(({ id, title, description, icon, value }, index) => {
        return (
          <SuggestionItem
            active={floatingContext?.activeIndex === index}
            added={isEqual(addedItems as T[], value)}
            id={id}
            title={title}
            description={description}
            icon={icon}
            value={value}
            onItemClicked={onItemSelected}
            {...floatingContext?.getItemProps({
              key: id,
              ref(node) {
                floatingContext.listRef.current[index] = node;
              },
              onClick() {
                (floatingContext?.refs.domReference.current as any)?.focus();
              },
            })}
            {...(suggestions.length - 3 === index && {
              ref: lastElmRef,
            })}
          />
        );
      })}
      {isLoading && <EmptyListItem>Loading...</EmptyListItem>}
    </SuggestionBox>
  );
};
