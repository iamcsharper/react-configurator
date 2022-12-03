import Mask from '@components/controls/Mask';
import FormSelect, { Select } from '@components/controls/NewSelect';
import Table from '@components/Table';
import { fastLog2, getNextPowerOfTwo, scale } from '@scripts/helpers';

import { ZodSchema } from 'zod';

import { CellContext, ColumnDef, RowData } from '@tanstack/react-table';
import {
  memo,
  useMemo,
  useState,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  useTransition,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateBack } from '@fortawesome/free-solid-svg-icons';

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
    validationSchema?: ZodSchema;
    defaultValue: number[];
  }
}

export interface ByteTableProps {
  addrCol?: ColumnDef<ByteTableRow>;
  value: number[];
  defaultValue: number[];
  onChange?: (data: number[]) => void;
  validationSchema?: ZodSchema;
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
    // const nextPower = getNextPowerOfSixteen(parsedValue);
    // const padLength = Math.min(nextPower, 4);
    return `0x${parsedValue.toString(16).toUpperCase()}`;
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
    if (decValue === null || decValue === undefined) return {};

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
  const { onChangeRowRef, sharedFormat, validationSchema, defaultValue } =
    meta || {};
  const { decValue, format, formattedValue, setValue, setFormat } =
    useAllFormatsValue(getValue() as number, sharedFormat);

  const masks = useMemo(
    () => [
      {
        mask: Number,
      },
      {
        mask: '{\\0b}#### #### #### ####',
        definitions: { '#': /[0-1]/gi },
      },
      {
        mask: '{\\0x}#### ####',
        definitions: { '#': /[0-9a-f]/gi },
        prepare: (s: string) => s.toUpperCase(),
      },
    ],
    [],
  );

  const [val, setVal] = useState(formattedValue);
  useEffect(() => {
    setVal(formattedValue);
  }, [formattedValue]);

  const error = useMemo(() => {
    const parse = validationSchema?.safeParse(val);

    if (!parse || parse.success) return undefined;
    return parse.error.issues.map((e) => e.message).join('; ');
  }, [val, validationSchema]);

  const formatChangeRef = useRef(false);

  const [, setTransition] = useTransition();

  const defaultVal = defaultValue?.[index];
  const isDefaultValue = defaultVal === decValue;

  const maskRef = useRef<any>();

  const onResetDefault = useCallback(() => {
    setFormat(ByteTableFormat.INT);
    setVal(`${defaultVal}`);

    setTransition(() => {
      setValue(defaultVal);
    });

    if (typeof maskRef.current?.element?.focus === 'function')
      maskRef.current.element.focus();
  }, [defaultVal, setFormat, setValue]);

  return (
    <div css={{ display: 'flex', width: '100%', alignItems: 'start' }}>
      <Mask
        ref={maskRef}
        name={`value-${index}`}
        id={`value-${index}`}
        mask={masks}
        value={val}
        autoComplete="off"
        rightAddons={
          !isDefaultValue && (
            <button type="button" onClick={onResetDefault}>
              <FontAwesomeIcon icon={faRotateBack} />
            </button>
          )
        }
        onBlur={(e) => {
          e.preventDefault();

          setTimeout(() => {
            if (!error) {
              const dec = setValue(val);
              onChangeRowRef?.current?.(index, dec);
            }
          }, 0);
        }}
        size="md"
        error={error}
        onAccept={(newVal) => {
          if (formatChangeRef.current) {
            formatChangeRef.current = false;
            return;
          }
          setVal(newVal);

          setTransition(() => {
            setValue(newVal);
          });
        }}
        dispatch={(appended, dynamicMasked) => {
          const ignore = formatChangeRef.current;
          if (formatChangeRef.current) {
            formatChangeRef.current = false;
          }
          const { value } = dynamicMasked;
          const newVal = value + appended;

          if (newVal.substring(0, 2) === '0b') {
            if (!ignore) setFormat(ByteTableFormat.BIN);
            return dynamicMasked.compiledMasks[1];
          }

          if (newVal.substring(0, 2) === '0x') {
            if (!ignore) setFormat(ByteTableFormat.HEX);
            return dynamicMasked.compiledMasks[2];
          }

          if (!ignore) setFormat(ByteTableFormat.INT);
          return dynamicMasked.compiledMasks[0];
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
          formatChangeRef.current = true;
          setFormat(newFormat.value);
        }}
        options={formats}
      />
    </div>
  );
};

const ByteTable = forwardRef<HTMLDivElement, ByteTableProps>(
  (
    {
      addrCol = defaultAddrCol,
      value,
      defaultValue,
      onChange,
      validationSchema,
    },
    outerRef,
  ) => {
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

    const [sharedFormat, setSharedFormat] = useState<
      ByteTableFormat | undefined
    >(ByteTableFormat.INT);

    const selectedFormatOption = useMemo(
      () => formats.filter((e) => e.value === sharedFormat),
      [sharedFormat],
    );

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

    const tableOptions = useMemo(
      () => ({
        meta: {
          onChangeRowRef,
          sharedFormat,
          validationSchema,
          defaultValue,
        },
      }),
      [defaultValue, sharedFormat, validationSchema],
    );

    return (
      <div ref={ref}>
        <Select
          options={formats}
          placeholder="Формат"
          size="md"
          selected={selectedFormatOption}
          onChange={(payload) => {
            setSharedFormat(payload.selected?.value);
          }}
          css={{
            maxWidth: 'fit-content',
            marginLeft: 'auto',
          }}
        />
        <Table
          columns={columns}
          data={data}
          css={{
            overflow: 'unset',
          }}
          options={tableOptions}
        />
      </div>
    );
  },
);

ByteTable.displayName = 'ByteTable';

export default memo(ByteTable);
