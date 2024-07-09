## FRONTEND TASK BY MURAT ÇATAL

### INSTALLATION

> This application needs node version 20.0.0 or higher to run. You can install node from [here](https://nodejs.org/en/)
> if you are using nvm, you can install `nvm install v20.0.0` run `nvm use v20.0.0` to use the correct node version

1. Install Nx CLI globally by running `npm install -g nx@latest`
2. You can run `npm install` or `yarn install` to install all the dependencies
3. Run `npm run start` or `yarn start` to start the application

### STORYBOOK

In order to view the storybook for autocomplete component, you need to do the following:

1. Run `npm run storybook` or `yarn storybook` to start the storybook

### PROJECT STRUCTURE

The project is a monorepo to support extensibility and reusability using nx.dev framework. The project contains the following:

1. `apps`: This contains the frontend application. For any new project that needs to be added, it should be added here
2. `libs/core`: This contains the shared components. Components that are used across the application should be added here to ensure reusability. Components in this library should not have any business logic or project-specific code.
3. `libs/frontend-case-services`: This library contains the services that are used in the frontend application. Each service should be added in a separate file. The services should be used to fetch data from the backend or any other source.

### COMPONENTS

#### AUTOCOMPLETE COMPONENT API

The autocomplete component is a reusable component that can be used in any part of the application. It can be used as standalone, with form or either with 3rd party form libraries such as react-final-form. To see usage examples, please check storybook. Following are the props that are available in the autocomplete component:

1. `value`: The value of the input field
2. `onChange`: The function that is called when the input field value changes
3. `results`: The list of items that are displayed in the dropdown. The items should be an array of objects.
4. `placeholder`: The placeholder text for the input field. Default is "Search..."
5. `isLoading`: A boolean value that indicates whether the component is in a loading state
6. `error`: A boolean value that indicates whether there is an error in the component. It is designed to let engineers to handle error message in their own way. This prop just wraps component with error class.
7. `onKeywordChange`: The function that is called when the input field value changes. It is debounced by default to 500ms which can be changed with debounceTime property. The function is called with the keyword as an argument.
8. `debounceTime`: The time in milliseconds to wait before calling the `onKeywordChange` function. Default is 500ms
9. `formatAddedItem`: The function that is called to format the selected item in input field so that it can be displayed in the input field as a chip with your own format.
10. `isEqual`: The function that is called to compare the selected item with the items in the dropdown. Since the autocomplete supports any type of object, by using this function,
    you can compare the selected item with the items in the dropdown. The function is called with the results and the item as arguments.
11. `emptyMessage`: The message that is displayed when there are no results. Default is "No results found".
12. `onScroll`: The function that is called when the user scrolls to the bottom of the dropdown. Function is called with no arguments and debounced by default. The function is useful for infinite scrolling in autocomplete.
13. `formatSuggestionItem`: The function that is called to format the items in the dropdown. The function is called with the item as an argument and should return an object with the following properties:
    - `id`: The unique identifier of the item
    - `title`: The title of the item
    - `description`: The description of the item
    - `icon`: The icon of the item
    - `value`: The value of the item

#### AUTOCOMPLETE COMPONENT USAGE

The autocomplete component can be used in any part of the application. Here is an example of how to use the component:

```tsx
import { useCallback, useState } from 'react';
import { Autocomplete } from '../autocomplete';
import { RickAndMortyCharacter, useFetchRickAndMortyCharacters } from '../service/use-fetch-rick-and-morty';

export const RickAndMorty = () => {
  const [keyword, setKeyword] = useState<string | undefined>();

  const {
    data,
    isError,
    fetchNextPage,
    isFetchingNextPage: isLoading,
  } = useFetchRickAndMortyCharacters({
    name: keyword,
  });

  const handleKeywordChange = useCallback((keyword?: string) => {
    setKeyword(keyword);
  }, []);

  const results = data?.pages.flatMap((page) => page.results) || [];

  return (
    <Autocomplete<RickAndMortyCharacter>
      results={results}
      onKeywordChange={handleKeywordChange}
      isLoading={isLoading}
      formatAddedItem={(result) => result.name}
      isEqual={(results, item) => {
        return results.find((result) => result.id === item.id) !== undefined;
      }}
      emptyMessage="No results found"
      error={isError}
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
      placeholder="Search..."
    />
  );
};
```

### TECHNOLOGIES USED

The following technologies are used in the project:

1. React
2. Typescript
3. Storybook
4. Nx.dev
5. Styled Components
6. XState
7. axios
8. react-query
9. autosuggest-highlight
10. Mui-icons
11. @floating-ui/react
