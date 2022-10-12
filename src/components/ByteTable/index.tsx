import Select from '@components/controls/Select';
import { SelectItemProps } from '@components/controls/Select/types';
import Table from '@components/Table';
import { scale } from '@scripts/helpers';
import { usePrevious } from '@scripts/hooks/usePrevious';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface ByteTableRow {
  address: string;
  value: number;
}

export interface ByteTableProps {
  addrCol?: ColumnDef<ByteTableRow>;
  data: ByteTableRow[];
  setData?: Dispatch<SetStateAction<ByteTableRow[]>>;
  onChangeData?: (id: number, value: number) => void;
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

const parseValue = (value: string) =>
  value?.startsWith('0b')
    ? parseInt(value.replace('0b', ''), 2)
    : parseInt(value || '0', 10);

const ByteTable = ({
  addrCol = defaultAddrCol,
  data,
  setData,
  onChangeData,
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
                label: 'Десятичный',
                value: 'dec',
              },
              {
                label: 'Двоичный',
                value: 'bin',
              },
            ],
            [],
          );

          const [format, setFormat] = useState<SelectItemProps<string>>(
            formats[0],
          );

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

            if (format?.value === 'bin') {
              const parsedValue = parseValue(initialValue);
              setValue(`0b${parsedValue.toString(2).padStart(8, '0')}`);
            } else {
              setValue(initialValue);
            }
          }, [initialValue, format, prevInitialValue]);

          return (
            <div css={{ display: 'flex' }}>
              {/* TODO: masked input */}
              <input
                value={value as string}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                css={{ padding: scale(1) }}
              />
              <Select
                css={{
                  minWidth: scale(20),
                }}
                fieldCSS={{
                  borderTopLeftRadius: '0!important',
                  borderBottomLeftRadius: '0!important',
                }}
                selectedItem={format}
                onChange={(e) => {
                  setFormat(formats.find((f) => f.value === e)!);
                  const parsedValue = parseValue(value);

                  if (e === 'bin') {
                    setValue(`0b${parsedValue.toString(2).padStart(8, '0')}`);
                  } else {
                    setValue(parsedValue.toString(10));
                  }
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
      options={{
        meta: {
          updateData: (rowIndex, columnId, value) => {
            onChangeData?.(rowIndex, value as number);
            setData?.((old) =>
              old.map((row, index) => {
                if (index === rowIndex) {
                  return {
                    ...old[rowIndex]!,
                    [columnId]: value,
                  };
                }
                return row;
              }),
            );
          },
        },
      }}
    />
  );
};

export default ByteTable;
