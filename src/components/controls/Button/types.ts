import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SVGRIcon } from '@customTypes/index';
import { BasicState, StyleOrFunction } from '@scripts/theme';

import { MergeElementProps } from '@scripts/helpers';
import { ElementType, ReactNode } from 'react';
import { CSSObject } from '@emotion/react';

export enum ButtonVariants {
  primary = 'primary',
  ghost = 'ghost',
  // TODO: secondary, success, warning, danger
}

export enum ButtonSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export interface ButtonState {
  hidden: boolean;
  disabled: boolean;
  hasChildren: boolean;
  block: boolean;
  iconAfter: boolean;
  rounded: boolean;
}

export type ButtonStateFull = BasicState<
  typeof ButtonVariants,
  typeof ButtonSize
> &
  ButtonState;

export interface ButtonTheme {
  button: StyleOrFunction<ButtonStateFull>;
  icon: StyleOrFunction<ButtonStateFull>;
}

export interface ButtonBaseProps
  extends Partial<
      BasicState<typeof ButtonVariants, typeof ButtonSize, ButtonTheme>
    >,
    Partial<ButtonState> {
  /** Button content. */
  children?: ReactNode;
  /** Block type. Use 100% of parent width. */
  block?: boolean;
  /** Icon. Accepts SVGR icon or custom JSX. */
  Icon?: SVGRIcon;
  FaIcon?: IconDefinition;
  /** Place icon after text. */
  iconAfter?: boolean;
  /** Visually hidden text. Keeps text accessible but visually shows only icons. Doesn't make sense without `Icon` prop. */
  hidden?: boolean;
  /** Open link in another browser tab. Additionaly adds `rel="nofollow noopener"`. */
  external?: boolean;
  /** Additional CSS. */
  css?: CSSObject;
}

export type ButtonProps<P extends ElementType = 'button'> = {
  /** Use your own React component for render. Main usage: pass `a` for external links or pass `Link` from `react-router` for routes management. */
  as?: P;
} & MergeElementProps<P, ButtonBaseProps>;
