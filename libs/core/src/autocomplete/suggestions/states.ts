import { createBrowserInspector } from '@statelyai/inspect';
import { assign, createActor, setup } from 'xstate';

const { inspect } = createBrowserInspector();

const suggestionsState = setup({
  types: {
    context: {} as { suggestions: unknown[]; added_suggestions: string[] },
    events: {} as
      | {
          type: 'focused';
        }
      | {
          type: 'blur';
        }
      | {
          type: 'add_item';
          value: string;
        },
  },
  actions: {
    assignToSuggestions: assign({
      added_suggestions: ({ context, event }) => {
        return event.type === 'add_item'
          ? [...context.added_suggestions, event.value]
          : context.added_suggestions;
      },
    }),
  },
  schemas: {
    events: {
      focused: {
        type: 'object',
        properties: {},
      },
      blur: {
        type: 'object',
        properties: {},
      },
      add_item: {
        type: 'object',
        properties: {},
      },
    },
  },
}).createMachine({
  id: 'suggest_list',
  initial: 'closed',
  context: {
    added_suggestions: [],
    suggestions: [],
  },
  states: {
    closed: {
      on: {
        focused: {
          target: 'opened',
        },
      },
    },
    opened: {
      on: {
        blur: {
          target: 'closed',
        },
        add_item: {
          actions: {
            type: 'assignToSuggestions',
          },
          target: 'closed',
        },
      },
    },
  },
});

const suggestionActor = createActor(suggestionsState, {
  inspect,
});
suggestionActor.start();

export { suggestionActor };
