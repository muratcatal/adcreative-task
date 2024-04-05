import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { ChipLabel, ChipStyled, CloseIconWrapper } from './styled';

export type ChipType<T> = {
  label: string;
  value: T;
  onRemove: (value: T) => void;
  focused?: boolean;
  tabIndex: number;
};

export const Chip = <T,>({
  label,
  value,
  focused,
  onRemove,
  tabIndex,
}: ChipType<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) {
      ref.current?.focus();
    }
  }, [focused]);

  return (
    <ChipStyled
      tabIndex={tabIndex}
      className={classNames({ focused })}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ChipLabel>{label}</ChipLabel>
      <CloseIconWrapper
        onClick={() => {
          onRemove(value);
        }}
      >
        <CloseIcon />
      </CloseIconWrapper>
    </ChipStyled>
  );
};
