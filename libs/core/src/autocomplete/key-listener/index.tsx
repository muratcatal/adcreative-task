import { useEffect, useRef } from 'react';

type KeyEvent =
  | 'onArrowUp'
  | 'onArrowDown'
  | 'onArrowLeft'
  | 'onArrowRight'
  | 'onEnter'
  | 'onTab'
  | 'onBackspace';

type KeyListenerProps = {
  children: React.ReactNode;
  subscribeTo: Partial<Record<KeyEvent, (event: KeyboardEvent) => void>>;
};

export const KeyListener = ({ children, subscribeTo }: KeyListenerProps) => {
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const subscriptionEvents = Object.keys(subscribeTo).map((key) =>
        key.replace('on', '')
      );

      if (subscriptionEvents.includes(key)) {
        subscribeTo[`on${key}` as KeyEvent]?.(event);
      }
    };

    childRef.current?.addEventListener('keydown', handleKeyDown);

    return () => {
      childRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [childRef, subscribeTo]);

  return <div ref={childRef}>{children}</div>;
};
