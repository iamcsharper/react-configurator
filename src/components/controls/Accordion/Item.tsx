import { scale } from "@scripts/helpers";
import { HTMLProps, ReactNode } from "react";
import { AccordionItem as ReactAccordionItem } from "react-accessible-accordion";

export interface AccordionItemProps
  extends Omit<HTMLProps<HTMLDivElement>, "ref"> {
  /** Accordion.Heading and Accordion.Panel */
  children: ReactNode;
  /** Unique panel id */
  uuid?: string;
}

export const AccordionItem = ({
  children,
  uuid,
  ...props
}: AccordionItemProps) => (
  <ReactAccordionItem
    uuid={uuid}
    css={{
      ":not(:last-of-type)": {
        marginBottom: scale(2),
      },
    }}
    {...props}
  >
    {children}
  </ReactAccordionItem>
);

export default AccordionItem;
