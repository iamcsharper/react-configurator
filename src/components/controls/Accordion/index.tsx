import { FC, HTMLProps, ReactNode, useMemo } from "react";
import { Accordion as ReactAccordion } from "react-accessible-accordion";

// import ArrowDownIcon from "@icons/small/chevronRight.svg";

import AccordionButton, { AccordionButtonProps } from "./Button";
import AccordionHeading, { AccordionHeadingProps } from "./Heading";
import AccordionItem, { AccordionItemProps } from "./Item";
import AccordionPanel, { AccordionPanelProps } from "./Panel";
import { AccordionContext, AccordionContextProps } from "./useAccordion";

export interface AccordionCompositionProps {
  Item: FC<AccordionItemProps>;
  Heading: FC<AccordionHeadingProps>;
  Panel: FC<AccordionPanelProps>;
  Button: FC<AccordionButtonProps>;
}

export interface AccordionProps
  extends Omit<AccordionContextProps, "theme" | "size" | "variant">,
    Omit<HTMLProps<HTMLDivElement>, "onChange" | "ref" | "size"> {
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
  Icon,
  animationType,
  transitionTimeout = 300,
  transitionTimeoutExit = transitionTimeout,
  onEnter,
  onEntering,
  onExit,
  ...props
}) => {
  const contextValue = useMemo(
    () => ({
      Icon,
      animationType,
      transitionTimeout,
      transitionTimeoutExit,
      onEnter,
      onEntering,
      onExit,
    }),
    []
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <ReactAccordion
        allowMultipleExpanded={allowMultipleExpanded}
        allowZeroExpanded={allowZeroExpanded}
        preExpanded={preExpanded}
        onChange={onChange}
        css={{
          width: "100%",
        }}
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
