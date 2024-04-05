import { useInfiniteQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { QUERY_RICK_AND_MORTY_KEYS } from './keys';

export type FetchRickAndMortyCharacterProps = {
  name?: string;
};

type FetchRickAndMortyCharacterInfo = {
  count: number;
  pages: number;
  next?: string;
  prev?: string;
};

export type RickAndMortyCharacterType = {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

type FetchRickAndMortyCharacterResponse = {
  info: FetchRickAndMortyCharacterInfo;
  results: RickAndMortyCharacterType[];
};

const fetchCharacters = async ({
  name,
  nextPageUrl,
}: FetchRickAndMortyCharacterProps & { nextPageUrl: string }) => {
  const result = await axios.get<FetchRickAndMortyCharacterResponse>(
    nextPageUrl,
    {
      params: {
        name,
      },
    }
  );

  return result?.data;
};

export const useFetchRickAndMortyCharacters = (
  params: FetchRickAndMortyCharacterProps
) => {
  return useInfiniteQuery<FetchRickAndMortyCharacterResponse>({
    queryKey: QUERY_RICK_AND_MORTY_KEYS.list(params),
    queryFn: ({ pageParam }) => {
      return fetchCharacters({
        name: params.name,
        nextPageUrl: pageParam as string,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.info.next;
    },
    getPreviousPageParam: (lastPage) => {
      return lastPage.info.prev;
    },
    initialPageParam: 'https://rickandmortyapi.com/api/character',
    retry(failureCount, error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
