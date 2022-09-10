import cn from "classnames";
import { FC, HTMLProps, ReactNode } from "react";
import { Tab as ReactTab } from "react-tabs";

export interface TabsTabProps
  extends Omit<HTMLProps<HTMLLIElement>, "size" | "tabIndex"> {
  /** Heading content */
  children: ReactNode;
  /** Disabled tab */
  disabled?: boolean;
  /** Icon */
  Icon?: FC<any>;
  baseClass?: string;
  selected?: boolean;
}

export const TabsTab = ({
  children,
  className,
  Icon,
  baseClass,
  selected,
  ...props
}: TabsTabProps) => {
  const tabBaseClass = `${baseClass}__tab`;
  const classes = cn(tabBaseClass, className, selected && "selected");

  return (
    <ReactTab
      className={classes}
      {...props}
      selectedClassName="selected"
      disabledClassName="disabled"
    >
      <>
        {Icon && <Icon />}
        {children}
      </>
    </ReactTab>
  );
};

export default TabsTab;
