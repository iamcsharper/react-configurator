import { fastLog2, getNextPowerOfTwo } from '@scripts/helpers';
import { useState, useEffect, useCallback, useRef } from 'react';

export enum ByteTableFormat {
  BIN = 'BIN',
  INT = 'INT',
  UINT = 'UINT',
  HEX = 'HEX',
}

const parseValue = (value?: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  if (value.startsWith('0x')) {
    // hex
    return parseInt(value.replace('0x', ''), 16);
  }

  if (value.startsWith('0b')) {
    return parseInt(value.replace('0b', ''), 2);
  }

  return parseInt(value, 10);
};

const formatValue = (value: string | number, format: ByteTableFormat) => {
  const parsedValue = parseValue(value);

  if (parsedValue === null) {
    console.error('error parseing value:', value);
    return '';
  }

  if (format === ByteTableFormat.BIN) {
    const nextPower = fastLog2(getNextPowerOfTwo(parsedValue));
    const padLength = Math.min(nextPower, 32);
    return `0b${parsedValue.toString(2).padStart(padLength, '0')}`;
  }

  if (format === ByteTableFormat.HEX) {
    // const nextPower = getNextPowerOfSixteen(parsedValue);
    // const padLength = Math.min(nextPower, 4);
    return `0x${parsedValue.toString(16).toUpperCase()}`;
  }

  return parsedValue.toString(10);
};

export const formats = [
  {
    key: 'Целое',
    value: ByteTableFormat.INT,
  },
  {
    key: '2-чный',
    value: ByteTableFormat.BIN,
  },

  {
    key: '16-ричный',
    value: ByteTableFormat.HEX,
  },
];

export const useAllFormatsValue = (
  initialValue: number,
  initialFormat: ByteTableFormat = ByteTableFormat.INT,
) => {
  const [decValue, setDecValue] = useState(initialValue || 0);
  const currentDecValue = useRef<number>(initialValue || 0);
  const [format, setFormat] = useState(initialFormat);

  useEffect(() => {
    currentDecValue.current = initialValue;
    setDecValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setFormat(initialFormat);
  }, [initialFormat]);

  const formattedValue = formatValue(currentDecValue.current, format);

  const setValue = useCallback((val?: string | number) => {
    const result = parseValue(val) || 0;

    currentDecValue.current = result;

    setDecValue(result);

    return result;
  }, []);

  return {
    decValue,
    format,
    formattedValue,
    setValue,
    setFormat,
  };
};
