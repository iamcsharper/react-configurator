import Select from '@components/controls/Select';
import { SelectItemProps } from '@components/controls/Select/types';
import Table from '@components/Table';
import {
  fastLog2,
  getNextPowerOfSixteen,
  getNextPowerOfTwo,
  scale,
} from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { usePrevious } from '@scripts/hooks/usePrevious';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { useMemo, useState, useEffect } from 'react';

export interface ByteTableRow {
  address: string;
  value: number;
}

export interface ByteTableProps {
  addrCol?: ColumnDef<ByteTableRow>;
  data: ByteTableRow[];
  onChangeRow?: (rowIndex: number, value: number) => void;
}

const defaultAddrCol: ColumnDef<ByteTableRow> = {
  accessorKey: 'address',
  header: 'Адрес',
  cell: ({ getValue }) => `${getValue()}`,
};

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

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

const ByteTable = ({
  addrCol = defaultAddrCol,
  data,
  onChangeRow,
}: ByteTableProps) => {
  const columns = useMemo<ColumnDef<ByteTableRow>[]>(
    () => [
      addrCol,
      {
        accessorKey: 'value',
        header: 'Значение',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const formats = useMemo(
            () => [
              {
                label: '10-чный',
                value: ByteTableFormat.DEC,
              },
              {
                label: '2-чный',
                value: ByteTableFormat.BIN,
              },

              {
                label: '16-ричный',
                value: ByteTableFormat.HEX,
              },
            ],
            [],
          );

          const [format, setFormat] = useState<
            SelectItemProps<ByteTableFormat>
          >(formats[0]);

          const initialValue = getValue() as string;
          // We need to keep and update the state of the cell normally
          const [value, setValue] = useState(initialValue);

          // When the input is blurred, we'll call our table meta's updateData function
          const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
          };

          const prevInitialValue = usePrevious(initialValue);

          // If the initialValue is changed external, sync it up with our state
          useEffect(() => {
            if (initialValue === prevInitialValue) return;

            setValue(formatValue(initialValue, format.value));
          }, [initialValue, format, prevInitialValue]);

          const { basicFieldCSS } = useFieldCSS({});

          return (
            <div css={{ display: 'flex', width: '100%' }}>
              {/* TODO: masked input */}
              <input
                value={value as string}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                css={[
                  basicFieldCSS,
                  {
                    borderTopRightRadius: '0!important',
                    borderBottomRightRadius: '0!important',
                    borderRight: 'none',
                    minWidth: scale(30),
                    flexGrow: 2,
                  },
                ]}
              />
              <Select
                css={{
                  minWidth: scale(20),
                }}
                isClearable={false}
                fieldCSS={{
                  borderTopLeftRadius: '0!important',
                  borderBottomLeftRadius: '0!important',
                }}
                selectedItem={format}
                onChange={(e) => {
                  setFormat(formats.find((f) => f.value === e)!);
                  setValue(formatValue(initialValue, e as ByteTableFormat));
                }}
                items={formats}
              />
            </div>
          );
        },
      },
    ],
    [addrCol],
  );

  return (
    <Table
      columns={columns}
      data={data}
      css={{
        overflow: 'unset',
      }}
      options={{
        meta: {
          updateData: (rowIndex, _, value) => {
            onChangeRow?.(rowIndex, value as number);
          },
        },
      }}
    />
  );
};

export default ByteTable;
