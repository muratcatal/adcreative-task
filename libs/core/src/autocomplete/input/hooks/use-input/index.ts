import { useSelector } from '@xstate/react';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useAutocompleteContext } from '../../../context';

type UseInputProps<T> = {
  onKeywordChange: (keyword?: string) => void;
};

export const useInput = <T>({ onKeywordChange }: UseInputProps<T>) => {
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  const autocompleteContext = useAutocompleteContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const addedItems = useSelector(autocompleteContext, (state) => {
    return state.context.addedItems as T[];
  });

  const activeIndexInList = useSelector(autocompleteContext, (state) => {
    return state.context.activeIndexInList;
  });

  const results = useSelector(autocompleteContext, (state) => {
    return state.context.results;
  });

  const handleInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    onKeywordChange(event.target.value);
  };

  const handleRemoveAddedItem = useCallback(
    (item: T) => {
      autocompleteContext.send({
        type: 'remove_added_item',
        value: item,
      });
    },
    [autocompleteContext]
  );

  const handleInputFocused = useCallback(() => {
    setFocusedItemIndex(null);
  }, []);

  return {
    inputRef,
    addedItems,
    activeIndexInList,
    results,
    focusedItemIndex,
    setFocusedItemIndex,
    onInputChanged: handleInputChanged,
    onAddedItemRemoved: handleRemoveAddedItem,
    onInputFocused: handleInputFocused,
    autocompleteContext,
  };
};
