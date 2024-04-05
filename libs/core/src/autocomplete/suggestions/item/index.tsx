import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { useInteractions } from '@floating-ui/react';
import { useSelector } from '@xstate/react';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { useAutocompleteContext } from '../../context';
import {
  SuggestionImg,
  SuggestionItemBox,
  SuggestionItemInformationBox,
} from './styled';

export type SuggestionDisplayItem<T> = {
  id: string;
  title: string;
  icon: string;
  description: string;
  value: T;
};

export type SuggestionItemType<T> = {
  added?: boolean;
  active?: boolean;
  onItemClicked: (value: T, addToList: boolean) => void;
} & Partial<ReturnType<typeof useInteractions>['getItemProps']> &
  SuggestionDisplayItem<T>;

export const SuggestionItem = forwardRef<
  HTMLDivElement,
  SuggestionItemType<any>
>(
  (
    {
      title,
      icon,
      description,
      added,
      value,
      id,
      onItemClicked,
      active,
      ...otherProps
    },
    ref
  ) => {
    const autocompleteContext = useAutocompleteContext();

    const matchQuery = useSelector(autocompleteContext, (state) => {
      return state.context.keyword ?? '';
    });

    const matches = match(title, matchQuery);
    const parts = parse(title, matches);

    return (
      <SuggestionItemBox
        className={classNames({
          active: active,
        })}
        {...otherProps}
        ref={ref}
        role="option"
        onClick={(e) => {
          e.preventDefault();
          onItemClicked(value, !added);
        }}
      >
        <input type="checkbox" checked={added} />
        <SuggestionImg src={icon} alt={title} />
        <SuggestionItemInformationBox>
          <div>
            {parts.map((part, index) => {
              const key = `${part.text}-${index}`;
              return part.highlight ? (
                <strong key={key}>{part.text}</strong>
              ) : (
                <span key={key}>{part.text}</span>
              );
            })}
          </div>
          <div>{description}</div>
        </SuggestionItemInformationBox>
      </SuggestionItemBox>
    );
  }
);
