import Table from '@components/Table';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface ByteTableRow {
  address: string;
  value: number;
}

export interface ByteTableProps {
  addrCol?: ColumnDef<ByteTableRow>;
  data: ByteTableRow[];
  setData: Dispatch<SetStateAction<ByteTableRow[]>>;
}

const defaultAddrCol: ColumnDef<ByteTableRow> = {
  accessorKey: 'address',
  header: 'Адрес',
  cell: ({ getValue }) => `R${getValue()}`,
};

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const ByteTable = ({
  addrCol = defaultAddrCol,
  data,
  setData,
}: ByteTableProps) => {
  const columns = useMemo<ColumnDef<ByteTableRow>[]>(
    () => [
      addrCol,
      {
        accessorKey: 'value',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const initialValue = getValue();
          // We need to keep and update the state of the cell normally
          const [value, setValue] = useState(initialValue);

          // When the input is blurred, we'll call our table meta's updateData function
          const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
          };

          // If the initialValue is changed external, sync it up with our state
          useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);

          return (
            <input
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
            />
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
            setData((old) =>
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
