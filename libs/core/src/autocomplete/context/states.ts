import { createBrowserInspector } from '@statelyai/inspect';
import { assign, createActor, setup } from 'xstate';

export const machine = setup({
  types: {
    context: {} as {
      results: unknown[];
      addedItems: unknown[];
      keyword?: string;
      activeIndexInList: number | null;
      onChange?: (value?: unknown[]) => void;
      isEqualFn: (a: unknown[], b: unknown) => boolean;
    },
    events: {} as
      | { type: 'fetched'; value: unknown[] }
      | { type: 'init_values'; value?: unknown[] }
      | { type: 'set_on_change_fn'; callback?: (value?: unknown[]) => void }
      | {
          type: 'set_is_equal_fn';
          callback?: (a: unknown[], b: unknown) => boolean;
        }
      | { type: 'add_item'; value: unknown }
      | { type: 'remove_added_item'; value: unknown }
      | { type: 'update_keyword'; value?: string }
      | { type: 'set_active_item_index_in_list'; value: number | null },
  },
  actions: {
    assignResult: assign({
      results: ({ context, event }) => {
        return event.type === 'fetched' ? event.value : context.results;
      },
    }),
    addItem: assign({
      addedItems: ({ context, event }) => {
        if (event.type !== 'add_item') {
          return context.addedItems;
        }
        const items = [...context.addedItems, event.value];

        context.onChange?.(items);

        return items;
      },
      keyword: '',
      activeIndexInList: null,
    }),
    removeAddedItem: assign({
      addedItems: ({ context, event }) => {
        if (event.type !== 'remove_added_item') {
          return context.addedItems;
        }
        const items = context.addedItems.filter(
          (f) => !context.isEqualFn([f], event.value)
        );
        context.onChange?.(items);
        return items;
      },
    }),
    setKeyword: assign({
      keyword: ({ context, event }) => {
        return event.type === 'update_keyword' ? event.value : context.keyword;
      },
    }),
    setOnChangeFn: assign({
      onChange: ({ context, event }: any) => {
        return event.type === 'set_on_change_fn'
          ? event.callback
          : context.onChange;
      },
    }),
    setIsEqualFn: assign({
      isEqualFn: ({ context, event }: any) => {
        return event.type === 'set_is_equal_fn'
          ? event.callback
          : context.onChange;
      },
    }),
    initValues: assign({
      addedItems: ({ context, event }) => {
        return event.type === 'init_values'
          ? event.value?.filter(Boolean) ?? []
          : context.addedItems;
      },
    }),
    activeIndexInList: assign({
      activeIndexInList: ({ context, event }) => {
        return event.type === 'set_active_item_index_in_list'
          ? event.value
          : context.activeIndexInList;
      },
    }),
  },
  guards: {
    isSelectionInAddedItems: ({ context, event }) => {
      return (
        event.type !== 'set_on_change_fn' &&
        event.type !== 'set_is_equal_fn' &&
        context.isEqualFn(context.addedItems, event.value)
      );
    },
    isItemNotAdded: ({ context, event }) => {
      return (
        event.type !== 'set_on_change_fn' &&
        event.type !== 'set_is_equal_fn' &&
        !context.isEqualFn(context.addedItems, event.value)
      );
    },
  },
  schemas: {
    events: {
      fetched: {
        type: 'object',
        properties: {},
      },
      init_values: {
        type: 'object',
        properties: {},
      },
      add_item: {
        type: 'object',
        properties: {},
      },
      remove_added_item: {
        type: 'object',
        properties: {},
      },
      update_keyword: {
        type: 'object',
        properties: {},
      },
      set_on_change_fn: {
        type: 'object',
        properties: {},
      },
      set_is_equal_fn: {
        type: 'object',
        properties: {},
      },
      set_active_item_index_in_list: {
        type: 'object',
        properties: {},
      },
    },
    context: {
      results: {
        type: 'array',
        description: '',
      },
    },
  },
}).createMachine({
  context: {
    results: [],
    addedItems: [],
    activeIndexInList: null,
    isEqualFn: (a: unknown[], b: unknown) => a.includes(b),
  },
  id: 'autocomplete',
  initial: 'idle',
  states: {
    idle: {
      on: {
        fetched: {
          actions: {
            type: 'assignResult',
          },
        },
        add_item: {
          guard: {
            type: 'isItemNotAdded',
          },
          actions: {
            type: 'addItem',
          },
        },
        remove_added_item: {
          guard: {
            type: 'isSelectionInAddedItems',
          },
          actions: {
            type: 'removeAddedItem',
          },
        },
        update_keyword: {
          actions: {
            type: 'setKeyword',
          },
        },
        init_values: {
          actions: {
            type: 'initValues',
          },
        },
        set_on_change_fn: {
          actions: {
            type: 'setOnChangeFn',
          },
        },
        set_is_equal_fn: {
          actions: {
            type: 'setIsEqualFn',
          },
        },
        set_active_item_index_in_list: {
          actions: {
            type: 'activeIndexInList',
          },
        },
      },
    },
  },
});

const autocompleteActor = createActor(
  machine,
  process.env.NODE_ENV === 'development'
    ? { inspect: createBrowserInspector().inspect }
    : {}
);

autocompleteActor.start();

export { autocompleteActor };
