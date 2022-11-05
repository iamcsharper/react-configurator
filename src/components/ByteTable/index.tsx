import Mask from '@components/controls/Mask';
import FormSelect, { Select } from '@components/controls/NewSelect';
import Table from '@components/Table';
import {
  fastLog2,
  getNextPowerOfSixteen,
  getNextPowerOfTwo,
  scale,
} from '@scripts/helpers';

import { CellContext, ColumnDef, RowData } from '@tanstack/react-table';
import {
  useMemo,
  useState,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

export interface ByteTableRow {
  address: string;
  value: number;
}

export enum ByteTableFormat {
  BIN = 'BIN',
  INT = 'INT',
  UINT = 'UINT',
  HEX = 'HEX',
}

type ChangeRowHandler = (row: number, value: number) => void;

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    onChangeRowRef: MutableRefObject<ChangeRowHandler>;
    sharedFormat?: ByteTableFormat;
  }
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

const useAllFormatsValue = (
  initialValue: number,
  initialFormat: ByteTableFormat = ByteTableFormat.INT,
) => {
  const [decValue, setDecValue] = useState(initialValue || 0);

  useEffect(() => {
    setDecValue(initialValue);
  }, [initialValue]);

  const formats = useMemo(() => {
    if (!decValue) return {};

    return Object.keys(ByteTableFormat).reduce((prev, cur) => {
      prev[cur] = formatValue(decValue, cur as never as ByteTableFormat);
      return prev;
    }, {} as Record<string, any>);
  }, [decValue]) as Record<ByteTableFormat, string | undefined>;

  const [format, setFormat] = useState(initialFormat);

  useEffect(() => {
    setFormat(initialFormat);
  }, [initialFormat]);

  const formattedValue = formats[format];

  const setValueParsed = useCallback((val?: string | number) => {
    const result = parseValue(val) || 0;
    setDecValue(result);

    return result;
  }, []);

  return {
    decValue,
    format,
    formattedValue,
    setValue: setValueParsed,
    setFormat,
  };
};

const formats = [
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
  {
    key: 'Целое беззнаковое',
    value: ByteTableFormat.UINT,
    disabled: true,
  },
];

const Header = () => (
  <div css={{ display: 'flex', gap: scale(1), alignItems: 'center' }}>
    <span>Значение</span>
  </div>
);

const Cell = ({
  getValue,
  table: {
    options: { meta },
  },
  row: { index },
}: CellContext<ByteTableRow, unknown>) => {
  const { onChangeRowRef, sharedFormat } = meta || {};
  const { format, formattedValue, setValue, setFormat } = useAllFormatsValue(
    getValue() as number,
    sharedFormat,
  );

  if (format === ByteTableFormat.HEX) {
    console.log('format:', format, 'formattedValue:', formattedValue);
  }

  const maskProps = useMemo(() => {
    if (format === ByteTableFormat.INT)
      return {
        mask: '000000000000',
      };
    if (format === ByteTableFormat.HEX)
      return {
        mask: '{\\0x }#### ####',
        definitions: { '#': /[0-9a-f]/gi },
        prepare: (s: string) => s.toUpperCase(),
      };
    if (format === ByteTableFormat.BIN)
      return {
        mask: '{\\0\\b }#### #### #### ####',
        definitions: { '#': /[0-1]/gi },
      };

    return { mask: Number };
  }, [format]);

  const [val, setVal] = useState(formattedValue);
  useEffect(() => {
    setVal(formattedValue);
  }, [formattedValue]);

  return (
    <div css={{ display: 'flex', width: '100%' }}>
      <Mask
        name={`value-${index}`}
        id={`value-${index}`}
        {...maskProps}
        value={val}
        autoComplete="off"
        onBlur={(e) => {
          e.preventDefault();
          const dec = setValue(val);
          onChangeRowRef?.current?.(index, dec);
        }}
        size="md"
        onAccept={(newVal) => {
          setVal(newVal);
        }}
      />
      <FormSelect
        name={`format-${index}`}
        id={`format-${index}`}
        css={{
          minWidth: scale(20),
        }}
        // fieldCSS={{
        //   borderTopLeftRadius: '0!important',
        //   borderBottomLeftRadius: '0!important',
        // }}
        value={format}
        onChange={(e) => {
          const newFormat = formats.find((f) => f.value === e)!;
          setFormat(newFormat.value);
        }}
        options={formats}
      />
    </div>
  );
};

const ByteTable = forwardRef<HTMLDivElement, ByteTableProps>(
  ({ addrCol = defaultAddrCol, value, onChange }, outerRef) => {
    const innerRef = useRef(null);
    const ref = mergeRefs([outerRef, innerRef]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [data, _setData] = useState(
      () =>
        value?.map((e, i) => ({
          address: `R${i}`,
          value: +e,
        })) || [],
    );

    useEffect(() => {
      console.log('ByteTable Value changed!', value);
      // TODO: setData ?
    }, [value]);

    const onChangeRow = useCallback(
      (row: number, newValue: number) => {
        if (!onChange) return;

        const newData = (value || []).map((e, r) => {
          if (r === row) return newValue;
          return e;
        });

        onChange(newData);
      },
      [value, onChange],
    );

    const onChangeRowRef = useRef<ChangeRowHandler>(onChangeRow);
    onChangeRowRef.current = onChangeRow;

    const [sharedFormat, setSharedFormat] =
      useState<ByteTableFormat | undefined>(undefined);

    const columns = useMemo<ColumnDef<ByteTableRow>[]>(
      () => [
        addrCol,
        {
          accessorKey: 'value',
          header: Header,
          cell: Cell,
        },
      ],
      [addrCol],
    );

    return (
      <div ref={ref}>
        <Select
          block
          options={formats}
          css={{ minWidth: scale(20) }}
          placeholder="Формат"
          size="sm"
          onChange={(payload) => {
            setSharedFormat(payload.selected?.value);
          }}
        />
        <Table
          columns={columns}
          data={data}
          css={{
            overflow: 'unset',
          }}
          options={{
            meta: {
              onChangeRowRef,
              sharedFormat,
            },
          }}
        />
      </div>
    );
  },
);

export default ByteTable;
