import {
  ElementType,
  ComponentPropsWithRef,
  LegacyRef,
  MutableRefObject,
  RefCallback,
} from 'react';

import { Schema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type MergeElementProps<T extends ElementType, P extends object = {}> =
  Omit<ComponentPropsWithRef<T>, keyof P> & P;

export const scale = (n: number, isMinor?: boolean) => {
  const prime = isMinor ? 4 : 8;
  return n * prime;
};

/**
 * @param color #FFAAFF
 * @param alpha 0...1
 * @returns
 */
export const rgba = (color: string, alpha: number) => {
  const cleanColor = color.replace(/ /g, '');
  if (cleanColor.includes('rgb(')) {
    const values = cleanColor
      .replace(/rgb[a]*\((.*)\)/g, '\\$1')
      .split(',')
      .map(Number);
    values.length = 4;
    values[3] = alpha;
    return `rgba(${values.join(',')})`;
  }

  // hex
  const trunc = Math.floor(alpha * 255);
  return `${cleanColor}${trunc.toString(16)}`;
};

export function mergeRefs<T = any>(
  refs: Array<MutableRefObject<T> | LegacyRef<T>>,
): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const isScrollable = (ele: HTMLElement | null) => {
  if (!ele) return false;
  const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

  return hasScrollableContent && !isOverflowHidden;
};

export const getScrollParent = (ele: HTMLElement | null): HTMLElement | null =>
  // eslint-disable-next-line no-nested-ternary
  !ele || ele === document.body
    ? document.body
    : isScrollable(ele)
    ? ele
    : getScrollParent(ele.parentElement);

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>> & {
    readonly length: L;
    [I: number]: T;
    [Symbol.iterator]: () => IterableIterator<T>;
  };

export const getNextPowerOfTwo = (value: number): number => {
  let result = value;
  // eslint-disable-next-line no-plusplus
  result--;
  result |= result >> 1;
  result |= result >> 2;
  result |= result >> 4;
  result |= result >> 8;
  result |= result >> 16;
  // eslint-disable-next-line no-plusplus
  result++;

  return result;
};

// TODO: opimize to bitwise
export const getNextPowerOfSixteen = (n: number) => {
  if (n < 16) return 16;
  let p = 1;
  while (p < n) p <<= 4;
  return p;
};

export const fastLog2 = (V: number) => {
  let c = V;
  // eslint-disable-next-line no-plusplus
  for (let n = 31; n > 0; c >>> n ? ((c = n), (n = 0)) : n--);
  return c;
};

export const withValidation = (schema: Schema) => ({
  resolver: zodResolver(schema),
});
