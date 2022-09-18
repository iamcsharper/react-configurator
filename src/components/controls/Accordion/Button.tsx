import { HTMLProps, ReactNode, useCallback, useMemo } from 'react';
import { AccordionItemButton as ReactAccordionItemButton } from 'react-accessible-accordion';
import { themes } from './themes';
import { AccordionStateFull } from './types';

import useAccordion from './useAccordion';

export interface AccordionButtonProps extends HTMLProps<HTMLDivElement> {
  /** Heading content */
  children: ReactNode;
}

export const AccordionButton = ({
  children,
  ...props
}: AccordionButtonProps) => {
  const {
    Icon,
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

  const buttonCSS = useMemo(() => getCSS('button'), [getCSS]);

  return (
    <ReactAccordionItemButton css={buttonCSS} {...props}>
      {children}
      {Icon && <Icon aria-hidden />}
    </ReactAccordionItemButton>
  );
};

export default AccordionButton;
