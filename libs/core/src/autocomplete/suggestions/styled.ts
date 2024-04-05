import { Popover, styled } from '@mui/material';

export const PopoverStyled = styled(Popover)`
  .MuiPopover-paper {
    border: 1px solid rgba(148, 163, 184, 1);
    border-radius: 10px;
    box-shadow: unset;
    width: inherit;
  }
`;

export const SuggestionBox = styled('div')`
  display: flex;
  overflow-y: auto;
  max-height: 120px;
  flex-direction: column;

  width: 100%;
  border-radius: 10px;
  background-color: rgba(248, 250, 252, 1);
  border: 1px solid rgba(148, 163, 184, 1);
`;

export const EmptyListItem = styled('div')`
  padding: 10px;
`;
