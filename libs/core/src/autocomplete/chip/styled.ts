import styled from '@emotion/styled';

export const ChipStyled = styled('div')`
  display: inline-flex;
  position: relative;
  user-select: none;
  appearance: none;
  white-space: nowrap;
  cursor: unset;
  text-decoration: none;
  max-width: calc(100% - 6px);
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: gray;
  width: fit-content;
  border-radius: 10px;
  background-color: rgba(223, 228, 233, 1);

  &:focus {
    background-color: rgba(208, 210, 215, 1);
    outline: none;
  }
`;

export const ChipLabel = styled('span')`
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 2px;
  padding-right: 2px;
  white-space: nowrap;
  color: rgba(101, 111, 125, 1);
`;

export const CloseIconWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background-color: rgba(169, 179, 194, 1);
  color: rgba(239, 240, 242, 1);
  cursor: pointer;
`;
