import { BasicState, StyleOrFunction } from '@scripts/theme';
import { ReactNode } from 'react';
import { To } from 'react-router-dom';

export enum NavLinkVariants {
  primary = 'primary',
  dark = 'dark',
}

export enum NavLinkSize {
  md = 'md',
}

export interface NavLinkState {
  // TODO: useMatch
  // isActive: boolean;
  rounded: boolean;
}

export type NavLinkStateFull = BasicState<
  typeof NavLinkVariants,
  typeof NavLinkSize
> &
  NavLinkState;

export interface NavLinkTheme {
  label: StyleOrFunction<NavLinkStateFull>;
  icon: StyleOrFunction<NavLinkStateFull>;
}

export interface NavLinkProps
  extends Partial<
      BasicState<typeof NavLinkVariants, typeof NavLinkSize, NavLinkTheme>
    >,
    Partial<NavLinkState> {
  to: To;
  children: ReactNode | ReactNode[];
  className?: string;
}

export const NAV_LINK_ACTIVE = 'active';
