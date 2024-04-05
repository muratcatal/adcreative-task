import { Autocomplete } from '@adcreative/core';
import {
  RickAndMortyCharacterType,
  useFetchRickAndMortyCharacters,
} from '@adcreative/frontend-case-service';
import { useCallback, useState } from 'react';

export const RickAndMorty = () => {
  const [keyword, setKeyword] = useState<string | undefined>();

  const { data, isError, fetchNextPage, isLoading, isFetchingNextPage } =
    useFetchRickAndMortyCharacters({
      name: keyword,
    });

  const handleKeywordChange = useCallback((keyword?: string) => {
    setKeyword(keyword);
  }, []);

  const results = data?.pages.flatMap((page) => page.results) || [];

  return (
    <>
      <h1>Rick&Morty frontend case by Murat Çatal</h1>
      <Autocomplete<RickAndMortyCharacterType>
        results={results || []}
        placeholder="Search..."
        emptyMessage="No results found"
        error={isError}
        isLoading={isLoading || isFetchingNextPage}
        onKeywordChange={handleKeywordChange}
        formatAddedItem={(result) => result.name}
        isEqual={(results, item) => {
          return (
            results.find((result) => result?.id === item?.id) !== undefined
          );
        }}
        onScroll={() => {
          if (!isLoading) {
            fetchNextPage();
          }
        }}
        formatSuggestionItem={(item) => ({
          id: item.id,
          title: item.name,
          description: `Episodes ${item.episode?.length}`,
          icon: item.image,
          value: item,
        })}
      />
    </>
  );
};
