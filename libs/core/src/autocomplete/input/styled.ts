import styled from '@emotion/styled';

export const AutocompleteInput = styled('input')`
  border: none;
  line-height: 32px;
  width: 100%;
  flex: 1 1;
  &:focus-visible {
    outline: none;
  }
`;

export const InputStyled = styled('div')`
  display: flex;
  flex-direction: row;
  border: 1px solid rgba(148, 163, 184, 1);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  flex-wrap: nowrap;
  align-items: center;
  &:focus-visible {
    outline: none;
  }

  &.error_state {
    outline: 1px solid red;
  }

  .list-opened {
    transition: transform 0.3s ease;
    transform: rotate(-180deg);
  }
  .list-closed {
    transition: transform 0.3s ease;
    transform: rotate(0deg);
  }
`;

export const InputWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  min-width: 0;
  flex-wrap: wrap;
  gap: 4px;
`;
