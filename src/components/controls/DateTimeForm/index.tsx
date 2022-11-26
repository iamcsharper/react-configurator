import { colors } from '@scripts/colors';
import { parseSafeInt, scale, formatRHFError } from '@scripts/helpers';
import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { ControllerFieldState } from 'react-hook-form';

import Mask from '../Mask';
import { Select, OptionShape } from '../NewSelect';
import Button from '../Button';

export interface DateTimeFormValues {
  weekDay: number | null;
  day: number | null;
  month: number | null; // 0 ... 11, 0 - январь
  year: number | null;

  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

export interface DateFormProps {
  value?: DateTimeFormValues;
  error?: string;
  fieldState?: ControllerFieldState;
  defaultValue?: DateTimeFormValues;
  onChange?: (value: DateTimeFormValues) => void;
}

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const INITIAL_VALUES: DateTimeFormValues = {
  day: null,
  month: null,
  year: null,
  weekDay: null,

  hours: null,
  minutes: null,
  seconds: null,
};

const getTerm = (val: number | null) =>
  val === null ? 'XX' : `${val}`.padStart(2, '0');

const optionsHours = [...Array(24)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const optionsMinutes = [...Array(60)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const optionsSeconds = [...Array(60)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const valueToDate = (value: DateTimeFormValues) => {
  const { day, month, year } = value;

  const dateStr = `${Number(month) + 1}-${day}-${year}`;
  const tryDate = new Date(dateStr);

  if (tryDate.getMonth() !== month) {
    return undefined;
  }

  return tryDate;
};

const DateForm = (
  {
    value,
    error: propsError,
    fieldState,
    defaultValue = INITIAL_VALUES,
    onChange: onChangeProp,
  }: DateFormProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ref?: any,
) => {
  const optionsMonths = useMemo<OptionShape[]>(
    () =>
      months.map((month, index) => ({
        key: month,
        value: index,
      })),
    [],
  );

  const [innerValue, setInnerValue] =
    useState<DateTimeFormValues>(defaultValue);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isTouched, setTouched] = useState(false);

  useEffect(() => {
    const newVal: DateTimeFormValues = {
      day: parseSafeInt(value?.day),
      month: parseSafeInt(value?.month),
      weekDay: parseSafeInt(value?.weekDay),
      year: parseSafeInt(value?.year),
      hours: parseSafeInt(value?.hours),
      minutes: parseSafeInt(value?.minutes),
      seconds: parseSafeInt(value?.seconds),
    };
    setInnerValue(newVal);

    const tryDate = valueToDate(newVal);
    setSelectedDate(tryDate);
  }, [value]);

  const selectedMonth =
    optionsMonths.find((e) => e.value === innerValue.month) || null;

  const dateHash = useMemo(
    () => Object.values(innerValue).join('-'),
    [innerValue],
  );

  useEffect(() => {
    if (!isTouched) return;

    const tryDate = valueToDate(innerValue);

    if (tryDate) {
      setInnerValue((old) => {
        old.weekDay = tryDate.getDay();
        return old;
      });
    }
    setSelectedDate(tryDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateHash]);

  const rhfError = useMemo(
    () => formatRHFError(fieldState?.error),
    [fieldState?.error],
  );

  const error = rhfError || propsError;

  const formattedTime = useMemo(
    () =>
      [innerValue.hours, innerValue.minutes, innerValue.seconds]
        .map(getTerm)
        .join(':'),
    [innerValue],
  );

  const formatted = useMemo(() => {
    if (!selectedDate) return '';

    const dateFormatted = selectedDate.toLocaleString('ru-RU', {
      dateStyle: 'full',
    });

    return `${dateFormatted} ${formattedTime}`;
  }, [formattedTime, selectedDate]);

  const onChangePropRef = useRef<typeof onChangeProp>();
  onChangePropRef.current = onChangeProp;

  const currentValueRef = useRef<typeof innerValue>();
  currentValueRef.current = innerValue;

  const onChange = useCallback(() => {
    setTimeout(() => {
      onChangePropRef.current?.(currentValueRef.current!);
    }, 0);
  }, []);

  return (
    <div>
      <div
        css={{
          border: `1px solid ${colors?.autofill}`,
          padding: scale(1),
          marginBottom: scale(1),
        }}
      >
        <strong>Выбрана дата:</strong>
        <p>{formatted}</p>
        {error && <p css={{ color: colors.negative }}>{error}</p>}
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: scale(1),
        }}
      >
        <div>
          <Mask
            label="Год"
            mask="0000"
            value={`${innerValue.year || ''}`}
            autoComplete="off"
            onBlur={(e) => {
              e.preventDefault();

              onChange();
            }}
            error={!!error}
            size="md"
            onAccept={(newVal) => {
              setInnerValue((old) => ({
                ...old,
                year: parseSafeInt(newVal),
              }));

              setTouched(true);
            }}
          />
        </div>
        <Select
          options={optionsMonths}
          label="Месяц"
          onChange={(month) => {
            setInnerValue((old) => ({
              ...old,
              month: parseSafeInt(month?.selected?.value),
            }));

            setTouched(true);

            onChange();
          }}
          error={!!error}
          selected={selectedMonth}
        />
        <div>
          <Mask
            label="Число"
            mask={Number}
            min={1}
            max={31}
            lazy={false}
            value={`${innerValue.day || ''}`}
            error={!!error}
            autoComplete="off"
            onBlur={(e) => {
              e.preventDefault();

              onChange();
            }}
            size="md"
            // error={error}
            onAccept={(newVal) => {
              setInnerValue((old) => ({
                ...old,
                day: parseSafeInt(newVal),
              }));

              setTouched(true);
            }}
          />
        </div>
        <Select
          options={optionsHours}
          label="Часы"
          onChange={(val) => {
            setInnerValue((old) => ({
              ...old,
              hours: parseSafeInt(val.selected?.value),
            }));

            setTouched(true);

            onChange();
          }}
          error={!!error}
          selected={
            optionsHours.find((e) => e.value === innerValue.hours) || null
          }
        />
        <Select
          options={optionsMinutes}
          label="Минуты"
          error={!!error}
          onChange={(val) => {
            setInnerValue((old) => ({
              ...old,
              minutes: parseSafeInt(val.selected?.value),
            }));

            setTouched(true);

            onChange();
          }}
          selected={
            optionsMinutes.find((e) => e.value === innerValue.minutes) || null
          }
        />
        <Select
          options={optionsSeconds}
          label="Секунды"
          error={!!error}
          onChange={(val) => {
            setInnerValue((old) => ({
              ...old,
              seconds: parseSafeInt(val.selected?.value),
            }));

            setTouched(true);

            onChange();
          }}
          selected={
            optionsSeconds.find((e) => e.value === innerValue.seconds) || null
          }
        />
      </div>
      <div css={{ marginTop: scale(1) }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const weekDay = date.getDay();

            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            setInnerValue({
              day,
              month,
              weekDay,
              year,
              hours,
              minutes,
              seconds,
            });

            setTouched(true);

            onChange();
          }}
        >
          Взять дату с компьютера
        </Button>
      </div>
    </div>
  );
};

DateForm.displayName = 'DateForm';

export default forwardRef(DateForm);
