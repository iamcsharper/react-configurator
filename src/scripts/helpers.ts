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
  if (color.includes('rgb(')) {
    throw new Error('Unimplemented');
  }

  const trunc = Math.floor(alpha * 255);

  return `${color}${trunc.toString(16)}`;
};
