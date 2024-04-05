import { FetchRickAndMortyCharacterProps } from '.';

export const QUERY_RICK_AND_MORTY_KEYS = {
  all: ['rick-and-morty-characters'] as const,
  list: (params: FetchRickAndMortyCharacterProps) =>
    [...QUERY_RICK_AND_MORTY_KEYS.all, 'list', params] as const,
} as const;
