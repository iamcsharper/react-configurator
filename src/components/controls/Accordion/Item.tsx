import { HTMLProps, ReactNode, useCallback, useMemo } from 'react';
import { AccordionItem as ReactAccordionItem } from 'react-accessible-accordion';
import { themes } from './themes';
import { AccordionStateFull } from './types';
import useAccordion from './useAccordion';

export interface AccordionItemProps
  extends Omit<HTMLProps<HTMLDivElement>, 'ref'> {
  /** Accordion.Heading and Accordion.Panel */
  children: ReactNode;
  /** Unique panel id */
  uuid?: string;
}

export const AccordionItem = ({
  children,
  uuid,
  ...props
}: AccordionItemProps) => {
  const {
    isIconVertical,
    variant,
    size,
    theme = themes.basic,
  } = useAccordion();

  const state = useMemo<AccordionStateFull>(
    () => ({
      isIconVertical,
      size: size!,
      variant: variant!,
    }),
    [isIconVertical, size, variant],
  );

  const getCSS = useCallback(
    (key: keyof typeof theme) => {
      const element = theme[key];
      if (typeof element === 'function') return element(state);
      return element;
    },
    [state, theme],
  );

  const itemCSS = useMemo(() => getCSS('item'), [getCSS]);

  return (
    <ReactAccordionItem uuid={uuid} css={itemCSS} {...props}>
      {children}
    </ReactAccordionItem>
  );
};

export default AccordionItem;
