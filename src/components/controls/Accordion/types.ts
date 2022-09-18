import { BasicState, StyleOrFunction } from '@scripts/theme';

export enum AccordionVariants {
  primary = 'primary',
  dark = 'dark',
}

export enum AccordionSize {
  md = 'md',
}

export interface AccordionState {
  isIconVertical?: boolean;
  panelNoPadding?: boolean;
}

export type AccordionStateFull = BasicState<
  typeof AccordionVariants,
  typeof AccordionSize
> &
  AccordionState;

type AccordionThemePart = StyleOrFunction<AccordionStateFull>;

export interface AccordionTheme {
  root: AccordionThemePart;
  item: AccordionThemePart;
  heading: AccordionThemePart;
  button: AccordionThemePart;
  panel: AccordionThemePart;
}
