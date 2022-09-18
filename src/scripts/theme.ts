import { CSSObject } from '@emotion/react';

export type BasicState<V, S, T = never> = {
  variant: V | keyof V;
  size: S | keyof S;
  theme?: T;
};

export type StyleOrFunction<FullState extends BasicState<any, any, any>> =
  | CSSObject
  | ((state: Omit<FullState, 'theme'>) => CSSObject);
