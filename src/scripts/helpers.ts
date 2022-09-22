import { ElementType, ComponentPropsWithRef } from 'react';

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
