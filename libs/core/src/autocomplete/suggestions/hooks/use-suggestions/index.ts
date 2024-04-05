import { useSelector } from '@xstate/react';
import { useAutocompleteContext } from '../../../context';
import { SuggestionDisplayItem } from '../../item';

type UseSuggestionsProps<T> = {
  formatSuggestionItem: (item: T) => SuggestionDisplayItem<T>;
};

export const useSuggestions = <T>({
  formatSuggestionItem,
}: UseSuggestionsProps<T>) => {
  const autocompleteContext = useAutocompleteContext();

  const addedItems = useSelector(autocompleteContext, (state) => {
    return state.context.addedItems;
  });

  const suggestions = useSelector(autocompleteContext, (state) => {
    return (
      state.context.results?.map((result) =>
        formatSuggestionItem(result as T)
      ) ?? []
    );
  });

  return {
    addedItems,
    suggestions,
    onItemSelected: (value: T, addToList: boolean) => {
      if (addToList) {
        autocompleteContext.send({
          type: 'add_item',
          value,
        });
      } else {
        autocompleteContext.send({
          type: 'remove_added_item',
          value,
        });
      }
    },
  };
};
