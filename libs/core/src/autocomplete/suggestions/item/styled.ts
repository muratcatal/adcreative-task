import styled from '@emotion/styled';

export const SuggestionItemBox = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(148, 163, 184, 1);
  padding: 8px;
  div:not(:first-of-type) {
    padding-top: 8px;
  }
  &.active {
    outline: 2px solid rgba(22, 3, 108, 0.2);
    background: rgba(230, 234, 238, 1);
  }

  &:hover {
    background: rgba(230, 234, 238, 1);
    cursor: pointer;
  }

  &.added {
    background: rgba(217, 220, 223, 1);
  }
`;

export const SuggestionImg = styled('img')`
  width: 36px;
  height: 36px;
  border-radius: 10px;
`;

export const SuggestionItemInformationBox = styled('div')`
  display: flex;
  flex-direction: column;
`;
