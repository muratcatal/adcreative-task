import {
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import { debounce } from '@mui/material';
import { useSelector } from '@xstate/react';
import React, { createContext, useContext, useRef, useState } from 'react';
import { useAutocompleteContext } from '..';

type FloatingProviderProps = {
  children: (props: FloatingContextValue) => React.ReactNode;
};

type FloatingContextValue = {
  opened: boolean;
  setOpened: (value: boolean) => void;
  floatingProps: any;
  context: ReturnType<typeof useFloating>['context'];
  refs: ReturnType<typeof useFloating>['refs'];
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
  activeIndex: number | null;
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
};

const FloatingContext = createContext<FloatingContextValue | undefined>(
  undefined
);

export const FloatingProvider: React.FC<FloatingProviderProps> = ({
  children,
}) => {
  const [opened, setOpened] = useState(false);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const autocompleteContext = useAutocompleteContext();

  const activeIndex = useSelector(autocompleteContext, (state) => {
    return state.context.activeIndexInList;
  });

  const setActiveIndex = (index: number | null) => {
    autocompleteContext.send({
      type: 'set_active_item_index_in_list',
      value: index,
    });
  };

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: opened,
    onOpenChange: setOpened,
    middleware: [
      offset(10),
      flip({ padding: 10 }),
      size({
        apply: debounce(({ rects, availableHeight, elements }: any) => {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width - 10}px`,
            maxHeight: `${250}px`,
          });
        }, 1),
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: 'listbox' });

  const dismiss = useDismiss(context);

  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav]
  );

  const floatingProps = {
    ...getFloatingProps({
      ref: refs.setFloating,
      style: {
        ...floatingStyles,
        overflowY: 'auto',
      },
    }),
  };

  return (
    <FloatingContext.Provider
      value={{
        opened,
        setOpened,
        floatingProps,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        context,
        refs,
        listRef,
        activeIndex,
      }}
    >
      {typeof children === 'function'
        ? children({
            opened,
            setOpened,
            floatingProps,
            getReferenceProps,
            getFloatingProps,
            getItemProps,
            context,
            refs,
            listRef,
            activeIndex,
          })
        : children}
    </FloatingContext.Provider>
  );
};

export const useFloatingContext = () => {
  return useContext(FloatingContext);
};
