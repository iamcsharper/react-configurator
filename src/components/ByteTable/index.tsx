import Mask from '@components/controls/Mask';
import Select, { OptionShape } from '@components/controls/NewSelect';
import Table from '@components/Table';
import {
  fastLog2,
  getNextPowerOfSixteen,
  getNextPowerOfTwo,
  scale,
} from '@scripts/helpers';

import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState, forwardRef, useCallback, useEffect } from 'react';

export interface ByteTableRow {
  address: string;
  value: number;
}

export interface ByteTableProps {
  addrCol?: ColumnDef<ByteTableRow>;
  value: number[];
  onChange?: (data: number[]) => void;
}

const defaultAddrCol: ColumnDef<ByteTableRow> = {
  accessorKey: 'address',
  header: 'Адрес',
  cell: ({ getValue }) => `${getValue()}`,
};

export enum ByteTableFormat {
  BIN = 'bin',
  DEC = 'dec',
  HEX = 'hex',
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
    const nextPower = getNextPowerOfSixteen(parsedValue);
    const padLength = Math.min(nextPower, 8);
    return `0x${parsedValue
      .toString(16)
      .toUpperCase()
      .padStart(padLength, '0')}`;
  }

  return parsedValue.toString(10);
};

const ByteTable = forwardRef<HTMLDivElement, ByteTableProps>(
  ({ addrCol = defaultAddrCol, value, onChange }, ref) => {
    const [data, setData] = useState(() =>
      value.map((e, i) => ({
        address: `R${i}`,
        value: +e,
      })),
    );

    useEffect(() => {
      console.log('ByteTable Value changed!', value);
    }, [value]);

    const onChangeRow = useCallback(
      (row: number, newValue: number) => {
        if (!onChange) return;

        const newData = value.map((e, r) => {
          if (r === row) return newValue;
          return e;
        });

        onChange(newData);
      },
      [value, onChange],
    );

    const columns = useMemo<ColumnDef<ByteTableRow>[]>(
      () => [
        addrCol,
        {
          accessorKey: 'value',
          header: 'Значение',
          // eslint-disable-next-line react/no-unstable-nested-components
          cell: function Cell({ row: { index } }) {
            const formats = useMemo(
              () => [
                {
                  key: '10-чный',
                  value: ByteTableFormat.DEC,
                },
                {
                  key: '2-чный',
                  value: ByteTableFormat.BIN,
                },

                {
                  key: '16-ричный',
                  value: ByteTableFormat.HEX,
                },
              ],
              [],
            );

            const [format, setFormat] = useState<
              Omit<OptionShape, 'value'> & { value: ByteTableFormat }
            >(formats[0]);

            const maskProps = useMemo(() => {
              if (format.value === ByteTableFormat.DEC) return { mask: '0000' };
              if (format.value === ByteTableFormat.HEX)
                return {
                  mask: '{\\0x}####',
                  definitions: { '#': /[0-9a-f]/gi },
                  prepare: (s: string) => s.toUpperCase(),
                };
              if (format.value === ByteTableFormat.BIN)
                return { mask: '{\\0b}00000000' };

              return { mask: Number };
            }, [format]);

            const [cellValue, setCellValue] = useState(`${data[index].value}`);

            return (
              <div css={{ display: 'flex', width: '100%' }}>
                <Mask
                  {...maskProps}
                  value={cellValue}
                  onBlur={() => {
                    setTimeout(() => {
                      onChangeRow(index, parseValue(cellValue)!);
                    }, 0);
                  }}
                  onAccept={(val) => {
                    setTimeout(() => {
                      setCellValue(val);
                    }, 0);
                  }}
                  lazy={false}
                />
                <Select
                  fieldProps={{
                    tabIndex: -1,
                  }}
                  css={{
                    minWidth: scale(20),
                  }}
                  // fieldCSS={{
                  //   borderTopLeftRadius: '0!important',
                  //   borderBottomLeftRadius: '0!important',
                  // }}
                  value={format.value}
                  onChange={(e) => {
                    const newFormat = formats.find((f) => f.value === e)!;
                    setFormat(newFormat);

                    setCellValue((old) => formatValue(old, newFormat.value));
                  }}
                  options={formats}
                />
              </div>
            );
          },
        },
      ],
      [addrCol, data, onChangeRow],
    );

    return (
      <div ref={ref}>
        <Table
          columns={columns}
          data={data}
          css={{
            overflow: 'unset',
          }}
        />
      </div>
    );
  },
);

export default ByteTable;
