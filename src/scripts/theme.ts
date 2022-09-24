import { CSSObject } from '@emotion/react';
import { useCallback, useMemo } from 'react';

export type BasicState<V, S, T = never> = {
  variant: V | keyof V;
  size: S | keyof S;
  theme?: T;
};

export type StyleOrFunction<FullState extends BasicState<any, any, any>> =
  | CSSObject
  | ((state: Omit<FullState, 'theme'>) => CSSObject);

// type Guard<T, S extends BasicState<any,any,any>> = T extends StyleOrFunction<infer R extends S>
//       ? (Omit<R, keyof S> extends never ? Partial<S> : never)
//       : never;

export const useThemeCSSPart = <
  T,
  S extends BasicState<any, any, any>,
  K extends keyof T,
>(
  theme: T,
  state: S,
) =>
  useCallback(
    (
      key: K,
      extraData?: T[K] extends StyleOrFunction<infer U>
        ? Omit<U, keyof S> extends never
          ? never
          : Partial<Omit<U, keyof S>>
        : never,
    ) => {
      const element = theme[key];
      if (typeof element === 'function')
        return element(
          extraData ? { ...state, ...extraData } : state,
        ) as CSSObject;
      return element as CSSObject;
    },
    [state, theme],
  );

// TODO: return components object and hook that returns useMemo
export const useThemeCSS = <T extends { [key: string]: any }, S>(
  theme: T,
  state: S,
) =>
  useMemo(() => {
    const res: Record<string, any> = {};
    const keys = Object.keys(theme);

    keys.forEach((key) => {
      const element = theme[key];
      if (typeof element === 'function') res[key] = element(state);
      else res[key] = element;
    });

    return res as Record<keyof T, CSSObject>;
  }, [state, theme]);
