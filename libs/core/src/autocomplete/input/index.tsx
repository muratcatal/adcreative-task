import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classnames from 'classnames';
import { ComponentPropsWithRef } from 'react';
import { Chip } from '../chip';
import { useFloatingContext } from '../context/floating';
import { KeyListener } from '../key-listener';
import { useInput } from './hooks/use-input';
import { AutocompleteInput, InputStyled, InputWrapper } from './styled';

type InputProps<T> = Omit<
  ComponentPropsWithRef<typeof AutocompleteInput>,
  'onChange'
> & {
  onKeywordChange: (keyword?: string) => void;
  onFormatAddedItem: (item: T) => string;
  isListOpened: boolean;
  error?: boolean;
};

export const Input = <T,>(props: InputProps<T>) => {
  const {
    onFormatAddedItem,
    isListOpened,
    error,
    onKeywordChange,
    ...inputProps
  } = props;

  const {
    activeIndexInList,
    addedItems,
    focusedItemIndex,
    onInputChanged,
    onInputFocused,
    onAddedItemRemoved,
    inputRef,
    results,
    setFocusedItemIndex,
    autocompleteContext,
  } = useInput<T>({
    onKeywordChange,
  });

  const floatingContext = useFloatingContext();

  return (
    <KeyListener
      subscribeTo={{
        onArrowLeft: (event) => {
          const index =
            focusedItemIndex === null
              ? addedItems.length - 1
              : focusedItemIndex === 0
              ? 0
              : focusedItemIndex - 1;
          setFocusedItemIndex(index);
        },
        onArrowRight: (event) => {
          if (focusedItemIndex === null) return;
          const index =
            focusedItemIndex === addedItems.length - 1
              ? null
              : focusedItemIndex + 1;
          setFocusedItemIndex(index);

          if (index === null) {
            inputRef.current?.focus();
          }
        },
        onTab: (event) => {
          setFocusedItemIndex(null);
        },
        onBackspace: (event) => {
          if (focusedItemIndex === null && (event.target as any)?.value) {
            setFocusedItemIndex(null);
            return;
          } else if (focusedItemIndex === null && addedItems.length > 0) {
            onAddedItemRemoved(addedItems[addedItems.length - 1]);
            setFocusedItemIndex(addedItems.length - 2);
          } else if (focusedItemIndex !== null) {
            onAddedItemRemoved(addedItems[focusedItemIndex]);
            setFocusedItemIndex(focusedItemIndex - 1);
          }
          inputRef.current?.focus();
        },
      }}
    >
      <InputStyled
        {...floatingContext?.getReferenceProps({
          ref: floatingContext?.refs.setReference,
          'aria-autocomplete': 'list',
        })}
        className={classnames({
          error_state: error,
        })}
      >
        <InputWrapper>
          {addedItems?.map((chip, index) => (
            <Chip
              label={onFormatAddedItem(chip as T)}
              key={index}
              value={chip as T}
              onRemove={onAddedItemRemoved}
              focused={focusedItemIndex === index}
              tabIndex={index}
            />
          ))}
          <AutocompleteInput
            tabIndex={addedItems.length}
            placeholder="Search"
            onChange={onInputChanged}
            onFocus={onInputFocused}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                activeIndexInList != null &&
                results[activeIndexInList]
              ) {
                autocompleteContext.send({
                  type: 'add_item',
                  value: results[activeIndexInList],
                });
              }
            }}
            ref={inputRef}
            {...inputProps}
          />
        </InputWrapper>
        <ArrowDropDownIcon
          className={classnames({
            'list-opened': isListOpened,
            'list-closed': !isListOpened,
          })}
        />
      </InputStyled>
    </KeyListener>
  );
};
