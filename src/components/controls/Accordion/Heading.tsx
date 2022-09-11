import { scale } from "@scripts/helpers";
import { HTMLProps, ReactNode } from "react";
import { AccordionItemHeading as ReactAccordionItemHeading } from "react-accessible-accordion";

export interface AccordionHeadingProps extends HTMLProps<HTMLDivElement> {
  /** Accordion.Button */
  children: ReactNode;
  /** Heading level */
  "aria-level"?: number;
}

export const AccordionHeading = ({
  children,
  "aria-level": ariaLevel,
  ...props
}: AccordionHeadingProps) => (
  <ReactAccordionItemHeading
    aria-level={ariaLevel}
    css={{
      padding: scale(1),
      paddingBottom: 0,
    }}
    {...props}
  >
    {children}
  </ReactAccordionItemHeading>
);

export default AccordionHeading;
