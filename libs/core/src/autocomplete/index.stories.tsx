import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Field, Form } from 'react-final-form';
import { Autocomplete } from './index';

type Result = {
  id: string;
  name: string;
  description: string;
};

const meta: Meta<typeof Autocomplete<Result>> = {
  component: Autocomplete,
  title: 'Autocomplete',
  args: {
    results: [],
    onKeywordChange: fn(),
    debounceTime: 500,
    isLoading: false,
    formatSuggestionItem: (item: Result) => {
      return {
        id: item.id,
        title: item.name,
        description: item.description,
        icon: 'https://via.placeholder.com/150',
        value: item,
      };
    },
    formatAddedItem: (result: Result) => {
      return result.name;
    },
    isEqual: (a: Result[], b: Result) => {
      return a.find((result) => result?.id === b?.id) !== undefined;
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const WithCustomNoDataFoundMessage: Story = {
  args: {
    results: [],
    emptyMessage: 'Custom no results found',
  },
};

export const WithData: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
      {
        id: '2',
        name: 'Morty',
        description: 'Grandson',
      },
    ],
  },
};

export const WithLoadingState: Story = {
  args: {
    results: [],
    isLoading: true,
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    results: [],
    placeholder: 'Custom placeholder',
  },
};

export const WithValueAndOnChangeSet: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
      {
        id: '2',
        name: 'Morty',
        description: 'Grandson',
      },
    ],
    onChange: fn(),
    value: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
    ],
  },
};

export const WithCustomLabeling: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
      {
        id: '2',
        name: 'Morty',
        description: 'Grandson',
      },
    ],
    formatAddedItem: (result) => {
      return `${(result as Result).name} - ${(result as Result).description}`;
    },
  },
};

export const WithCustomListItem: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
      {
        id: '2',
        name: 'Morty',
        description: 'Grandson',
      },
    ],
    formatSuggestionItem: (result) => {
      return {
        icon: 'https://via.placeholder.com/150',
        id: (result as Result).id,
        title: `Custom ${(result as Result).name}`,
        value: result,
        description: `Custom ${(result as Result).description}`,
      };
    },
  },
};

export const WithErrorState: Story = {
  args: {
    results: [],
    error: true,
  },
};

export const WithReactFinalForm: Story = {
  render: (props) => {
    return (
      <Form
        initialValues={{
          selectedItems: [
            {
              id: '1',
              name: 'Rick',
              description: 'Scientist',
            },
          ],
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <h2>
              Autocomplete used by react-final-form with initial values set
            </h2>
            <h3>Please check console to see submit value</h3>
            <div>
              <Field
                name="selectedItems"
                component={({ input }) => {
                  const { value, onChange } = input;
                  return (
                    <Autocomplete
                      {...props}
                      value={value}
                      onChange={onChange}
                    />
                  );
                }}
              />
            </div>
            <br />
            <button type="submit">Submit</button>
          </form>
        )}
      />
    );
  },
  args: {
    results: [
      {
        id: '1',
        name: 'Rick',
        description: 'Scientist',
      },
      {
        id: '2',
        name: 'Morty',
        description: 'Grandson',
      },
    ],
    onChange: fn(),
  },
};

const PaginatedMockValue = new Array(10).fill({
  id: Math.random().toString(),
  name: `Dummy ${Math.random()}`,
  description: `Dummy ${Math.random()}`,
});

export const WithPagination: Story = {
  args: {
    results: PaginatedMockValue,
    onScroll: () => {
      new Promise((resolve) => {
        setTimeout(() => {
          PaginatedMockValue.push(
            ...new Array(10).fill({
              id: Math.random().toString(),
              name: `Dummy ${Math.random()}`,
              description: `Dummy ${Math.random()}`,
            })
          );
          resolve(PaginatedMockValue);
        }, 500);
      });
    },
    isLoading: true,
  },
};
