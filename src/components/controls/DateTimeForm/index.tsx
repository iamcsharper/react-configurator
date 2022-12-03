import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { forwardRef, useEffect, useMemo, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import Mask from '../Mask';
import Select, { OptionShape } from '../NewSelect';
import Button from '../Button';
import Form from '../Form';

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
  name: string;
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
  { name }: DateFormProps,
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

  const { watch, setValue } = useFormContext();
  const innerValue = watch(name);

  // const [innerValue, setInnerValue] =
  //   useState<DateTimeFormValues>(defaultValue);
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    const tryDate = valueToDate(innerValue);

    if (tryDate) {
      console.log('tryDate=', tryDate);
      // old.weekDay = tryDate.getDay();
    }
    setSelectedDate(tryDate);
  }, [innerValue]);

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
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: scale(1),
        }}
      >
        <Form.Field label="Год" name={`${name}.year`}>
          <Mask mask="0000" autoComplete="off" size="md" />
        </Form.Field>
        <Form.Field label="Месяц" name={`${name}.month`}>
          <Select options={optionsMonths} />
        </Form.Field>
        <Form.Field label="Число" name={`${name}.day`}>
          <Mask
            mask={Number}
            min={1}
            max={31}
            lazy={false}
            autoComplete="off"
            size="md"
          />
        </Form.Field>
        <Form.Field label="Часы" name={`${name}.hours`}>
          <Select options={optionsHours} />
        </Form.Field>
        <Form.Field label="Минуты" name={`${name}.minutes`}>
          <Select options={optionsMinutes} />
        </Form.Field>
        <Form.Field label="Секунды" name={`${name}.seconds`}>
          <Select options={optionsSeconds} />
        </Form.Field>
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

            setValue(
              name,
              {
                day,
                month,
                weekDay,
                year,
                hours,
                minutes,
                seconds,
              },
              {
                shouldTouch: true,
                shouldValidate: true,
              },
            );
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
