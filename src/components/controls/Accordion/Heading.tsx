import { HTMLProps, ReactNode, useCallback, useMemo } from 'react';
import { AccordionItemHeading as ReactAccordionItemHeading } from 'react-accessible-accordion';
import { themes } from './themes';
import { AccordionStateFull } from './types';
import useAccordion from './useAccordion';

export interface AccordionHeadingProps extends HTMLProps<HTMLDivElement> {
  /** Accordion.Button */
  children: ReactNode;
  /** Heading level */
  'aria-level'?: number;
}

export const AccordionHeading = ({
  children,
  'aria-level': ariaLevel,
  ...props
}: AccordionHeadingProps) => {
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

  const headingCSS = useMemo(() => getCSS('heading'), [getCSS]);

  return (
    <ReactAccordionItemHeading
      aria-level={ariaLevel}
      css={headingCSS}
      {...props}
    >
      {children}
    </ReactAccordionItemHeading>
  );
};

export default AccordionHeading;
