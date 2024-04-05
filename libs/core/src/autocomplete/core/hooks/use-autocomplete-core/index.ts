import { useDebouncedCallback } from 'use-debounce';
import { useAutocompleteContext } from '../../../context';

type UseAutocompleteCoreProps = {
  onKeywordChange: (keyword?: string) => void;
  debounceTime: number;
  onScroll?: () => void;
};

export const useAutocompleteCore = ({
  debounceTime,
  onKeywordChange,
  onScroll,
}: UseAutocompleteCoreProps) => {
  const autocompleteContext = useAutocompleteContext();

  const handleKeywordChange = useDebouncedCallback((keyword?: string) => {
    onKeywordChange(keyword);

    autocompleteContext.send({
      type: 'update_keyword',
      value: keyword,
    });
  }, debounceTime);

  const scrollCallback = useDebouncedCallback(() => {
    onScroll?.();
  }, 500);

  return {
    onKeywordChanged: handleKeywordChange,
    onNextPage: scrollCallback,
  };
};
