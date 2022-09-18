import { FC, HTMLProps, ReactNode, useCallback, useMemo } from 'react';
import { Accordion as ReactAccordion } from 'react-accessible-accordion';

import { ReactComponent as ArrowDownIcon } from '@icons/small/chevronDown.svg';

import AccordionButton, { AccordionButtonProps } from './Button';
import AccordionHeading, { AccordionHeadingProps } from './Heading';
import AccordionItem, { AccordionItemProps } from './Item';
import AccordionPanel, { AccordionPanelProps } from './Panel';
import { AccordionContext, AccordionContextProps } from './useAccordion';
import { themes } from './themes';
import { AccordionSize, AccordionStateFull, AccordionVariants } from './types';

export interface AccordionCompositionProps {
  Item: FC<AccordionItemProps>;
  Heading: FC<AccordionHeadingProps>;
  Panel: FC<AccordionPanelProps>;
  Button: FC<AccordionButtonProps>;
}

export interface AccordionProps
  extends AccordionContextProps,
    Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'ref' | 'size'> {
  /** List of Accordion.Item components */
  children: ReactNode;
  /** Panel change handler */
  onChange?: (ids: string[]) => void;
  /** Allow to simultaneously open multiple panels */
  allowMultipleExpanded?: boolean;
  /** Allow to simultaneously close all panels */
  allowZeroExpanded?: boolean;
  /** List of expanded panels by default */
  preExpanded?: string[];
}

export const Accordion: FC<AccordionProps> & AccordionCompositionProps = ({
  children,
  allowMultipleExpanded = true,
  allowZeroExpanded = true,
  preExpanded,
  onChange,
  Icon = ArrowDownIcon,
  isIconVertical = true,
  animationType,
  transitionTimeout = 300,
  transitionTimeoutExit = transitionTimeout,
  theme = themes.basic,
  variant = AccordionVariants.primary,
  size = AccordionSize.md,
  panelNoPadding = true,
  onEnter,
  onEntering,
  onExit,
  ...props
}) => {
  const contextValue = useMemo(
    () => ({
      panelNoPadding,
      theme,
      size,
      variant,
      Icon,
      isIconVertical,
      animationType,
      transitionTimeout,
      transitionTimeoutExit,
      onEnter,
      onEntering,
      onExit,
    }),
    [
      Icon,
      animationType,
      isIconVertical,
      onEnter,
      onEntering,
      onExit,
      panelNoPadding,
      size,
      theme,
      transitionTimeout,
      transitionTimeoutExit,
      variant,
    ],
  );

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

  const rootCSS = useMemo(() => getCSS('root'), [getCSS]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <ReactAccordion
        allowMultipleExpanded={allowMultipleExpanded}
        allowZeroExpanded={allowZeroExpanded}
        preExpanded={preExpanded}
        onChange={onChange}
        css={rootCSS}
        {...props}
      >
        {children}
      </ReactAccordion>
    </AccordionContext.Provider>
  );
};

Accordion.Item = AccordionItem;
Accordion.Heading = AccordionHeading;
Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

export default Accordion;
