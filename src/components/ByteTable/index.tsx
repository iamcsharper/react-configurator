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
import { useMemo, useState, forwardRef, useCallback } from 'react';

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
    const data = useMemo(
      () =>
        value.map((e, i) => ({
          address: `R${i}`,
          value: +e,
        })),
      [value],
    );

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

            const mask = useMemo(() => {
              if (format.value === ByteTableFormat.DEC) return '0000';
              if (format.value === ByteTableFormat.HEX) return '{0x}0000';
              if (format.value === ByteTableFormat.BIN)
                return '0000000000000000';
            }, [format]);

            const [cellValue, setCellValue] = useState(`${data[index].value}`);

            return (
              <div css={{ display: 'flex', width: '100%' }}>
                <Mask
                  mask={mask}
                  value={cellValue}
                  onBlur={() => {
                    onChangeRow(index, parseValue(cellValue)!);
                  }}
                  onAccept={(val) => {
                    setCellValue(val);
                  }}
                  lazy={false}
                />
                <Select
                  css={{
                    minWidth: scale(20),
                  }}
                  // fieldCSS={{
                  //   borderTopLeftRadius: '0!important',
                  //   borderBottomLeftRadius: '0!important',
                  // }}
                  selected={format}
                  onChange={(e) => {
                    setFormat(
                      formats.find((f) => f.value === e.selected?.value)!,
                    );
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
