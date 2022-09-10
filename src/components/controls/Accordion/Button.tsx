import { colors } from "@scripts/colors";

import { HTMLProps, ReactNode } from "react";
import { AccordionItemButton as ReactAccordionItemButton } from "react-accessible-accordion";

import useAccordion from "./useAccordion";

export interface AccordionButtonProps extends HTMLProps<HTMLDivElement> {
  /** Heading content */
  children: ReactNode;
}

export const AccordionButton = ({
  children,
  ...props
}: AccordionButtonProps) => {
  const { Icon } = useAccordion();

  return (
    <ReactAccordionItemButton
      css={{
        transition:
          "color ease 200ms, background-color ease 200ms, box-shadow ease 200ms",
        position: "relative",
        cursor: "pointer",
        backgroundColor: "transparent",
        color: colors.link,
        fill: colors.link,
        textTransform: "uppercase",
        borderBottom: '1px solid red',

        ".js-focus-visible &.focus-visible:focus": {
          zIndex: 1,
          // outline: `2px solid ${AT?.buttonOutlineColor}`,
        },
      }}
      {...props}
    >
      {children}
      {Icon && (
        <Icon
          aria-hidden
          css={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            transition: "transform ease 300ms, fill ease 300ms",
            '[aria-expanded="true"] &': {
              transform: "translateY(-50%) rotate(90deg)",
            },
          }}
        />
      )}
    </ReactAccordionItemButton>
  );
};

export default AccordionButton;
